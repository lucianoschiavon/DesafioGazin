# Usa imagem oficial do Node.js
FROM node:20

# Define diretório de trabalho
WORKDIR /app

# Copia os arquivos do projeto
COPY package*.json ./
RUN npm install
COPY . .

# Expõe a porta da API
EXPOSE 3001

# Comando para iniciar a API
CMD ["node", "index.js"]