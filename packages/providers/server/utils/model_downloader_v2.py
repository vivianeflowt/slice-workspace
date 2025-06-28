"""
Model Downloader for Slice/ALIVE Providers Server

A production-ready model management system following OpenAI standards.
Supports model aliases, robust error handling, and resource-efficient downloads.

Features:
- OpenAI-compatible model naming (gpt-4-like aliases)
- Resource-constrained downloads (CPU-only, low priority)
- Comprehensive error handling and logging
- Model validation without memory loading
- Incremental downloads with resume capability
"""

import asyncio
import hashlib
import json
import logging
import os
import time
from enum import Enum
from pathlib import Path
from typing import Any, Dict, List, Optional, Set, Union
from dataclasses import dataclass, field

import psutil
import torch
from huggingface_hub import snapshot_download, HfApi
from transformers import AutoConfig, AutoTokenizer

# Configure environment for CPU-only operation
os.environ["CUDA_VISIBLE_DEVICES"] = ""
os.environ["MKL_NUM_THREADS"] = "1"
os.environ["OPENBLAS_NUM_THREADS"] = "1"
os.environ["OMP_NUM_THREADS"] = "1"

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class ModelType(str, Enum):
    """OpenAI-compatible model types."""
    TEXT_EMBEDDING = "text-embedding"
    TEXT_CLASSIFICATION = "text-classification"
    TEXT_GENERATION = "text-generation"
    CHAT_COMPLETION = "chat-completion"
    INSTRUCT = "instruct"


class DownloadStatus(str, Enum):
    """Download status enumeration."""
    PENDING = "pending"
    DOWNLOADING = "downloading"
    COMPLETED = "completed"
    FAILED = "failed"
    VALIDATING = "validating"
    CACHED = "cached"


@dataclass
class ModelSpec:
    """Model specification with OpenAI-like structure."""
    id: str
    name: str
    model_type: ModelType
    huggingface_id: str
    description: str = ""
    context_length: int = 4096
    parameters: str = "unknown"
    aliases: List[str] = field(default_factory=list)
    required_files: Set[str] = field(default_factory=lambda: {"config.json"})

    def __post_init__(self):
        """Add default required files."""
        self.required_files.update({"config.json"})


@dataclass
class DownloadResult:
    """Download operation result."""
    model_id: str
    status: DownloadStatus
    message: str
    path: Optional[str] = None
    size_mb: float = 0.0
    duration_seconds: float = 0.0
    error: Optional[str] = None


class ModelAliasRegistry:
    """Manages model aliases following OpenAI naming patterns."""

    def __init__(self):
        self._aliases: Dict[str, str] = {}
        self._models: Dict[str, ModelSpec] = {}
        self._setup_default_models()

    def _setup_default_models(self):
        """Initialize default model catalog with OpenAI-like naming."""
        default_models = [
            ModelSpec(
                id="embedding-ada-002",
                name="Text Embedding Ada 002",
                model_type=ModelType.TEXT_EMBEDDING,
                huggingface_id="sentence-transformers/all-MiniLM-L6-v2",
                description="High-performance text embedding model",
                context_length=512,
                parameters="23M",
                aliases=["text-embedding-ada-002", "ada-002"]
            ),
            ModelSpec(
                id="embedding-large",
                name="Text Embedding Large",
                model_type=ModelType.TEXT_EMBEDDING,
                huggingface_id="sentence-transformers/all-mpnet-base-v2",
                description="Large text embedding model for high accuracy",
                context_length=514,
                parameters="109M",
                aliases=["text-embedding-large", "mpnet-base"]
            ),
            ModelSpec(
                id="gpt-3.5-turbo-instruct",
                name="GPT-3.5 Turbo Instruct",
                model_type=ModelType.INSTRUCT,
                huggingface_id="microsoft/DialoGPT-medium",
                description="Instruction-following conversational model",
                context_length=4096,
                parameters="345M",
                aliases=["gpt-3.5-instruct", "turbo-instruct"]
            ),
            ModelSpec(
                id="text-classifier-roberta",
                name="RoBERTa Text Classifier",
                model_type=ModelType.TEXT_CLASSIFICATION,
                huggingface_id="cardiffnlp/twitter-roberta-base-sentiment-latest",
                description="Sentiment analysis and text classification",
                context_length=512,
                parameters="125M",
                aliases=["classifier-roberta", "sentiment-roberta"]
            )
        ]

        for model in default_models:
            self.register_model(model)

    def register_model(self, model: ModelSpec) -> None:
        """Register a model and its aliases."""
        self._models[model.id] = model

        # Register all aliases
        for alias in model.aliases:
            self._aliases[alias] = model.id

        # Also register the main ID as an alias to itself
        self._aliases[model.id] = model.id

    def resolve_alias(self, model_id: str) -> Optional[str]:
        """Resolve a model alias to its canonical ID."""
        return self._aliases.get(model_id)

    def get_model(self, model_id: str) -> Optional[ModelSpec]:
        """Get model specification by ID or alias."""
        canonical_id = self.resolve_alias(model_id)
        if canonical_id:
            return self._models.get(canonical_id)
        return None

    def list_models(self) -> List[ModelSpec]:
        """List all registered models."""
        return list(self._models.values())

    def list_aliases(self) -> Dict[str, str]:
        """List all aliases and their resolved IDs."""
        return self._aliases.copy()


