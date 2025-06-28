#!/usr/bin/env python3
"""
📋 Logs Script - Slice/ALIVE Providers Server
Visualização e gerenciamento de logs do sistema.

Princípios CONCEPTS.md:
- Isolamento por Camada: Logs separados por componente
- Incrementalismo: Filtragem e análise incremental
- Baixo Recurso: Streaming eficiente de logs
- Validação Forte: Parsing estruturado de logs
"""

import json
import logging
import re
import sys
from datetime import datetime, timedelta
from pathlib import Path

# Configuração de logging para este script
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Padrões de log estruturado
LOG_PATTERNS = {
    "timestamp": r"(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})",
    "level": r"(DEBUG|INFO|WARNING|ERROR|CRITICAL)",
    "component": r"(\w+\.\w+|\w+)",
    "message": r"(.+)",
}

# Cores para output no terminal
COLORS = {
    "DEBUG": "\033[36m",  # Cyan
    "INFO": "\033[32m",  # Green
    "WARNING": "\033[33m",  # Yellow
    "ERROR": "\033[31m",  # Red
    "CRITICAL": "\033[35m",  # Magenta
    "RESET": "\033[0m",  # Reset
}


def find_log_files():
    """
    Encontra todos os arquivos de log disponíveis.

    Returns:
        dict: Mapeamento de tipo -> caminho do arquivo
    """
    log_files = {}
    search_paths = [
        Path.cwd(),
        Path.cwd() / "logs",
        Path("/var/log"),
        Path.home() / ".local" / "share" / "slice" / "logs",
    ]

    # Padrões de arquivo de log
    log_patterns = [
        "*.log",
        "server*.log",
        "providers*.log",
        "huggingface*.log",
        "uvicorn*.log",
    ]

    for search_path in search_paths:
        if search_path.exists():
            for pattern in log_patterns:
                for log_file in search_path.glob(pattern):
                    if log_file.is_file():
                        # Determinar tipo baseado no nome
                        name = log_file.stem.lower()
                        if "server" in name or "main" in name:
                            log_files["server"] = log_file
                        elif "provider" in name:
                            log_files["providers"] = log_file
                        elif "huggingface" in name or "model" in name:
                            log_files["models"] = log_file
                        elif "uvicorn" in name or "api" in name:
                            log_files["api"] = log_file
                        else:
                            log_files[name] = log_file

    return log_files


def parse_log_line(line):
    """
    Faz parsing de uma linha de log estruturado.

    Args:
        line: Linha do log

    Returns:
        dict: Componentes da linha parseada ou None se não conseguir
    """
    # Padrão geral: TIMESTAMP - LEVEL - COMPONENT - MESSAGE
    pattern = r"(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}(?:,\d{3})?)\s*-\s*(\w+)\s*-\s*(.+)"

    match = re.match(pattern, line.strip())
    if match:
        timestamp_str, level, rest = match.groups()

        # Tentar extrair componente do resto
        component_match = re.match(r"(\w+(?:\.\w+)?)\s*-\s*(.+)", rest)
        if component_match:
            component, message = component_match.groups()
        else:
            component = "unknown"
            message = rest

        try:
            timestamp = datetime.strptime(
                timestamp_str.split(",")[0], "%Y-%m-%d %H:%M:%S"
            )
        except ValueError:
            timestamp = None

        return {
            "timestamp": timestamp,
            "level": level,
            "component": component,
            "message": message,
            "raw": line.strip(),
        }

    return None


def filter_logs(lines, level=None, component=None, since=None, until=None, search=None):
    """
    Filtra linhas de log baseado em critérios.

    Args:
        lines: Lista de linhas parseadas
        level: Filtrar por nível (DEBUG, INFO, WARNING, ERROR, CRITICAL)
        component: Filtrar por componente
        since: Filtrar logs após esta data/hora
        until: Filtrar logs antes desta data/hora
        search: Buscar texto na mensagem

    Returns:
        list: Linhas filtradas
    """
    filtered = []

    for line in lines:
        # Filtro por nível
        if level and line.get("level") != level.upper():
            continue

        # Filtro por componente
        if component and component.lower() not in line.get("component", "").lower():
            continue

        # Filtro por data/hora
        if since and line.get("timestamp") and line["timestamp"] < since:
            continue

        if until and line.get("timestamp") and line["timestamp"] > until:
            continue

        # Filtro por busca de texto
        if search and search.lower() not in line.get("message", "").lower():
            continue

        filtered.append(line)

    return filtered


