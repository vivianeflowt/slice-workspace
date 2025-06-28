#!/bin/bash
# Script para instalar Ollama e os principais modelos de IA open source (todas variantes)
# Uso: bash scripts/install_ollama_and_models.sh

set -e

sudo systemctl stop ollama
sudo systemctl start ollama

sudo systemctl stop ollama