class ResourceManager:
    """Manages system resources during downloads."""

    @staticmethod
    def configure_low_resource_mode() -> None:
        """Configure system for low-resource operation."""
        try:
            # Limit PyTorch to single thread
            torch.set_num_threads(1)
            torch.set_num_interop_threads(1)

            # Set CPU-only mode
            torch.set_default_tensor_type("torch.FloatTensor")

            # Configure HuggingFace Hub settings
            os.environ["HF_HUB_DOWNLOAD_TIMEOUT"] = "600"
            os.environ["HF_HUB_OFFLINE"] = "0"

            logger.info("✅ Low-resource mode configured")

        except Exception as e:
            logger.warning(f"⚠️ Failed to configure low-resource mode: {e}")

    @staticmethod
    def set_process_priority() -> None:
        """Set low process priority to prevent system freezing."""
        try:
            process = psutil.Process(os.getpid())

            if os.name == 'nt':  # Windows
                process.nice(psutil.BELOW_NORMAL_PRIORITY_CLASS)
            else:  # Linux/macOS
                process.nice(19)  # Lowest priority

                # Try to set I/O priority if available
                try:
                    process.ionice(psutil.IOPRIO_CLASS_IDLE)
                    logger.info("✅ I/O priority set to IDLE")
                except (AttributeError, OSError):
                    logger.debug("I/O priority control not available")

            logger.info("✅ Process priority set to low")

        except Exception as e:
            logger.warning(f"⚠️ Failed to set process priority: {e}")


class ModelValidator:
    """Validates downloaded models without loading into memory."""

    @staticmethod
    def validate_files(model_path: Path, required_files: Set[str]) -> bool:
        """Validate that required files exist."""
        try:
            for file_name in required_files:
                file_path = model_path / file_name
                if not file_path.exists():
                    logger.error(f"❌ Required file missing: {file_path}")
                    return False

            # Check for at least one model file
            model_files = (
                list(model_path.glob("*.bin")) +
                list(model_path.glob("*.safetensors")) +
                list(model_path.glob("*.onnx")) +
                list(model_path.glob("*.pt"))
            )

            if not model_files:
                logger.error(f"❌ No model files found in: {model_path}")
                return False

            logger.info(f"✅ File validation passed: {len(model_files)} model files found")
            return True

        except Exception as e:
            logger.error(f"❌ File validation error: {e}")
            return False

    @staticmethod
    def validate_config(model_path: Path) -> bool:
        """Validate model configuration file."""
        try:
            config_path = model_path / "config.json"
            if not config_path.exists():
                return False

            with open(config_path, 'r', encoding='utf-8') as f:
                config = json.load(f)

            # Basic validation - ensure it has required fields
            required_fields = ["architectures", "model_type"]
            for field in required_fields:
                if field not in config:
                    logger.warning(f"⚠️ Missing config field: {field}")

            logger.info("✅ Configuration validation passed")
            return True

        except Exception as e:
            logger.error(f"❌ Configuration validation error: {e}")
            return False

    @classmethod
    def validate_model(cls, model_path: Path, model_spec: ModelSpec) -> bool:
        """Complete model validation."""
        if not cls.validate_files(model_path, model_spec.required_files):
            return False

        if not cls.validate_config(model_path):
            return False

        return True


