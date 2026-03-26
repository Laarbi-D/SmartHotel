FROM php:8.2-apache

# On installe mysqli ET pdo_mysql pour être tranquille
RUN docker-php-ext-install mysqli pdo pdo_mysql

# On active le module de réécriture Apache (souvent utile)
RUN a2enmod rewrite

COPY . /var/www/html/