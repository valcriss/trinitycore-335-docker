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

            let result = await this.commandExecuter.execute(`/usr/bin/7z`, [`x`,`/app/server/bin/${filename}`,`-o${extractPath}`, `-y`], '/app/server/bin');
            if (!result) {
                return false;
            }

            fs.unlinkSync('/app/server/bin/' + filename);

            return true;
        } catch (error) {
            return false;
        }
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