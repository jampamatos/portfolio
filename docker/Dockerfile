# Use uma imagem base com Node.js
FROM node:18-alpine

# Defina o diretório de trabalho no container
WORKDIR /app

# Copie apenas os arquivos de configuração inicialmente
COPY package*.json tsconfig.json ./

# Instale as dependências
RUN npm install

# Copie o restante dos arquivos do projeto para o container
COPY . .

# Compile o TypeScript para JavaScript
RUN npm run build

# Exponha a porta para o servidor
EXPOSE 3000

# Comando padrão para rodar o servidor
CMD ["npm", "start"]
