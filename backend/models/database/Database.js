const mysql = require('mysql2/promise');

class Database {

    constructor(dbConfig) {
        this.config = dbConfig;
    }

    async isInitialized() {
        const connection = await mysql.createConnection(this.config['root']);
        try {
            const sql = 'SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?';
            const params = [this.config['auth'].database];
            const [rows] = await connection.execute(sql, params);
            return rows.length > 0;
        } finally {
            await connection.end();
        }
    }

    async containsData() {
        const connection = await mysql.createConnection(this.config['root']);
        try {
            const sql = 'SELECT COUNT(*) AS count FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ?';
            const params = [this.config['auth'].database];
            const [rows] = await connection.execute(sql, params);
            return rows[0].count > 0;
        } finally {
            await connection.end();
        }
    }

    async query(database, sql, params) {
        const connection = await mysql.createConnection(this.config[database]);
        try {
            const [rows] = await connection.execute(sql, params);
            return rows;
        } finally {
            await connection.end();
        }
    }

    async execute(database, sql, params) {
        const connection = await mysql.createConnection(this.config[database]);
        try {
            const [result] = await connection.execute(sql, params);
            return result;
        } finally {
            await connection.end();
        }
    }

    async checkConnection(database, maxAttempts = 12, delay = 5000, attemptFailed = null) {
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                const connection = await mysql.createConnection(this.config[database]);
                await connection.end();
                return true; // Connection successful
            } catch (error) {
                if (attemptFailed) {
                    attemptFailed(attempt, maxAttempts);
                }
                if (attempt === maxAttempts) {
                    return false; // All attempts failed
                }
                await new Promise((resolve) => setTimeout(resolve, delay)); // Wait for 5 seconds
            }
        }
    }

}

module.exports = Database;