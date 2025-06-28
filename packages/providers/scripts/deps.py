#!/usr/bin/env python3
"""
📊 Dependencies Script - Slice/ALIVE Providers Server
Análise de dependências, licenças e auditoria de segurança.

Princípios CONCEPTS.md:
- Curadoria de Licença: Análise obrigatória antes de adotar
- Baixo Recurso: Dependências mínimas e justificadas
- Validação Forte: JSON Schema para reports
- Justificativa Real: Documentação de escolhas técnicas
"""

import json
import logging
import subprocess
import sys
from datetime import datetime
from pathlib import Path

import pkg_resources
from jsonschema import ValidationError, validate

# Configuração de logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Schema para validação do relatório de dependências
DEPS_REPORT_SCHEMA = {
    "type": "object",
    "properties": {
        "timestamp": {"type": "string"},
        "total_packages": {"type": "number"},
        "packages": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "name": {"type": "string"},
                    "version": {"type": "string"},
                    "license": {"type": "string"},
                    "size": {"type": "number"},
                    "dependencies": {"type": "array"},
                    "license_risk": {
                        "type": "string",
                        "enum": ["low", "medium", "high", "unknown"],
                    },
                    "justification": {"type": "string"},
                },
                "required": ["name", "version", "license", "license_risk"],
            },
        },
        "license_summary": {"type": "object"},
        "security_issues": {"type": "array"},
        "recommendations": {"type": "array"},
    },
    "required": ["timestamp", "total_packages", "packages", "license_summary"],
}

# Mapeamento de licenças para nível de risco
LICENSE_RISK_MAP = {
    # Baixo risco - Compatible com CONCEPTS.md
    "MIT": "low",
    "BSD": "low",
    "BSD-2-Clause": "low",
    "BSD-3-Clause": "low",
    "Apache-2.0": "low",
    "Apache Software License": "low",
    "ISC": "low",
    "Unlicense": "low",
    "Python Software Foundation License": "low",
    # Risco médio - Análise necessária
    "GPL-2.0": "medium",
    "GPL-3.0": "medium",
    "LGPL-2.1": "medium",
    "LGPL-3.0": "medium",
    "MPL-2.0": "medium",
    "Mozilla Public License 2.0 (MPL 2.0)": "medium",
    # Alto risco - Incompatível com CONCEPTS.md
    "AGPL-3.0": "high",
    "GPL-3.0-or-later": "high",
    "Copyleft": "high",
    "Commercial": "high",
    "Proprietary": "high",
    # Desconhecido
    "UNKNOWN": "unknown",
    "": "unknown",
    None: "unknown",
}

# Justificativas padrão para dependências core
CORE_JUSTIFICATIONS = {
    "fastapi": "Framework web minimalista, bem tipado, compatível com validação forte",
    "uvicorn": "Servidor ASGI de alta performance, baixo recurso, open source",
    "transformers": "Biblioteca HuggingFace oficial, CPU-only suportado, modelos offline",
    "torch": "PyTorch para CPU-only, dependency dos transformers, open source",
    "pydantic": "Validação forte via JSON Schema, alinhado com CONCEPTS.md",
    "requests": "HTTP client padrão, confiável, baixo recurso",
    "jsonschema": "Validação JSON Schema obrigatória conforme CONCEPTS.md",
    "pytest": "Framework de testes padrão, bem estabelecido",
    "black": "Formatação automática, padrão da comunidade Python",
    "isort": "Organização de imports, integra com black",
    "flake8": "Linting básico, baixo recurso",
    "mypy": "Type checking estático, alinhado com validação forte",
}


