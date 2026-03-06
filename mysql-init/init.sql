-- Créer la base si elle n'existe pas
CREATE DATABASE IF NOT EXISTS tp_db;
USE tp_db;

-- Créer l'utilisateur Etudiant avec mot de passe
CREATE USER IF NOT EXISTS 'Etudiant'@'%' IDENTIFIED BY 'P@ssword';

-- Donner tous les droits sur la base tp_db à Etudiant
GRANT ALL PRIVILEGES ON tp_db.* TO 'Etudiant'@'%';
FLUSH PRIVILEGES;
