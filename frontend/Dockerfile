# Usa imagem oficial do Node
FROM node:20-alpine

# Define diretório de trabalho
WORKDIR /app

# Copia os arquivos do projeto
COPY package*.json ./
RUN npm install

COPY . .

# Expõe a porta padrão do React
EXPOSE 3000

# Comando para iniciar o React em modo dev
CMD ["npm", "start"]