const e = require("express");
const Database = require("./database/Database");
const ConfigurationWriter = require("./configuration/ConfigurationWriter");
const DatabaseInitializer = require("./database/DatabaseInitializer");
const MapInitializer = require("./map/MapInitializer");
const fs = require('fs');
const path = require('path');

class ApplicationInitializer {
    constructor(configuration, consoleHelper) {
        this.configuration = configuration;
        this.consoleHelper = consoleHelper;
        this.database = new Database(configuration.getDatabaseConfiguration());
        this.databaseInitializer = new DatabaseInitializer(configuration, this.database, this.consoleHelper);
        this.configurationWriter = new ConfigurationWriter(configuration);
        this.mapInitializer = new MapInitializer(configuration, this.consoleHelper);
    }

    async checkDatabaseConnection() {
        this.consoleHelper.beginBox('Checking database connection');
        if (!await this.database.checkConnection('root', 12, 5000, (attempt, maxAttempts) => {
            this.consoleHelper.writeBoxLine(`Failed to connect to database attempt ${attempt} of ${maxAttempts}...`);
        })) {
            this.consoleHelper.endBox('Connection to database failed. Exiting');
            return false;
        }
        else {
            this.consoleHelper.endBox('Connection to database successful.');
            return true;
        }
    }

    async checkDatabasesStructure() {
        this.consoleHelper.beginBox('Checking databases structure');
        if (!await this.database.isInitialized()) {
            this.consoleHelper.writeBoxLine('Databases are not initialized: Initializing databases.');
            if (!await this.databaseInitializer.initialize()) {
                this.consoleHelper.endBox('Databases structure initialization failed. Exiting');
                return false;
            }
            else {
                this.consoleHelper.endBox('Databases structure initialization successful.');
                return true;
            }
        }
        else {
            this.consoleHelper.endBox('Databases are initialized.');
            return true;
        }
    }

    async checkDatabasesInitialData() {
        this.consoleHelper.beginBox('Checking databases data');
        if (!await this.database.containsData()) {
            this.consoleHelper.writeBoxLine('Databases are empty: downloading initial data.');
            if (!await this.databaseInitializer.downloadInitialData()) {
                this.consoleHelper.endBox('Databases initial data download failed. Exiting');
                return false;
            }
            else {
                this.consoleHelper.endBox('Databases initial data download successful.');
                return true;
            }
        }
        else {
            this.consoleHelper.endBox('Databases are not empty.');
            return true;
        }
    }

    updateAuthServerConfiguration(serverMode) {
        this.consoleHelper.beginBox('Updating auth server configuration files');
        if (!this.configurationWriter.writeAuthServerConfiguration(serverMode)) {
            this.consoleHelper.endBox('Writing auth server configuration failed. Exiting');
            return false;
        }
        else {
            this.consoleHelper.endBox('Writing auth server configuration successful.');
            return true;
        }
    }

    updateWorldServerConfiguration(serverMode) {
        this.consoleHelper.beginBox('Updating world server configuration files');
        if (!this.configurationWriter.writeWorldServerConfiguration(serverMode)) {
            this.consoleHelper.endBox('Writing world server configuration failed. Exiting');
            return false;
        }
        else {
            this.consoleHelper.endBox('Writing world server configuration successful.');
            return true;
        }
    }

    async updateApplicationDatabase()
    {
        this.consoleHelper.beginBox('Updating application database');
        if (!await this.databaseInitializer.updateApplicationDatabase()) {
            this.consoleHelper.endBox('Application database update failed. Exiting');
            return false;
        }
        else {
            this.consoleHelper.endBox('Application database update successful.');
            return true;
        }
    }

    async updateApplicationDatabaseWithBots()
    {
        this.consoleHelper.beginBox('Checking bots databases data');
        if (!await this.database.containsBotsData()) {
            this.consoleHelper.writeBoxLine('Bots databases are not present: checking initial data.');
            if (!await this.databaseInitializer.initializeBotsData()) {
                this.consoleHelper.endBox('Bots databases initialization failed. Exiting');
                return false;
            }
            else {
                this.consoleHelper.endBox('Bots databases initialization successful.');
                return true;
            }
        }
        else {
            this.consoleHelper.endBox('Bots databases are present.');
            return true;
        }
    }

    async updateBotsBinaries()
    {
        // update authserver
        const botsAuthServer = this.configuration.getBotsAuthServerBinary();
        const botsWorldServer = this.configuration.getBotsWorldServerBinary();
        const authServer = this.configuration.getAuthServerBinary();
        const worldServer = this.configuration.getWorldServerBinary();

        // cp bots authserver to authserver
        this.consoleHelper.beginBox('Updating bots binaries');

        try {
            // Ensure target directory exists
            const authServerDir = path.dirname(authServer);
            if (!fs.existsSync(authServerDir)) {
                fs.mkdirSync(authServerDir, { recursive: true });
            }
            
            // Copy bots auth server to auth server
            fs.copyFileSync(botsAuthServer, authServer);
            this.consoleHelper.writeBoxLine(`Copied ${botsAuthServer} to ${authServer}`);
            
            // Copy bots world server to world server
            fs.copyFileSync(botsWorldServer, worldServer);
            this.consoleHelper.writeBoxLine(`Copied ${botsWorldServer} to ${worldServer}`);
            
            this.consoleHelper.endBox('Bots binaries update successful.');
            return true;
        } catch (error) {
            this.consoleHelper.writeBoxLine(`Error updating bots binaries: ${error.message}`);
            this.consoleHelper.endBox('Bots binaries update failed. Exiting');
            return false;
        }
    }

    async updateRealmInformations()
    {
        this.consoleHelper.beginBox('Updating realm informations');
        if (!await this.databaseInitializer.updateRealmInformations()) {
            this.consoleHelper.endBox('Realm informations update failed. Exiting');
            return false;
        }
        else {
            this.consoleHelper.endBox('Realm informations update successful.');
            return true;
        }
    }

    async checkClientMapData()
    {
        this.consoleHelper.beginBox('Checking client map data');
        if (!this.mapInitializer.isClientMapInitialized()) {
            this.consoleHelper.writeBoxLine('Client map data is not present: creating client map data.');
            this.consoleHelper.writeBoxLine('You can grap a coffee or a tea, this will take a while (hours)...');
            if (!await this.mapInitializer.initialize()) {
                this.consoleHelper.endBox('Client map data initialization failed. Exiting');
                return false;
            }
            else {
                this.consoleHelper.endBox('Client map data initialization successful.');
                return true;
            }
        }
        else {
            this.consoleHelper.endBox('Client map data present.');
            return true;
        }
    }
}

module.exports = ApplicationInitializer;