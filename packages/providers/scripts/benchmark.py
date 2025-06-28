#!/usr/bin/env python3
"""
⚡ Benchmark Script - Slice/ALIVE Providers Server
Benchmark de performance dos providers HuggingFace.

Princípios CONCEPTS.md:
- Baixo Recurso: Medição de uso de CPU/RAM
- Validação Forte: Métricas estruturadas e validadas
- Justificativa Real: Benchmarks para escolhas técnicas
- CPU-only: Otimização específica para CPU
"""

import json
import logging
import sys
import time
from datetime import datetime
from pathlib import Path
from statistics import mean, median

import psutil
from jsonschema import ValidationError, validate

# Configuração de logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Schema para validação de benchmark results
BENCHMARK_SCHEMA = {
    "type": "object",
    "properties": {
        "timestamp": {"type": "string"},
        "system_info": {
            "type": "object",
            "properties": {
                "cpu_count": {"type": "number"},
                "memory_total": {"type": "number"},
                "python_version": {"type": "string"},
            },
        },
        "benchmarks": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "provider": {"type": "string"},
                    "task": {"type": "string"},
                    "input_size": {"type": "number"},
                    "iterations": {"type": "number"},
                    "metrics": {
                        "type": "object",
                        "properties": {
                            "avg_time": {"type": "number"},
                            "median_time": {"type": "number"},
                            "min_time": {"type": "number"},
                            "max_time": {"type": "number"},
                            "throughput": {"type": "number"},
                            "memory_peak": {"type": "number"},
                            "cpu_usage": {"type": "number"},
                        },
                    },
                },
                "required": ["provider", "task", "metrics"],
            },
        },
    },
    "required": ["timestamp", "system_info", "benchmarks"],
}

# Textos para benchmark
BENCHMARK_TEXTS = {
    "short": "This is a test.",
    "medium": "This is a longer test sentence that should provide more realistic performance metrics for natural language processing tasks.",
    "long": "This is a much longer text that simulates real-world usage scenarios where users might input substantial amounts of content for processing. It includes multiple sentences, various punctuation marks, and should stress-test the models' ability to handle larger inputs efficiently while maintaining accuracy and reasonable performance metrics.",
    "very_long": " ".join(
        [
            "This is an extremely long text designed to test the limits of the model's performance.",
            "It contains multiple paragraphs, complex sentence structures, and varied vocabulary.",
            "The purpose is to simulate real-world scenarios where users might input large documents,",
            "articles, or other substantial text content that needs to be processed efficiently.",
            "Performance metrics from this test will help identify potential bottlenecks and",
            "optimization opportunities in the text processing pipeline.",
        ]
        * 5
    ),  # Repeat 5 times for extra length
}


class SystemMonitor:
    """Monitor de recursos do sistema durante benchmarks."""

    def __init__(self):
        self.process = psutil.Process()
        self.initial_memory = self.process.memory_info().rss
        self.peak_memory = self.initial_memory
        self.cpu_samples = []

    def start_monitoring(self):
        """Inicia monitoramento."""
        self.initial_memory = self.process.memory_info().rss
        self.peak_memory = self.initial_memory
        self.cpu_samples = []

    def sample(self):
        """Coleta amostra de uso de recursos."""
        current_memory = self.process.memory_info().rss
        self.peak_memory = max(self.peak_memory, current_memory)

        cpu_percent = self.process.cpu_percent()
        self.cpu_samples.append(cpu_percent)

    def get_metrics(self):
        """Retorna métricas coletadas."""
        memory_increase = self.peak_memory - self.initial_memory
        avg_cpu = mean(self.cpu_samples) if self.cpu_samples else 0

        return {"memory_peak": memory_increase, "cpu_usage": avg_cpu}


