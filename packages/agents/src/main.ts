import { program } from 'commander';

async function main(): Promise<void> {
  program
    .name('agent-base')
    .description('Processador de conteúdo com suporte a múltiplos formatos e embeddings')
    .version('1.0.0');

  await program.parseAsync();
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
