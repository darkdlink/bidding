FROM node:18-alpine

# Instalar dependências globais
RUN npm install -g @vue/cli

# Definir diretório de trabalho
WORKDIR /app

# Certifique-se de que o package.json está sendo copiado corretamente
# Se o Dockerfile não estiver no mesmo diretório que o package.json,
# você precisa especificar o caminho relativo correto
COPY ./package*.json ./

# Instalar dependências do projeto
RUN npm install

# Copiar o restante dos arquivos do projeto
COPY . .

# Expor porta
EXPOSE 8080

# Comando para iniciar o servidor de desenvolvimento
CMD ["npm", "run", "serve"]