def load_providers():
    """
    Carrega providers para benchmark.

    Returns:
        dict: Mapeamento de provider_name -> provider_module
    """
    logger.info("📦 Carregando providers...")

    providers = {}

    try:
        # Classificação
        from server.providers.classify import huggingface as classify_hf

        providers["classify"] = classify_hf
        logger.info("✅ Provider classify carregado")

        # Embeddings
        from server.providers.embed import huggingface as embed_hf

        providers["embed"] = embed_hf
        logger.info("✅ Provider embed carregado")

        # POS Tagging
        from server.providers.pos_tag import huggingface as pos_tag_hf

        providers["pos_tag"] = pos_tag_hf
        logger.info("✅ Provider pos_tag carregado")

    except Exception as e:
        logger.error(f"❌ Erro ao carregar providers: {e}")

    return providers


def benchmark_provider(provider_name, provider_module, text, iterations=5):
    """
    Executa benchmark de um provider.

    Args:
        provider_name: Nome do provider
        provider_module: Módulo do provider
        text: Texto para teste
        iterations: Número de iterações

    Returns:
        dict: Resultados do benchmark
    """
    logger.info(
        f"⚡ Benchmarking {provider_name} - {len(text)} chars, {iterations} iterações"
    )

    monitor = SystemMonitor()
    times = []

    # Aquecimento (não conta para métricas)
    try:
        if provider_name == "classify":
            provider_module.classify_text(BENCHMARK_TEXTS["short"], task="sentiment")
        elif provider_name == "embed":
            provider_module.get_embeddings([BENCHMARK_TEXTS["short"]])
        elif provider_name == "pos_tag":
            provider_module.pos_tag_text(BENCHMARK_TEXTS["short"])
    except Exception as e:
        logger.warning(f"⚠️  Erro no aquecimento do {provider_name}: {e}")

    monitor.start_monitoring()

    # Benchmark real
    for i in range(iterations):
        monitor.sample()

        start_time = time.time()

        try:
            if provider_name == "classify":
                result = provider_module.classify_text(text, task="sentiment")
            elif provider_name == "embed":
                result = provider_module.get_embeddings([text])
            elif provider_name == "pos_tag":
                result = provider_module.pos_tag_text(text)
            else:
                raise ValueError(f"Provider {provider_name} não suportado")

            elapsed = time.time() - start_time
            times.append(elapsed)

            logger.debug(f"  Iteração {i+1}: {elapsed:.3f}s")

        except Exception as e:
            logger.error(f"❌ Erro na iteração {i+1} do {provider_name}: {e}")
            times.append(float("inf"))  # Marca como falha

        monitor.sample()

    # Filtrar falhas
    valid_times = [t for t in times if t != float("inf")]

    if not valid_times:
        logger.error(f"❌ Todas as iterações falharam para {provider_name}")
        return None

    # Calcular métricas
    resource_metrics = monitor.get_metrics()

    metrics = {
        "avg_time": mean(valid_times),
        "median_time": median(valid_times),
        "min_time": min(valid_times),
        "max_time": max(valid_times),
        "throughput": len(text) / mean(valid_times),  # chars/sec
        "memory_peak": resource_metrics["memory_peak"],
        "cpu_usage": resource_metrics["cpu_usage"],
    }

    result = {
        "provider": provider_name,
        "task": "default",  # Pode ser expandido para tasks específicos
        "input_size": len(text),
        "iterations": len(valid_times),
        "metrics": metrics,
    }

    logger.info(
        f"✅ {provider_name}: {metrics['avg_time']:.3f}s avg, {metrics['throughput']:.1f} chars/s"
    )

    return result


def get_system_info():
    """
    Coleta informações do sistema.

    Returns:
        dict: Informações do sistema
    """
    return {
        "cpu_count": psutil.cpu_count(),
        "memory_total": psutil.virtual_memory().total,
        "python_version": sys.version.split()[0],
        "cpu_freq": psutil.cpu_freq().current if psutil.cpu_freq() else None,
        "platform": sys.platform,
    }


