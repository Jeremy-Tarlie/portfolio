# Étape 1 : Utiliser une image de base PHP avec Apache
FROM php:8.2-apache

# Étape 2 : Activer le module Apache `rewrite` (si nécessaire)
RUN a2enmod rewrite

# Étape 3 : Copier le projet dans le conteneur
WORKDIR /var/www/html
COPY . /var/www/html

# Étape 4 : Définir les permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# Étape 5 : Exposer le port 80
EXPOSE 80

# Étape 6 : Démarrer le serveur Apache
CMD ["apache2-foreground"]
