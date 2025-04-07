const CommandExecuter = require('./CommandExecuter');

class CommandRunner {

    constructor(binaryPath, binaryCwd) {
        this.binaryCwd = binaryCwd;
        this.binaryPath = binaryPath;
        this.commandExecuter = new CommandExecuter();
        this.buffer = '';
        this.running = false;
        this.code = 0;
    }

    start(onUpdate = null) {
        this.commandExecuter.execute(this.binaryPath, [], this.binaryCwd, (stdout) => {
            this.buffer += stdout.toString();
            this.truncateBuffer();
            if (onUpdate) {
                onUpdate();
            }
        }, (stderr) => {
            this.buffer += stderr.toString();
            this.truncateBuffer();
            if (onUpdate) {
                onUpdate();
            }
        }, (code) => {
            this.code = code;
            this.running = false;
            if (onUpdate) {
                onUpdate();
            }
        });
        this.running = true;
        if (onUpdate) {
            onUpdate();
        }
    }

    send(command) {
        if (this.running) {
            this.commandExecuter.send(command);
        }
    }

    getOutput() {
        return this.buffer;
    }

    isRunning() {
        return this.running;
    }

    getCode() {
        return this.code;
    }

    truncateBuffer() {
        const lines = this.buffer.split('\n');
        if (lines.length > 1000) {
            this.buffer = lines.slice(-1000).join('\n');
        }
    }
}

module.exports = CommandRunner;