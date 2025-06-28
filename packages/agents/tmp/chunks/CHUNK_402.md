Cursor
Os módulos sumarizacaopy tokenizerpy metricspy e utilspy agora estão localizados em packagesalivealive Para importar corretamente esses módulos em qualquer script dentro do mesmo pacote por exemplo em curation01_split_by_topicpy ou outros scripts em alivealive utilize o formato de import relativo ou absoluto de acordo com a estrutura de pacotes Python
Resumo do ajuste
 Se o script estiver em packagesalivealive use
python
from sumarizacao import 
from tokenizer import 
from metrics import 
from utils import 
 Se o script estiver em um subdiretório ex curation use
python
from alivesumarizacao import 
from alivetokenizer import 
from alivemetrics import 
from aliveutils import 
Assumindo que alive está no PYTHONPATH ou que o script é executado como módulo
No caso do script 01_split_by_topicpy
 Ele atualmente não importa nenhum desses módulos apenas usa os e re então não precisa de ajuste imediato de import
 Se for necessário usar funções utilitárias dos módulos ajuste os imports conforme acima
Ajuste de paths de arquivos
 Os caminhos relativos para arquivos de entradasaída datasetchat01md outputsplit_by_topic estão corretos para scripts rodando a partir de packagesalivealivecuration
 Se mover o script para outro local ajuste os paths relativos conforme a nova posição
Se precisar de um exemplo de import ou de ajuste em um script específico me avise qual arquivo deseja modificar
Notificação paths e imports revisados conforme a nova estrutura Se precisar de ajuste em um script específico só avisar
python
from sumarizacao import 
from tokenizer import 
from metrics import 
from utils import 
python
from alivesumarizacao import 
from alivetokenizer import 
from alivemetrics import 
from aliveutils import 
User