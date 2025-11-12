# Usa imagem oficial do Node
FROM node:20-alpine

# Define diretório de trabalho
WORKDIR /app

# Copia os arquivos do projeto
COPY package*.json ./
RUN npm install

COPY . .

# Define variável de ambiente usada no build
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

# Expõe a porta padrão do React
EXPOSE 3000

# Comando para iniciar o React em modo dev
CMD ["npm", "start"]