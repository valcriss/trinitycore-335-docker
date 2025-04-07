const fs = require('fs');
const path = require('path');

class ConfigurationWriter {
    constructor(configuration) {
        this.configuration = configuration;
    }

    // Méthode utilitaire pour lire et modifier un fichier de configuration
    processConfiguration(inputFilePath, outputFilePath, replacements) {
        try {
            // Lire le contenu du fichier source
            let content = fs.readFileSync(inputFilePath, 'utf8');

            // Remplacer les placeholders par les valeurs fournies
            for (const [placeholder, value] of Object.entries(replacements)) {
                content = content.replace(new RegExp(`<${placeholder}>`, 'g'), value);
            }

            // Créer le répertoire de destination s'il n'existe pas
            const outputDir = path.dirname(outputFilePath);
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }

            // Écrire le fichier modifié dans le chemin de destination
            fs.writeFileSync(outputFilePath, content, 'utf8');
            return true;
        } catch (error) {
            return false;
        }
    }

    // Écrire la configuration pour AuthServer
    writeAuthServerConfiguration() {
        const inputFilePath = path.resolve(__dirname, '../../resources/authserver.conf.dist');
        const outputFilePath = this.configuration.getAuthServerConfigFile();

        const replacements = {
            DATABASE_HOST: this.configuration.getDatabaseHost(),
            DATABASE_PORT: this.configuration.getDatabasePort(),
            DATABASE_USER: this.configuration.getDatabaseUser(),
            DATABASE_PASSWORD: this.configuration.getDatabasePassword(),
            AUTH_DATABASE_NAME: this.configuration.getAuthDatabaseName(),
            LOG_DIR: this.configuration.getLogDirectory(),
        };

        return this.processConfiguration(inputFilePath, outputFilePath, replacements);
    }

    // Écrire la configuration pour WorldServer
    writeWorldServerConfiguration() {
        const inputFilePath = path.resolve(__dirname, '../../resources/worldserver.conf.dist');
        const outputFilePath = this.configuration.getWorldServerConfigFile();

        const replacements = {
            DATABASE_HOST: this.configuration.getDatabaseHost(),
            DATABASE_PORT: this.configuration.getDatabasePort(),
            DATABASE_USER: this.configuration.getDatabaseUser(),
            DATABASE_PASSWORD: this.configuration.getDatabasePassword(),
            AUTH_DATABASE_NAME: this.configuration.getAuthDatabaseName(),
            WORLD_DATABASE_NAME: this.configuration.getWorldDatabaseName(),
            CHARACTER_DATABASE_NAME: this.configuration.getCharacterDatabaseName(),
            LOG_DIR: this.configuration.getLogDirectory(),
            DATA_DIR: this.configuration.getWorldDataDirectory(),
        };

        return this.processConfiguration(inputFilePath, outputFilePath, replacements);
    }
}

module.exports = ConfigurationWriter;