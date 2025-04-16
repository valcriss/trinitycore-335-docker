class AppConfiguration {
    constructor() {
        // Server settings
        this.serverName = 'TrinityCore Server';

        // Binary paths
        this.authServerBinary = '/app/server/bin/authserver';
        this.worldServerBinary = '/app/server/bin/worldserver';
        this.botsAuthServerBinary = '/app/server/bots/bin/authserver';
        this.botsWorldServerBinary = '/app/server/bots/bin/worldserver';
        this.mapExtractorBinary = '/app/server/bin/mapextractor';
        this.mmapsGeneratorBinary = '/app/server/bin/mmaps_generator';
        this.vmap4AssemblerBinary = '/app/server/bin/vmap4assembler';
        this.vamp4ExtractorBinary = '/app/server/bin/vmap4extractor';

        // Database settings
        this.databaseHost = 'database';
        this.databasePort = 3306;
        this.databaseUser = 'trinity';
        this.databasePassword = 'trinity';
        this.rootDatabasePassword = 'trinityroot';
        this.authDatabaseName = 'auth';
        this.worldDatabaseName = 'world';
        this.characterDatabaseName = 'characters';

        // Filesystem paths
        this.logDirectory = '../logs';
        this.worldDataDirectory = '../data';

        // Network settings
        this.authServerPort = 3724;
        this.worldServerPort = 8085;
        this.publicIPAddress = '127.0.0.1';

        // Configuration files
        this.authServerConfigFile = '/app/server/etc/authserver.conf';
        this.worldServerConfigFile = '/app/server/etc/worldserver.conf';
    }

    // Server settings
    getServerName() {
        if (process.env.SERVER_NAME) {
            this.serverName = process.env.SERVER_NAME;
        }
        return this.serverName;
    }

    // Binary paths
    getAuthServerBinary() {
        if (process.env.AUTHSERVER_BINARY) {
            this.authServerBinary = process.env.AUTHSERVER_BINARY;
        }
        return this.authServerBinary;
    }

    getBotsAuthServerBinary() {
        return this.botsAuthServerBinary
    }
    getBotsWorldServerBinary() {
        return this.botsWorldServerBinary
    }

    getWorldServerBinary() {
        if (process.env.WORLDSERVER_BINARY) {
            this.worldServerBinary = process.env.WORLDSERVER_BINARY;
        }
        return this.worldServerBinary;
    }

    getMapExtractorBinary() {
        if (process.env.MAP_EXTRACTOR_BINARY) {
            this.mapExtractorBinary = process.env.MAP_EXTRACTOR_BINARY;
        }
        return this.mapExtractorBinary;
    }

    getMmapsGeneratorBinary() {
        if (process.env.MMAPS_GENERATOR_BINARY) {
            this.mmapsGeneratorBinary = process.env.MMAPS_GENERATOR_BINARY;
        }
        return this.mmapsGeneratorBinary;
    }

    getVmap4AssemblerBinary() {
        if (process.env.VMAP4_ASSEMBLER_BINARY) {
            this.vmap4AssemblerBinary = process.env.VMAP4_ASSEMBLER_BINARY;
        }
        return this.vmap4AssemblerBinary;
    }

    getVmap4ExtractorBinary() {
        if (process.env.VMAP4_EXTRACTOR_BINARY) {
            this.vmap4ExtractorBinary = process.env.VMAP4_EXTRACTOR_BINARY;
        }
        return this.vmap4ExtractorBinary;
    }

    // Database settings
    getDatabaseHost() {
        if (process.env.DATABASE_HOST) {
            this.databaseHost = process.env.DATABASE_HOST;
        }
        return this.databaseHost;
    }

    getDatabasePort() {
        if (process.env.DATABASE_PORT) {
            this.databasePort = process.env.DATABASE_PORT;
        }
        return this.databasePort;
    }

    getDatabaseUser() {
        if (process.env.DATABASE_USER) {
            this.databaseUser = process.env.DATABASE_USER;
        }
        return this.databaseUser;
    }

    getDatabasePassword() {
        if (process.env.DATABASE_PASSWORD) {
            this.databasePassword = process.env.DATABASE_PASSWORD;
        }
        return this.databasePassword;
    }

    getRootDatabasePassword() {
        if (process.env.ROOT_DATABASE_PASSWORD) {
            this.rootDatabasePassword = process.env.ROOT_DATABASE_PASSWORD;
        }
        return this.rootDatabasePassword;
    }

    getAuthDatabaseName() {
        if (process.env.AUTH_DATABASE_NAME) {
            this.authDatabaseName = process.env.AUTH_DATABASE_NAME;
        }
        return this.authDatabaseName;
    }

    getWorldDatabaseName() {
        if (process.env.WORLD_DATABASE_NAME) {
            this.worldDatabaseName = process.env.WORLD_DATABASE_NAME;
        }
        return this.worldDatabaseName;
    }

    getCharacterDatabaseName() {
        if (process.env.CHARACTER_DATABASE_NAME) {
            this.characterDatabaseName = process.env.CHARACTER_DATABASE_NAME;
        }
        return this.characterDatabaseName;
    }

    // Filesystem paths
    getLogDirectory() {
        if (process.env.LOG_DIRECTORY) {
            this.logDirectory = process.env.LOG_DIRECTORY;
        }
        return this.logDirectory;
    }

    getWorldDataDirectory() {
        if (process.env.WORLD_DATA_DIRECTORY) {
            this.worldDataDirectory = process.env.WORLD_DATA_DIRECTORY;
        }
        return this.worldDataDirectory;
    }
    // Network settings
    getPublicIpAddress() {
        if (process.env.PUBLIC_IP_ADDRESS) {
            this.publicIPAddress = process.env.PUBLIC_IP_ADDRESS;
        }
        return this.publicIPAddress;
    }

    getAuthServerPort() {
        if (process.env.AUTH_SERVER_PORT) {
            this.authServerPort = process.env.AUTH_SERVER_PORT;
        }
        return this.authServerPort;
    }

    getWorldServerPort() {
        if (process.env.WORLD_SERVER_PORT) {
            this.worldServerPort = process.env.WORLD_SERVER_PORT;
        }
        return this.worldServerPort;
    }

    // Configuration files
    getAuthServerConfigFile() {
        if (process.env.AUTHSERVER_CONFIG_FILE) {
            this.authServerConfigFile = process.env.AUTHSERVER_CONFIG_FILE;
        }
        return this.authServerConfigFile;
    }

    getWorldServerConfigFile() {
        if (process.env.WORLDSERVER_CONFIG_FILE) {
            this.worldServerConfigFile = process.env.WORLDSERVER_CONFIG_FILE;
        }
        return this.worldServerConfigFile;
    }

    // Authentication settings
    getAccessUsername() {
        return process.env.ACCESS_USERNAME || null;
    }

    getAccessPassword() {
        return process.env.ACCESS_PASSWORD || null;
    }

    getDatabaseConfiguration() {
        return {
            root: {
                host: this.getDatabaseHost(),
                port: this.getDatabasePort(),
                user: 'root',
                password: this.getRootDatabasePassword()
            },
            auth: {
                host: this.getDatabaseHost(),
                port: this.getDatabasePort(),
                user: this.getDatabaseUser(),
                password: this.getDatabasePassword(),
                database: this.getAuthDatabaseName(),
            },
            world: {
                host: this.getDatabaseHost(),
                port: this.getDatabasePort(),
                user: this.getDatabaseUser(),
                password: this.getDatabasePassword(),
                database: this.getWorldDatabaseName(),
            },
            characters: {
                host: this.getDatabaseHost(),
                port: this.getDatabasePort(),
                user: this.getDatabaseUser(),
                password: this.getDatabasePassword(),
                database: this.getCharacterDatabaseName(),
            }
        };
    }
}

module.exports = AppConfiguration;