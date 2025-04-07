const e = require("express");
const Database = require("./database/Database");
const ConfigurationWriter = require("./configuration/ConfigurationWriter");
const DatabaseInitializer = require("./database/DatabaseInitializer");
const MapInitializer = require("./map/MapInitializer");

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

    updateAuthServerConfiguration() {
        this.consoleHelper.beginBox('Updating auth server configuration files');
        if (!this.configurationWriter.writeAuthServerConfiguration()) {
            this.consoleHelper.endBox('Writing auth server configuration failed. Exiting');
            return false;
        }
        else {
            this.consoleHelper.endBox('Writing auth server configuration successful.');
            return true;
        }
    }

    updateWorldServerConfiguration() {
        this.consoleHelper.beginBox('Updating world server configuration files');
        if (!this.configurationWriter.writeWorldServerConfiguration()) {
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