class ModelDownloader:
    """
    Production-ready model downloader following OpenAI patterns.

    Features:
    - Model aliases and canonical naming
    - Resource-efficient downloads
    - Comprehensive error handling
    - Progress tracking and logging
    """

    def __init__(self, cache_dir: Optional[str] = None):
        """Initialize the model downloader."""
        self.cache_dir = Path(cache_dir or self._get_default_cache_dir())
        self.registry = ModelAliasRegistry()
        self.hf_api = HfApi()

        # Ensure cache directory exists
        self.cache_dir.mkdir(parents=True, exist_ok=True)

        # Configure resources
        ResourceManager.configure_low_resource_mode()
        ResourceManager.set_process_priority()

        logger.info(f"📁 Model cache directory: {self.cache_dir}")

    @staticmethod
    def _get_default_cache_dir() -> str:
        """Get default cache directory."""
        try:
            from server.constants import MODEL_CACHE_DIR
            return MODEL_CACHE_DIR
        except ImportError:
            return str(Path.home() / ".cache" / "slice_models")

    def list_available_models(self) -> List[Dict[str, Any]]:
        """List all available models with their metadata."""
        models = []
        for model in self.registry.list_models():
            model_info = {
                "id": model.id,
                "name": model.name,
                "type": model.model_type.value,
                "description": model.description,
                "context_length": model.context_length,
                "parameters": model.parameters,
                "aliases": model.aliases,
                "huggingface_id": model.huggingface_id,
                "is_downloaded": self.is_model_downloaded(model.id)
            }
            models.append(model_info)

        return models

    def is_model_downloaded(self, model_id: str) -> bool:
        """Check if a model is already downloaded."""
        model_spec = self.registry.get_model(model_id)
        if not model_spec:
            return False

        model_path = self._get_model_path(model_spec)
        if not model_path.exists():
            return False

        return ModelValidator.validate_model(model_path, model_spec)

    def _get_model_path(self, model_spec: ModelSpec) -> Path:
        """Get the local path for a model."""
        # Use model ID as directory name for consistency
        safe_name = model_spec.id.replace("/", "--").replace(":", "_")
        return self.cache_dir / safe_name

    async def download_model(
        self,
        model_id: str,
        force_redownload: bool = False,
        max_retries: int = 3
    ) -> DownloadResult:
        """
        Download a model by ID or alias.

        Args:
            model_id: Model ID or alias
            force_redownload: Force redownload even if cached
            max_retries: Maximum retry attempts

        Returns:
            DownloadResult with operation details
        """
        start_time = time.time()

        # Resolve alias to canonical model ID
        model_spec = self.registry.get_model(model_id)
        if not model_spec:
            return DownloadResult(
                model_id=model_id,
                status=DownloadStatus.FAILED,
                message=f"Model not found: {model_id}",
                error=f"Unknown model ID or alias: {model_id}"
            )

        canonical_id = model_spec.id
        logger.info(f"📥 Starting download: {model_id} -> {canonical_id}")

        # Check if already downloaded
        if not force_redownload and self.is_model_downloaded(canonical_id):
            return DownloadResult(
                model_id=canonical_id,
                status=DownloadStatus.CACHED,
                message="Model already downloaded and validated",
                path=str(self._get_model_path(model_spec)),
                duration_seconds=time.time() - start_time
            )

        # Attempt download with retries
        last_error = None
        for attempt in range(1, max_retries + 1):
            try:
                logger.info(f"🔄 Attempt {attempt}/{max_retries} for {canonical_id}")

                result = await self._download_model_files(model_spec)
                if result.status == DownloadStatus.COMPLETED:
                    result.duration_seconds = time.time() - start_time
                    return result

                last_error = result.error

            except Exception as e:
                last_error = str(e)
                logger.error(f"❌ Download attempt {attempt} failed: {e}")

                if attempt < max_retries:
                    wait_time = 2 ** attempt  # Exponential backoff
                    logger.info(f"⏳ Waiting {wait_time}s before retry...")
                    await asyncio.sleep(wait_time)

        return DownloadResult(
            model_id=canonical_id,
            status=DownloadStatus.FAILED,
            message=f"Download failed after {max_retries} attempts",
            error=last_error,
            duration_seconds=time.time() - start_time
        )

    async def _download_model_files(self, model_spec: ModelSpec) -> DownloadResult:
        """Download model files using HuggingFace Hub."""
        try:
            model_path = self._get_model_path(model_spec)

            logger.info(f"📦 Downloading files for {model_spec.id}")
            logger.info(f"   🎯 Source: {model_spec.huggingface_id}")
            logger.info(f"   📁 Destination: {model_path}")

            # Download using snapshot_download (files only, no loading)
            downloaded_path = snapshot_download(
                repo_id=model_spec.huggingface_id,
                cache_dir=str(self.cache_dir),
                local_dir=str(model_path),
                local_dir_use_symlinks=False,
                resume_download=True,
                max_workers=1,  # Single thread for gentle downloading
            )

            # Calculate downloaded size
            total_size = sum(
                f.stat().st_size
                for f in Path(downloaded_path).rglob("*")
                if f.is_file()
            )
            size_mb = total_size / (1024 * 1024)

            # Validate downloaded files
            if ModelValidator.validate_model(Path(downloaded_path), model_spec):
                logger.info(f"✅ Download completed: {model_spec.id} ({size_mb:.1f} MB)")

                return DownloadResult(
                    model_id=model_spec.id,
                    status=DownloadStatus.COMPLETED,
                    message="Download and validation successful",
                    path=downloaded_path,
                    size_mb=size_mb
                )
            else:
                return DownloadResult(
                    model_id=model_spec.id,
                    status=DownloadStatus.FAILED,
                    message="Downloaded files failed validation",
                    error="File validation failed"
                )

        except Exception as e:
            logger.error(f"❌ Download error for {model_spec.id}: {e}")
            return DownloadResult(
                model_id=model_spec.id,
                status=DownloadStatus.FAILED,
                message="Download operation failed",
                error=str(e)
            )

    async def download_multiple_models(
        self,
        model_ids: List[str],
        force_redownload: bool = False
    ) -> Dict[str, DownloadResult]:
        """Download multiple models sequentially."""
        results = {}

        for model_id in model_ids:
            logger.info(f"📦 Processing model {model_id}")
            result = await self.download_model(model_id, force_redownload)
            results[model_id] = result

            # Brief pause between downloads to be gentle on resources
            await asyncio.sleep(1.0)

        return results

    def cleanup_cache(self) -> Dict[str, Any]:
        """Clean up temporary and orphaned files."""
        stats = {
            "files_removed": 0,
            "space_freed_mb": 0.0,
            "errors": []
        }

        try:
            # Remove temporary files
            temp_patterns = ["*.tmp", "*.temp", "*.lock"]
            for pattern in temp_patterns:
                for temp_file in self.cache_dir.rglob(pattern):
                    try:
                        size = temp_file.stat().st_size
                        temp_file.unlink()
                        stats["files_removed"] += 1
                        stats["space_freed_mb"] += size / (1024 * 1024)
                        logger.info(f"🗑️ Removed: {temp_file.name}")
                    except Exception as e:
                        stats["errors"].append(f"Failed to remove {temp_file}: {e}")

            # Remove empty directories
            for empty_dir in self.cache_dir.rglob("*"):
                if empty_dir.is_dir() and not any(empty_dir.iterdir()):
                    try:
                        empty_dir.rmdir()
                        logger.info(f"📁 Removed empty directory: {empty_dir.name}")
                    except Exception as e:
                        stats["errors"].append(f"Failed to remove directory {empty_dir}: {e}")

        except Exception as e:
            stats["errors"].append(f"Cache cleanup error: {e}")

        logger.info(f"✨ Cleanup completed: {stats['files_removed']} files, {stats['space_freed_mb']:.1f} MB freed")
        return stats