def colorize_log_line(line):
    """
    Adiciona cores a uma linha de log.

    Args:
        line: Linha parseada

    Returns:
        str: Linha colorizada
    """
    level = line.get("level", "INFO")
    color = COLORS.get(level, COLORS["RESET"])

    timestamp = line.get("timestamp")
    if timestamp:
        timestamp_str = timestamp.strftime("%H:%M:%S")
    else:
        timestamp_str = "??:??:??"

    component = line.get("component", "unknown")
    message = line.get("message", "")

    return (
        f"{color}[{timestamp_str}] {level:8} {component:15} {message}{COLORS['RESET']}"
    )


def tail_log_file(file_path, lines=50, follow=False):
    """
    Exibe últimas linhas de um arquivo de log.

    Args:
        file_path: Caminho do arquivo
        lines: Número de linhas para exibir
        follow: Se True, continua mostrando novas linhas (tail -f)
    """
    try:
        with open(file_path, "r") as f:
            # Ler últimas N linhas
            file_lines = f.readlines()
            last_lines = file_lines[-lines:] if len(file_lines) > lines else file_lines

            for line in last_lines:
                parsed = parse_log_line(line)
                if parsed:
                    print(colorize_log_line(parsed))
                else:
                    print(line.strip())

            # Follow mode (tail -f)
            if follow:
                logger.info("📡 Modo follow ativado - Ctrl+C para sair")
                while True:
                    try:
                        line = f.readline()
                        if line:
                            parsed = parse_log_line(line)
                            if parsed:
                                print(colorize_log_line(parsed))
                            else:
                                print(line.strip())
                    except KeyboardInterrupt:
                        logger.info("\n👋 Follow interrompido")
                        break

    except FileNotFoundError:
        logger.error(f"❌ Arquivo de log não encontrado: {file_path}")
    except Exception as e:
        logger.error(f"❌ Erro ao ler arquivo de log: {e}")


def analyze_logs(file_path, hours=24):
    """
    Análise estatística dos logs.

    Args:
        file_path: Caminho do arquivo
        hours: Analisar últimas N horas
    """
    try:
        with open(file_path, "r") as f:
            lines = f.readlines()

        # Parse de todas as linhas
        parsed_lines = []
        for line in lines:
            parsed = parse_log_line(line)
            if parsed:
                parsed_lines.append(parsed)

        # Filtrar por tempo
        since = datetime.now() - timedelta(hours=hours)
        recent_lines = filter_logs(parsed_lines, since=since)

        # Estatísticas
        stats = {
            "total_lines": len(recent_lines),
            "by_level": {},
            "by_component": {},
            "errors": [],
        }

        for line in recent_lines:
            level = line.get("level", "UNKNOWN")
            component = line.get("component", "unknown")

            # Contar por nível
            stats["by_level"][level] = stats["by_level"].get(level, 0) + 1

            # Contar por componente
            stats["by_component"][component] = (
                stats["by_component"].get(component, 0) + 1
            )

            # Coletar erros
            if level in ["ERROR", "CRITICAL"]:
                stats["errors"].append(
                    {
                        "timestamp": line.get("timestamp"),
                        "component": component,
                        "message": line.get("message", "")[:100],  # Primeiros 100 chars
                    }
                )

        # Exibir estatísticas
        logger.info(f"📊 Análise de logs - últimas {hours}h")
        logger.info("=" * 50)
        logger.info(f"Total de linhas: {stats['total_lines']}")

        logger.info("\n📈 Por nível:")
        for level, count in sorted(stats["by_level"].items()):
            color = COLORS.get(level, COLORS["RESET"])
            logger.info(f"  {color}{level:10}: {count:5}{COLORS['RESET']}")

        logger.info("\n🏷️  Por componente:")
        for component, count in sorted(
            stats["by_component"].items(), key=lambda x: x[1], reverse=True
        )[:10]:
            logger.info(f"  {component:15}: {count:5}")

        if stats["errors"]:
            logger.info(f"\n❌ Últimos erros ({len(stats['errors'])}):")
            for error in stats["errors"][-5:]:  # Últimos 5 erros
                timestamp = (
                    error["timestamp"].strftime("%H:%M:%S")
                    if error["timestamp"]
                    else "??:??:??"
                )
                logger.info(f"  [{timestamp}] {error['component']}: {error['message']}")

    except Exception as e:
        logger.error(f"❌ Erro na análise: {e}")


