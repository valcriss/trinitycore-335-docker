cd /app/client
/app/server/bin/vmap4extractor
mkdir vmaps
/app/server/bin/vmap4assembler Buildings vmaps
cp -r vmaps /app/server/data