def get_installed_packages():
    """
    Obtém lista de pacotes instalados no ambiente.

    Returns:
        list: Lista de pacotes com metadados
    """
    logger.info("📦 Coletando pacotes instalados...")

    packages = []

    try:
        # Usar pkg_resources para obter informações detalhadas
        for dist in pkg_resources.working_set:
            package_info = {
                "name": dist.project_name,
                "version": dist.version,
                "location": dist.location,
                "dependencies": [str(req) for req in dist.requires()],
                "license": "UNKNOWN",
                "size": 0,
            }

            # Tentar obter licença dos metadados
            try:
                if hasattr(dist, "get_metadata"):
                    metadata = dist.get_metadata("METADATA")
                    for line in metadata.split("\n"):
                        if line.startswith("License:"):
                            package_info["license"] = line.split(":", 1)[1].strip()
                            break
                        elif line.startswith("Classifier: License ::"):
                            # Extract license from classifier
                            classifier = line.split("::", 2)[-1].strip()
                            package_info["license"] = classifier
                            break
            except:
                pass

            # Tentar calcular tamanho (estimativa básica)
            try:
                location_path = Path(package_info["location"])
                if location_path.exists():
                    # Estimativa simples - pode ser imprecisa
                    package_info["size"] = sum(
                        f.stat().st_size
                        for f in location_path.rglob("*")
                        if f.is_file()
                        and package_info["name"].lower() in str(f).lower()
                    )
            except:
                package_info["size"] = 0

            packages.append(package_info)

    except Exception as e:
        logger.error(f"❌ Erro ao coletar pacotes: {e}")

    logger.info(f"📦 Encontrados {len(packages)} pacotes")
    return packages


def analyze_license_risk(license_str):
    """
    Analisa risco da licença baseado em CONCEPTS.md.

    Args:
        license_str: String da licença

    Returns:
        str: Nível de risco (low, medium, high, unknown)
    """
    if not license_str:
        return "unknown"

    license_str = license_str.strip()

    # Verificação exata
    if license_str in LICENSE_RISK_MAP:
        return LICENSE_RISK_MAP[license_str]

    # Verificação por substring (case insensitive)
    license_lower = license_str.lower()

    for license_key, risk in LICENSE_RISK_MAP.items():
        if license_key and license_key.lower() in license_lower:
            return risk

    # Heurísticas para licenças comuns
    if any(keyword in license_lower for keyword in ["mit", "bsd", "apache"]):
        return "low"
    elif any(keyword in license_lower for keyword in ["gpl", "copyleft"]):
        return "medium"
    elif any(
        keyword in license_lower for keyword in ["agpl", "commercial", "proprietary"]
    ):
        return "high"

    return "unknown"


def get_package_justification(package_name):
    """
    Obtém justificativa para uso do pacote.

    Args:
        package_name: Nome do pacote

    Returns:
        str: Justificativa ou mensagem padrão
    """
    package_lower = package_name.lower()

    # Verificação direta
    if package_lower in CORE_JUSTIFICATIONS:
        return CORE_JUSTIFICATIONS[package_lower]

    # Verificação por substring
    for core_name, justification in CORE_JUSTIFICATIONS.items():
        if core_name in package_lower or package_lower in core_name:
            return justification

    return "Dependência transitiva ou utilitário - verificar necessidade"


def run_security_audit():
    """
    Executa auditoria de segurança com pip-audit.

    Returns:
        list: Lista de vulnerabilidades encontradas
    """
    logger.info("🔒 Executando auditoria de segurança...")

    security_issues = []

    try:
        # Verificar se pip-audit está disponível
        result = subprocess.run(
            ["pip-audit", "--format=json"], capture_output=True, text=True, timeout=300
        )

        if result.returncode == 0:
            try:
                audit_data = json.loads(result.stdout)
                security_issues = audit_data.get("vulnerabilities", [])
                logger.info(f"🔒 Encontradas {len(security_issues)} vulnerabilidades")
            except json.JSONDecodeError:
                logger.warning("⚠️  Falha ao parsear resultado da auditoria")
        else:
            logger.warning("⚠️  pip-audit não disponível ou falhou")

    except subprocess.TimeoutExpired:
        logger.warning("⚠️  Auditoria de segurança expirou (timeout)")
    except FileNotFoundError:
        logger.info("💡 pip-audit não instalado - pulando auditoria de segurança")
        logger.info("   Para instalar: pip install pip-audit")
    except Exception as e:
        logger.warning(f"⚠️  Erro na auditoria de segurança: {e}")

    return security_issues


