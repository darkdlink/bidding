FROM php:8.1-fpm

# Argumentos definidos em docker-compose.yml
ARG user=www-data
ARG uid=1000

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev

# Limpar cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Instalar extensões PHP
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Obter Composer mais recente
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Configurar diretório de trabalho
WORKDIR /var/www/html

# Copiar permissões de usuário existentes
COPY --chown=www-data:www-data . /var/www/html

# Expor porta 9000 e iniciar php-fpm server
EXPOSE 9000
CMD ["php-fpm"]