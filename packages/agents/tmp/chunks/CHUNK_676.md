shellscript
docker service update force traefik_traefik
shellscript
curl v httpollamalocalcloudio
curl v httpollamalocalcloudio11434
User
For the code present we get this error
All mapping items must start at the same column
How can I resolve this If you propose a fix please make it concise
Cursor
The error is due to incorrect indentation labels should be at the same indentation level as networks not nested under it
Fix Move labels out so it aligns with networks
Corrected snippet
yaml
networks
 traefikpublic
labels
yaml
networks
 traefikpublic
labels
User
como defino manialmente o dns