def generate_recommendations(packages, security_issues):
    """
    Gera recomendações baseadas na análise.

    Args:
        packages: Lista de pacotes analisados
        security_issues: Vulnerabilidades encontradas

    Returns:
        list: Lista de recomendações
    """
    recommendations = []

    # Análise de licenças de alto risco
    high_risk_licenses = [pkg for pkg in packages if pkg.get("license_risk") == "high"]
    if high_risk_licenses:
        recommendations.append(
            {
                "type": "license_risk",
                "priority": "high",
                "message": f"Encontradas {len(high_risk_licenses)} dependências com licenças de alto risco",
                "packages": [pkg["name"] for pkg in high_risk_licenses],
                "action": "Revisar e considerar substituição por alternativas compatíveis",
            }
        )

    # Licenças desconhecidas
    unknown_licenses = [pkg for pkg in packages if pkg.get("license_risk") == "unknown"]
    if unknown_licenses:
        recommendations.append(
            {
                "type": "license_unknown",
                "priority": "medium",
                "message": f"Encontradas {len(unknown_licenses)} dependências com licenças desconhecidas",
                "packages": [pkg["name"] for pkg in unknown_licenses],
                "action": "Investigar licenças e classificar risco manualmente",
            }
        )

    # Pacotes sem justificativa
    no_justification = [
        pkg
        for pkg in packages
        if pkg.get("justification", "").startswith("Dependência transitiva")
    ]
    if len(no_justification) > 10:  # Threshold para evitar ruído
        recommendations.append(
            {
                "type": "justification",
                "priority": "low",
                "message": f"Muitas dependências ({len(no_justification)}) sem justificativa específica",
                "action": "Revisar necessidade e documentar justificativas",
            }
        )

    # Vulnerabilidades de segurança
    if security_issues:
        critical_issues = [
            issue for issue in security_issues if issue.get("severity") == "critical"
        ]
        if critical_issues:
            recommendations.append(
                {
                    "type": "security_critical",
                    "priority": "critical",
                    "message": f"Encontradas {len(critical_issues)} vulnerabilidades críticas",
                    "action": "Atualizar pacotes vulneráveis imediatamente",
                }
            )

    return recommendations


def generate_deps_report(packages, security_issues):
    """
    Gera relatório completo de dependências.

    Args:
        packages: Lista de pacotes
        security_issues: Vulnerabilidades

    Returns:
        dict: Relatório estruturado
    """
    logger.info("📊 Gerando relatório de dependências...")

    # Enriquecer dados dos pacotes
    enriched_packages = []
    for pkg in packages:
        enriched_pkg = pkg.copy()
        enriched_pkg["license_risk"] = analyze_license_risk(pkg.get("license", ""))
        enriched_pkg["justification"] = get_package_justification(pkg["name"])
        enriched_packages.append(enriched_pkg)

    # Sumário de licenças
    license_summary = {}
    for pkg in enriched_packages:
        license_name = pkg.get("license", "UNKNOWN")
        license_summary[license_name] = license_summary.get(license_name, 0) + 1

    # Gerar recomendações
    recommendations = generate_recommendations(enriched_packages, security_issues)

    report = {
        "timestamp": datetime.now().isoformat(),
        "total_packages": len(enriched_packages),
        "packages": enriched_packages,
        "license_summary": license_summary,
        "security_issues": security_issues,
        "recommendations": recommendations,
    }

    # Validar relatório
    try:
        validate(instance=report, schema=DEPS_REPORT_SCHEMA)
        logger.info("✅ Relatório de dependências validado")
    except ValidationError as e:
        logger.warning(f"⚠️  Relatório inválido: {e.message}")

    return report


