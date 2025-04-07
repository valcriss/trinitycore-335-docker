const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const AppConfiguration = require('./models/configuration/AppConfiguration');
const ConsoleHelper = require('./models/tools/ConsoleHelper');
const ApplicationInitializer = require('./models/ApplicationInitializer');
const CommandRunner = require('./models/tools/CommandRunner');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const configuration = new AppConfiguration();
const consoleHelper = new ConsoleHelper();
const applicationInitializer = new ApplicationInitializer(configuration, consoleHelper);
const authServerRunner = new CommandRunner(configuration.getAuthServerBinary(), '/app/server/bin');
const worldServerRunner = new CommandRunner(configuration.getWorldServerBinary(), '/app/server/bin');

(async () => {

    consoleHelper.writeBox('TrinityCore 335 Docker 1.0.0');

    if (!await applicationInitializer.checkDatabaseConnection()) {
        return;
    }

    if (!await applicationInitializer.checkDatabasesStructure()) {
        return;
    }

    if (!await applicationInitializer.checkDatabasesInitialData()) {
        return;
    }

    if (!applicationInitializer.updateAuthServerConfiguration()) {
        return;
    }

    if (!applicationInitializer.updateWorldServerConfiguration()) {
        return;
    }

    if (!await applicationInitializer.updateApplicationDatabase()) {
        return;
    }

    if (!await applicationInitializer.updateRealmInformations()) {
        return;
    }

    if (!await applicationInitializer.checkClientMapData()) {
        return;
    }

    consoleHelper.writeBox('Application Startup Complete');

    app.use(express.static(path.join(__dirname, 'public')));
    
    app.get('/', (req, res) => {
        res.sendFile(__dirname + '/public/index.html');
    });

    io.on('connection', (socket) => {
        socket.on('worldserver_input', (input) => {
            worldServerRunner.send(input);
        });
        socket.on('authserver_input', (input) => {
            authServerRunner.send(input);
        });

        socket.emit('authserver_state', {
            output: authServerRunner.getOutput(),
            running: authServerRunner.isRunning(),
            code: authServerRunner.getCode()
        });
        socket.emit('worldserver_state', {
            output: worldServerRunner.getOutput(),
            running: worldServerRunner.isRunning(),
            code: worldServerRunner.getCode()
        });
    });

    authServerRunner.start(() => {
        io.emit('authserver_state',{
            output: authServerRunner.getOutput(),
            running: authServerRunner.isRunning(),
            code: authServerRunner.getCode()
        });
    });

    worldServerRunner.start(() => {
        io.emit('worldserver_state',{
            output: worldServerRunner.getOutput(),
            running: worldServerRunner.isRunning(),
            code: worldServerRunner.getCode()
        });
    });
   
    server.listen(3000, () => {
        consoleHelper.writeBox('Web interface listening on http://0.0.0.0:3000');
    });
})();

