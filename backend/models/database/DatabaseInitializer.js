const fs = require('fs');
const path = require('path');
const https = require('https');
const { exec } = require('child_process');
const FileDownloader = require('../tools/FileDownloader');
const CommandExecuter = require('../tools/CommandExecuter');
class DatabaseInitializer {
    constructor(configuration, database, consoleHelper) {
        this.consoleHelper = consoleHelper;
        this.configuration = configuration;
        this.database = database;
        this.commandExecuter = new CommandExecuter();
    }

    async initialize() {
        try {
            const inputFilePath = path.resolve(__dirname, '../../resources/create_mysql.sql');
            const replacements = {
                DATABASE_USER: this.configuration.getDatabaseUser(),
                DATABASE_PASSWORD: this.configuration.getDatabasePassword(),
                AUTH_DATABASE_NAME: this.configuration.getAuthDatabaseName(),
                WORLD_DATABASE_NAME: this.configuration.getWorldDatabaseName(),
                CHARACTER_DATABASE_NAME: this.configuration.getCharacterDatabaseName()
            };
            let content = fs.readFileSync(inputFilePath, 'utf8');
            for (const [placeholder, value] of Object.entries(replacements)) {
                content = content.replace(new RegExp(`<${placeholder}>`, 'g'), value);
            }

            const sqlStatements = content.split(';').filter(statement => statement.trim() !== '');
            for (const sql of sqlStatements) {
                await this.database.execute('root', sql);
            }

            return true;
        } catch (error) {
            return false;
        }
    }

    async downloadInitialData() {
        try {
            const releases = await this.fetchTrinityCoreReleases();
            const latestRelease = releases.find(release => release.assets[0]?.name.startsWith('TDB_full_world_335'));
            if (!latestRelease) {
                throw new Error("No release found with a name starting with 'TDB_full_world_335'");
            }
            const downloadUrl = latestRelease.assets[0].browser_download_url;
            const filename = latestRelease.assets[0].name;

            let fileDownloader = new FileDownloader();
            await fileDownloader.downloadFile(downloadUrl, '/app/server/bin', filename);

            const extractPath = '/app/server/bin/';

            let result = await this.commandExecuter.execute(`/usr/bin/7z`, [`x`, `/app/server/bin/${filename}`, `-o${extractPath}`, `-y`], '/app/server/bin');
            if (!result) {
                return false;
            }

            fs.unlinkSync('/app/server/bin/' + filename);

            return true;
        } catch (error) {
            return false;
        }
    }

    async initializeBotsData() {
        try {
            // Update world database
            const worldInitialScripts = [
                "/app/TrinityCoreBots/sql/Bots/1_world_bot_appearance.sql",
                "/app/TrinityCoreBots/sql/Bots/2_world_bot_extras.sql",
                "/app/TrinityCoreBots/sql/Bots/3_world_bots.sql",
                "/app/TrinityCoreBots/sql/Bots/4_world_generate_bot_equips.sql",
                "/app/TrinityCoreBots/sql/Bots/5_world_botgiver.sql",
            ];

            // Process world scripts
            for (const script of worldInitialScripts) {
                try {
                    await this.processSqlFileInBashCall(script, 'world');
                }
                catch (error) {
                    console.error(`Error processing ${script}:`, error);
                }
            }

            // Process characters scripts
            const charactersInitialScripts = [
                "/app/TrinityCoreBots/sql/Bots/characters_bots.sql"
            ];

            for (const script of charactersInitialScripts) {
                await this.processSqlFileInBashCall(script, 'characters');
            }

            // Process ALL_*.sql files
            const inputFiles = {
                'auth': '/app/TrinityCoreBots/sql/Bots/ALL_auth.sql',
                'characters': '/app/TrinityCoreBots/sql/Bots/ALL_characters.sql',
                'world': '/app/TrinityCoreBots/sql/Bots/ALL_world.sql',
            };

            for (const [db, filePath] of Object.entries(inputFiles)) {
                await this.processSqlFileInBashCall(filePath, db);
            }

            return true;
        } catch (error) {
            console.error('Error initializing bots data:', error);
            return false;
        }
    }

    async processSqlFileInBashCall(filePath, database) {
        try {
            let content = fs.readFileSync(filePath, 'utf8');
            const tempFilePath = '/tmp/temp_queries.sql';
            fs.writeFileSync(tempFilePath, content);
            const dbConfig = this.database.config[database];
            const command = `mysql -u${dbConfig.user} -p${dbConfig.password} -h${dbConfig.host} ${dbConfig.database} < ${tempFilePath}`;
            await this.executeBashCommand(command);
            fs.unlinkSync(tempFilePath);
            return true;
        } catch (error) {
            console.error('Error processing SQL file in bash call:', error);
            return false;
        }
    }

    async executeBashCommand(command) {
        return new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Erreur d'exécution: ${error}`);
                    reject(error);
                    return;
                }
                if (stderr) {
                    if (!stderr.includes('Using a password on the command line interface can be insecure.')) {
                        console.error(`stderr: ${stderr}`);
                    }
                }
                resolve(stdout);
            });
        });
    }

    async fetchTrinityCoreReleases() {
        const options = {
            hostname: 'api.github.com',
            path: '/repos/TrinityCore/TrinityCore/releases',
            method: 'GET',
            headers: {
                'Accept': 'application/vnd.github+json',
                'X-GitHub-Api-Version': '2022-11-28',
                'User-Agent': 'Node.js'
            }
        };

        return new Promise((resolve, reject) => {
            const req = https.request(options, (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    try {
                        const json = JSON.parse(data);
                        resolve(json);
                    } catch (error) {
                        reject(new Error('Erreur lors du parsing JSON : ' + error.message));
                    }
                });
            });

            req.on('error', (error) => {
                reject(new Error('Erreur lors de la requête HTTPS : ' + error.message));
            });

            req.end();
        });
    }

    async updateApplicationDatabase() {
        return await this.commandExecuter.execute(`/app/server/bin/worldserver`, [`-u`], '/app/server/bin');
    }

    async updateRealmInformations() {
        try {
            const sql = `UPDATE realmlist SET name = ?, address = ? WHERE id = ?`;
            const params = [
                this.configuration.getServerName(),
                this.configuration.getPublicIpAddress(),
                1
            ];
            await this.database.execute('auth', sql, params);
            return true;
        }
        catch (error) {
            console.error('Error updating realm informations:', error);
            return false;
        }
    }
}

module.exports = DatabaseInitializer;