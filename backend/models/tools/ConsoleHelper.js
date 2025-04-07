class ConsoleHelper {
    constructor() {
        this.lineWidth = 80;
    }

    // Génère une ligne de bordure avec un caractère donné
    generateLine(startChar, fillChar, endChar) {
        let line = startChar;
        while (line.length < this.lineWidth - 1) {
            line += fillChar;
        }
        line += endChar;
        return line;
    }

    // Centre un contenu dans une largeur donnée
    centerContent(content, width) {
        if (content.length > width) {
            content = content.substring(0, width); // Tronquer si le contenu est trop long
        }
        const padding = Math.max(0, Math.floor((width - content.length) / 2));
        return ' '.repeat(padding) + content + ' '.repeat(width - content.length - padding);
    }

    // Affiche une boîte avec un titre centré
    beginBox(content) {
        const titleWidth = this.lineWidth - 4;
        const centeredTitle = this.centerContent(content, titleWidth);
        console.info(this.generateLine('╔', '═', '╗'));
        console.info(`║ ${centeredTitle} ║`);
        console.info(this.generateLine('╠', '═', '╣'));
    }

    // Termine une boîte avec un contenu centré
    endBox(content) {
        const contentLine = `║ ${content.padEnd(this.lineWidth - 3)}║`;
        console.info(contentLine);
        console.info(this.generateLine('╚', '═', '╝'));
    }

    // Écrit une ligne dans une boîte
    writeBoxLine(content) {
        if (content.length > this.lineWidth - 3) {
            content = content.substring(0, this.lineWidth - 3); // Tronquer si le contenu est trop long
        }
        const contentLine = `║ ${content.padEnd(this.lineWidth - 3)}║`;
        console.info(contentLine);
    }

    // Affiche une boîte complète avec un contenu centré
    writeBox(content) {
        const titleWidth = this.lineWidth - 4;
        const centeredTitle = this.centerContent(content, titleWidth);
        console.info(this.generateLine('╔', '═', '╗'));
        console.info(`║ ${centeredTitle} ║`);
        console.info(this.generateLine('╚', '═', '╝'));
        this.newLine();
    }

    // Ajoute une ligne vide
    newLine() {
        console.info('');
    }
}

module.exports = ConsoleHelper;