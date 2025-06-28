#!/usr/bin/env node

const { execSync } = require('child_process');
const { readdirSync, statSync } = require('fs');
const { join } = require('path');

const PACKAGES_DIR = join(__dirname, '../packages');

function isDirectory(path) {
  try {
    return statSync(path).isDirectory();
  } catch {
    return false;
  }
}

function formatPackage(pkgPath, pkgName) {
  process.stdout.write(`🛠️  Formatando pacote: ${pkgName}... `);
  try {
    execSync('npx prettier --write .', { cwd: pkgPath, stdio: 'ignore' });
    console.log('✅ Sucesso');
  } catch (err) {
    console.log('❌ Erro');
    console.error(`   → Falha ao formatar ${pkgName}: ${err.message}`);
  }
}

function main() {
  let packages;
  try {
    packages = readdirSync(PACKAGES_DIR).filter((name) =>
      isDirectory(join(PACKAGES_DIR, name))
    );
  } catch (err) {
    console.error('❌ Não foi possível ler o diretório de pacotes:', err.message);
    process.exit(1);
  }

  if (!packages.length) {
    console.log('Nenhum pacote encontrado em ./packages.');
    return;
  }

  console.log('🔎 Encontrados os seguintes pacotes:');
  packages.forEach((name) => console.log(`  - ${name}`));
  console.log('\nIniciando formatação com Prettier...\n');

  packages.forEach((name) => {
    const pkgPath = join(PACKAGES_DIR, name);
    formatPackage(pkgPath, name);
  });

  console.log('\n✨ Formatação concluída!');
}

main();
