const fs = require('fs');
const path = require('path');
const CommandExecuter = require('../tools/CommandExecuter');

class MapInitializer {

    constructor(configuration, consoleHelper) {
        this.configuration = configuration;
        this.consoleHelper = consoleHelper;
        this.commandExecuter = new CommandExecuter();
    }

    isClientMapInitialized() {
        const mapsPath = path.join('/app/server/data/maps');
        return fs.existsSync(mapsPath);
    }

    async initialize() {
        this.consoleHelper.writeBoxLine('Running mapextractor...');
        if (!await this.commandExecuter.execute('/app/backend/extract-client-map-1.sh', [], '/app/backend/')) {
            return false;
        }
        this.consoleHelper.writeBoxLine('Running vmap4extractor && vmap4assembler...');
        if (!await this.commandExecuter.execute('/app/backend/extract-client-map-2.sh', [], '/app/backend/')) {
            return false;
        }
        this.consoleHelper.writeBoxLine('Running mmaps_generator...');
        if (!await this.commandExecuter.execute('/app/backend/extract-client-map-3.sh', [], '/app/backend/')) {
            return false;
        }
        this.consoleHelper.writeBoxLine('Running cleanup...');
        if (!await this.commandExecuter.execute('/app/backend/extract-client-map-4.sh', [], '/app/backend/')) {
            return false;
        }
        return true;
    }

}
module.exports = MapInitializer;