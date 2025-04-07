const { spawn } = require('child_process');

class CommandExecuter {

    constructor() {
        this.process = null;
    }

    send(command)
    {
        if (this.process) {
            this.process.stdin.write(command + '\n');
        }
    }

    async execute(command, args, cwd, onStdout = null, onStderr = null, onClose = null) {
        let result = true;
        const exectPromise = new Promise((resolve, reject) => {
            this.process = spawn(command, args, { cwd: cwd });

            this.process.stdout.on('data', (data) => {
                if (onStdout) {
                    onStdout(data);
                }
            });

            this.process.stderr.on('data', (data) => {
                if (onStderr) {
                    onStderr(data);
                }
            });

            this.process.on('close', (code) => {
                if (onClose) {
                    onClose(code);
                }
                if (code === 0) {
                    resolve();
                } else {
                    result = false;
                    reject(new Error(`Process exited with code ${code}`));
                }
            });

            this.process.on('error', (error) => {
                result = false;
                reject(new Error(`Erreur lors de l'exécution : ${error.message}`));
            });
        });
        await exectPromise;
        this.process = null;
        return result;
    }
}

module.exports = CommandExecuter;