def run_comprehensive_benchmark(providers, text_sizes=None, iterations=5):
    """
    Executa benchmark completo de todos os providers.

    Args:
        providers: Dict de providers carregados
        text_sizes: Lista de tamanhos de texto para testar
        iterations: Número de iterações por teste

    Returns:
        dict: Resultados completos do benchmark
    """
    if text_sizes is None:
        text_sizes = ["short", "medium", "long"]

    logger.info(
        f"⚡ Iniciando benchmark completo - {len(providers)} providers, {len(text_sizes)} tamanhos"
    )

    benchmarks = []

    for text_size in text_sizes:
        text = BENCHMARK_TEXTS[text_size]
        logger.info(f"\n📏 Testando tamanho '{text_size}' ({len(text)} caracteres)")

        for provider_name, provider_module in providers.items():
            result = benchmark_provider(
                provider_name, provider_module, text, iterations
            )
            if result:
                result["text_size"] = text_size
                benchmarks.append(result)

    report = {
        "timestamp": datetime.now().isoformat(),
        "system_info": get_system_info(),
        "benchmarks": benchmarks,
    }

    # Validar resultado
    try:
        validate(instance=report, schema=BENCHMARK_SCHEMA)
        logger.info("✅ Relatório de benchmark validado")
    except ValidationError as e:
        logger.warning(f"⚠️  Relatório inválido: {e.message}")

    return report


def display_benchmark_summary(report):
    """
    Exibe sumário dos resultados.

    Args:
        report: Relatório de benchmark
    """
    print("\n⚡ Resultados do Benchmark - Slice/ALIVE Providers")
    print("=" * 60)

    system_info = report["system_info"]
    print(
        f"🖥️  Sistema: {system_info['cpu_count']} CPUs, {system_info['memory_total'] // (1024**3)}GB RAM"
    )
    print(f"🐍 Python: {system_info['python_version']}")

    benchmarks = report["benchmarks"]

    # Agrupar por provider
    by_provider = {}
    for bench in benchmarks:
        provider = bench["provider"]
        if provider not in by_provider:
            by_provider[provider] = []
        by_provider[provider].append(bench)

    print(f"\n📊 Resumo por Provider:")
    print("-" * 60)

    for provider, provider_benchmarks in by_provider.items():
        print(f"\n🤖 {provider.upper()}:")

        for bench in provider_benchmarks:
            text_size = bench.get("text_size", "unknown")
            metrics = bench["metrics"]

            print(
                f"  📏 {text_size:8} ({bench['input_size']:4} chars): "
                f"{metrics['avg_time']:6.3f}s avg, "
                f"{metrics['throughput']:8.1f} chars/s, "
                f"{metrics['memory_peak'] // 1024:4.0f} KB mem"
            )

    # Comparação de performance relativa
    print(f"\n🏆 Ranking de Performance (chars/s):")
    print("-" * 60)

    # Calcular médias por provider
    provider_averages = {}
    for provider, provider_benchmarks in by_provider.items():
        throughputs = [bench["metrics"]["throughput"] for bench in provider_benchmarks]
        provider_averages[provider] = mean(throughputs)

    ranked_providers = sorted(
        provider_averages.items(), key=lambda x: x[1], reverse=True
    )

    for i, (provider, avg_throughput) in enumerate(ranked_providers):
        medal = ["🥇", "🥈", "🥉"][i] if i < 3 else f"{i+1:2}."
        print(f"  {medal} {provider:12}: {avg_throughput:8.1f} chars/s")