# CLI and utility functions
async def main():
    """Main CLI interface."""
    import sys

    if len(sys.argv) < 2:
        print("Usage: python model_downloader_v2.py <command> [args...]")
        print("Commands:")
        print("  list                    - List available models")
        print("  download <model_id>     - Download a specific model")
        print("  download-all            - Download all default models")
        print("  cleanup                 - Clean cache")
        print("  aliases                 - Show model aliases")
        return

    downloader = ModelDownloader()
    command = sys.argv[1]

    if command == "list":
        models = downloader.list_available_models()
        print(f"\n📦 Available Models ({len(models)} total):")
        for model in models:
            status = "✅ Downloaded" if model["is_downloaded"] else "⬇️ Available"
            print(f"  {model['id']} - {model['name']} ({status})")
            if model["aliases"]:
                print(f"    Aliases: {', '.join(model['aliases'])}")

    elif command == "download" and len(sys.argv) > 2:
        model_id = sys.argv[2]
        result = await downloader.download_model(model_id)

        if result.status == DownloadStatus.COMPLETED:
            print(f"✅ Download successful: {result.model_id}")
            print(f"   📁 Path: {result.path}")
            print(f"   💾 Size: {result.size_mb:.1f} MB")
            print(f"   ⏱️ Duration: {result.duration_seconds:.1f}s")
        else:
            print(f"❌ Download failed: {result.message}")
            if result.error:
                print(f"   Error: {result.error}")

    elif command == "download-all":
        models = [m["id"] for m in downloader.list_available_models()]
        results = await downloader.download_multiple_models(models)

        successful = sum(1 for r in results.values() if r.status == DownloadStatus.COMPLETED)
        total = len(results)

        print(f"\n📊 Download Summary: {successful}/{total} successful")
        for model_id, result in results.items():
            status_icon = "✅" if result.status == DownloadStatus.COMPLETED else "❌"
            print(f"  {status_icon} {model_id}: {result.message}")

    elif command == "cleanup":
        stats = downloader.cleanup_cache()
        print(f"🧹 Cache cleanup completed:")
        print(f"  Files removed: {stats['files_removed']}")
        print(f"  Space freed: {stats['space_freed_mb']:.1f} MB")
        if stats["errors"]:
            print(f"  Errors: {len(stats['errors'])}")

    elif command == "aliases":
        aliases = downloader.registry.list_aliases()
        print(f"\n🏷️ Model Aliases ({len(aliases)} total):")
        for alias, canonical_id in sorted(aliases.items()):
            if alias != canonical_id:  # Don't show self-references
                print(f"  {alias} -> {canonical_id}")

    else:
        print(f"Unknown command: {command}")


if __name__ == "__main__":
    asyncio.run(main())