def display_summary(report):
    """
    Exibe sumário do relatório.

    Args:
        report: Relatório de dependências
    """
    print("\n📊 Sumário de Dependências - Slice/ALIVE Providers")
    print("=" * 60)
    print(f"Total de pacotes: {report['total_packages']}")

    # Resumo de riscos
    risk_counts = {}
    for pkg in report["packages"]:
        risk = pkg.get("license_risk", "unknown")
        risk_counts[risk] = risk_counts.get(risk, 0) + 1

    print("\n🏷️  Distribuição de risco de licenças:")
    risk_colors = {"low": "🟢", "medium": "🟡", "high": "🔴", "unknown": "⚪"}
    for risk, count in sorted(risk_counts.items()):
        icon = risk_colors.get(risk, "❓")
        print(f"  {icon} {risk.capitalize():8}: {count:3} pacotes")

    # Top licenças
    print("\n📜 Top licenças:")
    top_licenses = sorted(
        report["license_summary"].items(), key=lambda x: x[1], reverse=True
    )[:5]
    for license_name, count in top_licenses:
        print(f"  {license_name:25}: {count:3} pacotes")

    # Vulnerabilidades
    security_count = len(report.get("security_issues", []))
    if security_count > 0:
        print(f"\n🔒 Vulnerabilidades de segurança: {security_count}")
    else:
        print("\n🔒 Nenhuma vulnerabilidade conhecida encontrada")

    # Recomendações
    recommendations = report.get("recommendations", [])
    if recommendations:
        print(f"\n💡 Recomendações: {len(recommendations)}")
        for rec in recommendations[:3]:  # Top 3
            priority_icon = {
                "critical": "🚨",
                "high": "⚠️ ",
                "medium": "💡",
                "low": "ℹ️ ",
            }
            icon = priority_icon.get(rec.get("priority"), "💡")
            print(f"  {icon} {rec['message']}")
    else:
        print("\n✅ Nenhuma recomendação crítica")


def main():
    """Executa análise completa de dependências."""
    import argparse

    parser = argparse.ArgumentParser(description="Análise de dependências e licenças")
    parser.add_argument(
        "--output",
        type=str,
        default="deps_report.json",
        help="Arquivo de saída do relatório",
    )
    parser.add_argument(
        "--no-security", action="store_true", help="Pula auditoria de segurança"
    )
    parser.add_argument(
        "--format",
        choices=["json", "summary"],
        default="summary",
        help="Formato de saída",
    )
    parser.add_argument(
        "--filter-risk",
        choices=["low", "medium", "high", "unknown"],
        help="Filtrar apenas pacotes com risco específico",
    )

    args = parser.parse_args()

    logger.info("📊 Iniciando Análise de Dependências - Slice/ALIVE Providers")
    logger.info("=" * 60)

    # Coletar pacotes
    packages = get_installed_packages()

    # Auditoria de segurança
    security_issues = []
    if not args.no_security:
        security_issues = run_security_audit()
    else:
        logger.info("⏭️  Pulando auditoria de segurança (--no-security)")

    # Gerar relatório
    report = generate_deps_report(packages, security_issues)

    # Filtrar por risco se solicitado
    if args.filter_risk:
        filtered_packages = [
            pkg
            for pkg in report["packages"]
            if pkg.get("license_risk") == args.filter_risk
        ]
        report["packages"] = filtered_packages
        report["total_packages"] = len(filtered_packages)
        logger.info(
            f"🔍 Filtrado para {len(filtered_packages)} pacotes com risco '{args.filter_risk}'"
        )

    # Salvar relatório
    output_path = Path(args.output)
    with open(output_path, "w") as f:
        json.dump(report, f, indent=2, default=str)
    logger.info(f"💾 Relatório salvo em: {output_path}")

    # Exibir resultado
    if args.format == "summary":
        display_summary(report)
    elif args.format == "json":
        print(json.dumps(report, indent=2, default=str))

    # Status de saída baseado em recomendações críticas
    critical_recommendations = [
        rec
        for rec in report.get("recommendations", [])
        if rec.get("priority") in ["critical", "high"]
    ]

    if critical_recommendations:
        logger.warning(
            f"⚠️  {len(critical_recommendations)} recomendações críticas encontradas"
        )
        sys.exit(1)
    else:
        logger.info("✅ Análise concluída - nenhum problema crítico encontrado")


if __name__ == "__main__":
    main()
