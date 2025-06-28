User
ve se ta correto ia pythonzeira
Cursor
Ótimo Vamos revisar o checklist para garantir que está tudo correto após a desmontagem e antes de subir a infra novamente
 Checklist PósDesmontagem e Remontagem do Disco
1 Montagem no path correto
 Comando usado
bash
sudo mount devmd0 mediadata
 Verifique
bash
df h  grep mediadata
ls lh mediadata
 Deve aparecer o disco RAID0 montado em mediadata com o espaço correto
2 Configuração dos stacks
 Todos os arquivos de configuração dockercomposeyml env scripts dos stacks Swarm devem apontar para mediadata não mais para o path antigo
 Se necessário faça um grep para garantir
bash
grep r mediavivif59664f261e04c7b94cad751bbbe5f4e stacks
e substitua pelo novo path
3 Subida dos stacks
 No diretório da infraestrutura
bash
cd homeviviDocumentosslicesliceinfrastructure
make stacksup
 Aguarde todos os serviços subirem e monitore logs para eventuais erros de path
4 Testes finais
 Acesse os serviços Portainer Traefik Ollama etc e verifique se estão funcionando normalmente
 Teste leituraescrita em mediadata via algum container ou serviço
5 Documentação
 Registre o procedimento no CONTECTmd ou similar para rastreabilidade e onboarding futuro