def main():
    """Interface principal para visualização de logs."""
    import argparse

    parser = argparse.ArgumentParser(description="Visualização e análise de logs")
    parser.add_argument("--file", type=str, help="Arquivo específico de log")
    parser.add_argument(
        "--list", action="store_true", help="Lista arquivos de log disponíveis"
    )
    parser.add_argument(
        "--tail",
        type=int,
        default=50,
        help="Número de linhas para exibir (default: 50)",
    )
    parser.add_argument(
        "--follow", "-f", action="store_true", help="Modo follow (tail -f)"
    )
    parser.add_argument(
        "--level",
        type=str,
        help="Filtrar por nível (DEBUG, INFO, WARNING, ERROR, CRITICAL)",
    )
    parser.add_argument("--component", type=str, help="Filtrar por componente")
    parser.add_argument("--search", type=str, help="Buscar texto na mensagem")
    parser.add_argument(
        "--since", type=str, help="Mostrar logs desde (formato: 2024-01-01 10:00:00)"
    )
    parser.add_argument(
        "--analyze", action="store_true", help="Análise estatística dos logs"
    )
    parser.add_argument(
        "--hours", type=int, default=24, help="Horas para análise (default: 24)"
    )

    args = parser.parse_args()

    # Encontrar arquivos de log
    log_files = find_log_files()

    if args.list:
        logger.info("📋 Arquivos de log encontrados:")
        if log_files:
            for log_type, log_path in log_files.items():
                logger.info(f"  {log_type:12}: {log_path}")
        else:
            logger.info("  Nenhum arquivo de log encontrado")
        return

    # Determinar arquivo para usar
    if args.file:
        log_file = Path(args.file)
        if not log_file.exists():
            logger.error(f"❌ Arquivo não encontrado: {log_file}")
            sys.exit(1)
    else:
        # Usar arquivo padrão (server se disponível)
        if "server" in log_files:
            log_file = log_files["server"]
        elif log_files:
            log_file = list(log_files.values())[0]
        else:
            logger.error("❌ Nenhum arquivo de log encontrado")
            logger.info("💡 Use --list para ver arquivos disponíveis")
            sys.exit(1)

    logger.info(f"📋 Visualizando: {log_file}")

    if args.analyze:
        analyze_logs(log_file, args.hours)
    else:
        # Parse de filtros de data
        since = None
        if args.since:
            try:
                since = datetime.strptime(args.since, "%Y-%m-%d %H:%M:%S")
            except ValueError:
                logger.error("❌ Formato de data inválido. Use: YYYY-MM-DD HH:MM:SS")
                sys.exit(1)

        # Se há filtros específicos, processar arquivo completo
        if args.level or args.component or args.search or since:
            try:
                with open(log_file, "r") as f:
                    lines = f.readlines()

                parsed_lines = []
                for line in lines:
                    parsed = parse_log_line(line)
                    if parsed:
                        parsed_lines.append(parsed)

                filtered_lines = filter_logs(
                    parsed_lines,
                    level=args.level,
                    component=args.component,
                    since=since,
                    search=args.search,
                )

                # Aplicar tail aos resultados filtrados
                display_lines = (
                    filtered_lines[-args.tail :]
                    if len(filtered_lines) > args.tail
                    else filtered_lines
                )

                for line in display_lines:
                    print(colorize_log_line(line))

                logger.info(
                    f"📊 Exibindo {len(display_lines)} de {len(filtered_lines)} linhas filtradas"
                )

            except Exception as e:
                logger.error(f"❌ Erro ao processar filtros: {e}")
        else:
            # Tail simples
            tail_log_file(log_file, args.tail, args.follow)


if __name__ == "__main__":
    main()