def compare_with_baseline(report, baseline_file=None):
    """
    Compara resultados com baseline anterior.

    Args:
        report: Relatório atual
        baseline_file: Arquivo de baseline (opcional)
    """
    if not baseline_file:
        baseline_file = Path("benchmark_baseline.json")

    if not baseline_file.exists():
        logger.info("📝 Nenhum baseline encontrado - salvando como baseline inicial")
        with open(baseline_file, "w") as f:
            json.dump(report, f, indent=2, default=str)
        return

    try:
        with open(baseline_file, "r") as f:
            baseline = json.load(f)

        logger.info("📈 Comparando com baseline...")

        # Comparação simples por provider
        current_averages = {}
        baseline_averages = {}

        # Calcular médias atuais
        for bench in report["benchmarks"]:
            provider = bench["provider"]
            throughput = bench["metrics"]["throughput"]
            if provider not in current_averages:
                current_averages[provider] = []
            current_averages[provider].append(throughput)

        # Calcular médias do baseline
        for bench in baseline["benchmarks"]:
            provider = bench["provider"]
            throughput = bench["metrics"]["throughput"]
            if provider not in baseline_averages:
                baseline_averages[provider] = []
            baseline_averages[provider].append(throughput)

        print(f"\n📈 Comparação com Baseline:")
        print("-" * 60)

        for provider in current_averages:
            if provider in baseline_averages:
                current_avg = mean(current_averages[provider])
                baseline_avg = mean(baseline_averages[provider])

                change_percent = ((current_avg - baseline_avg) / baseline_avg) * 100

                if change_percent > 5:
                    icon = "📈🟢"  # Melhoria significativa
                elif change_percent < -5:
                    icon = "📉🔴"  # Degradação significativa
                else:
                    icon = "➡️⚪"  # Estável

                print(
                    f"  {icon} {provider:12}: {change_percent:+6.1f}% "
                    f"({current_avg:.1f} vs {baseline_avg:.1f} chars/s)"
                )

    except Exception as e:
        logger.warning(f"⚠️  Erro ao comparar com baseline: {e}")


def main():
    """Executa benchmark dos providers."""
    import argparse

    parser = argparse.ArgumentParser(
        description="Benchmark de performance dos providers"
    )
    parser.add_argument(
        "--output",
        type=str,
        default="benchmark_report.json",
        help="Arquivo de saída do relatório",
    )
    parser.add_argument(
        "--iterations", type=int, default=5, help="Número de iterações por teste"
    )
    parser.add_argument(
        "--providers",
        nargs="*",
        choices=["classify", "embed", "pos_tag"],
        help="Providers específicos para testar",
    )
    parser.add_argument(
        "--text-sizes",
        nargs="*",
        choices=["short", "medium", "long", "very_long"],
        default=["short", "medium", "long"],
        help="Tamanhos de texto para testar",
    )
    parser.add_argument(
        "--compare-baseline", action="store_true", help="Comparar com baseline anterior"
    )
    parser.add_argument(
        "--quick", action="store_true", help="Benchmark rápido (menos iterações)"
    )

    args = parser.parse_args()

    logger.info("⚡ Iniciando Benchmark - Slice/ALIVE Providers Server")
    logger.info("=" * 60)

    # Ajustar parâmetros para quick mode
    if args.quick:
        iterations = 2
        text_sizes = ["short", "medium"]
        logger.info("🚀 Modo rápido ativado")
    else:
        iterations = args.iterations
        text_sizes = args.text_sizes

    # Carregar providers
    all_providers = load_providers()

    if args.providers:
        providers = {
            name: all_providers[name]
            for name in args.providers
            if name in all_providers
        }
    else:
        providers = all_providers

    if not providers:
        logger.error("❌ Nenhum provider disponível para benchmark")
        sys.exit(1)

    logger.info(f"🎯 Testando providers: {list(providers.keys())}")
    logger.info(f"📏 Tamanhos de texto: {text_sizes}")
    logger.info(f"🔄 Iterações por teste: {iterations}")

    # Executar benchmark
    start_time = time.time()
    report = run_comprehensive_benchmark(providers, text_sizes, iterations)
    elapsed_time = time.time() - start_time

    # Salvar relatório
    output_path = Path(args.output)
    with open(output_path, "w") as f:
        json.dump(report, f, indent=2, default=str)
    logger.info(f"💾 Relatório salvo em: {output_path}")

    # Exibir resultados
    display_benchmark_summary(report)

    # Comparação com baseline
    if args.compare_baseline:
        compare_with_baseline(report)

    logger.info(f"\n⚡ Benchmark concluído em {elapsed_time:.1f}s")
    logger.info("💡 Próximos passos:")
    logger.info("   1. Revisar resultados e identificar gargalos")
    logger.info("   2. Considerar otimizações baseadas nas métricas")
    logger.info("   3. Salvar como baseline para futuras comparações")


if __name__ == "__main__":
    main()
