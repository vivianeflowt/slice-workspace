This ensures Zod receives a tuple resolving the error
typescript
model zenumPERPLEXITY_MODELS as string stringdescribe
typescript
model zenumPERPLEXITY_MODELS as string stringdescribe
User
For the code present we get this error
Conversion of type readonly deepseekchat deepseekcoder deepseekmoe deepseekvl deepseekmath deepseekreasoner deepseekllm deepseekcodervl to type string string may be a mistake because neither type sufficiently overlaps with the other If this was intentional convert the expression to unknown first
The type readonly deepseekchat deepseekcoder deepseekmoe deepseekvl deepseekmath deepseekreasoner deepseekllm deepseekcodervl is readonly and cannot be assigned to the mutable type string string
How can I resolve this If you propose a fix please make it concise
Cursor
Concise fix
Cast to unknown first then to string string
model zenumDEEPSEEK_MODELS as unknown as string stringdescribeModelo DeepSeek a ser utilizado
Isso resolve o erro de tipagem do readonly array
typescript
model zenumDEEPSEEK_MODELS as unknown as string stringdescribeModelo DeepSeek a ser utilizado