#!/bin/bash

# Aguardar o banco de dados estar pronto
echo "Waiting for database connection..."
while ! nc -z db 3306; do
  sleep 1
done
echo "Database connection established"

# Verificar se o diretório do Laravel já está configurado
if [ -f ".env" ]; then
    echo "Laravel already installed, skipping installation"
else
    echo "Installing Laravel..."
    composer create-project --prefer-dist laravel/laravel .
    cp .env.example .env
    
    # Configurar o .env
    sed -i "s/DB_HOST=.*/DB_HOST=db/" .env
    sed -i "s/DB_DATABASE=.*/DB_DATABASE=${DB_DATABASE}/" .env
    sed -i "s/DB_USERNAME=.*/DB_USERNAME=${DB_USERNAME}/" .env
    sed -i "s/DB_PASSWORD=.*/DB_PASSWORD=${DB_PASSWORD}/" .env
    sed -i "s/REDIS_HOST=.*/REDIS_HOST=redis/" .env
    sed -i "s/CACHE_DRIVER=.*/CACHE_DRIVER=redis/" .env
    sed -i "s/SESSION_DRIVER=.*/SESSION_DRIVER=redis/" .env
    sed -i "s/QUEUE_CONNECTION=.*/QUEUE_CONNECTION=redis/" .env
    
    # Gerar chave da aplicação
    php artisan key:generate
fi

# Instalar dependências do Composer se necessário
if [ ! -d "vendor" ]; then
    echo "Installing Composer dependencies..."
    composer install
fi

# Executar migrações
echo "Running migrations..."
php artisan migrate --force

# Limpar cache
echo "Clearing cache..."
php artisan optimize:clear

# Instalar JWT se necessário
echo "Checking JWT..."
if ! grep -q "tymon/jwt-auth" composer.json; then
    echo "Installing JWT..."
    composer require tymon/jwt-auth
    php artisan vendor:publish --provider="Tymon\JWTAuth\Providers\LaravelServiceProvider"
    php artisan jwt:secret
fi

# Verificar se o diretório storage tem permissões corretas
echo "Setting correct permissions..."
chmod -R 777 storage bootstrap/cache

# Iniciar PHP-FPM
echo "Starting PHP-FPM..."
php-fpm