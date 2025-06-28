quebrou o envio
Cursor
Corrigi o worker para restaurar o clipboard mas pode haver limitação do pyperclip ou do ambiente por exemplo clipboard X11Wayland permissões ou delays de sincronização que pode causar falha ou quebra no envio
Vou refor
User
nao funciona mais como denveria
Cursor
 O envio foi quebrado após a alteração para restaurar o clipboard Isso pode acontecer porque o clipboard pode não ser restaurado a tempo ou o pyperclip pode não ser confiável em todos os ambientes especialmente em Linux com diferentes gerenciadores de área de transferência
Solução robusta
 Usar o clipboard apenas durante o envio mas garantir um pequeno delay após o ctrlv antes de restaurar o clipboard
 Alternativamente permitir que o usuário escolha entre modo seguro não mexe no clipboard e modo colar usa clipboard mas pode sobrescrever temporariamente
Vou implementar o delay após o ctrlv para garantir que o texto seja colado antes de restaurar o clipboard