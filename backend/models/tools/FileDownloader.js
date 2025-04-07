const fs = require('fs');
const axios = require('axios');
const { promisify } = require('util');

const existDir = promisify(fs.exists);
const createDir = promisify(fs.mkdir);


class FileDownloader {
    /**
     * @description Download a file using URL
     *
     * @param {String} URL URL to download the file
     * @param {String} path Folder path to save the file
     * @param {String} name File name
     */

    async downloadFile(URL, path, name) {
        const response = await axios.get(URL, { responseType: 'stream' });

        const dir = await existDir(path);

        if (!dir) {
            await createDir(path);
        }

        response.data.pipe(fs.createWriteStream(`${path}/${name}`));

        return new Promise((resolve, reject) => {
            response.data.on('end', () => {
                resolve();
            });

            response.data.on('error', () => {
                reject();
            });
        });
    }
}
module.exports = FileDownloader;