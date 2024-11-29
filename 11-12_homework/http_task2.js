const fs = require('fs');
const path = require('path');

const inputFilePath = path.join(__dirname, 'Requests2.txt');
const outputFilePath = path.join(__dirname, 'result2.txt');

// Чтение содержимого файла
fs.readFile(inputFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Ошибка при чтении файла:', err);
        return;
    }

    const lines = data.split('\n').filter(line => line.trim() !== '');

    let notFoundCount = 0;
    const notFoundEntries = [];
    const notFoundLines = [];

    let postCount = 0;
    const postEntries = [];
    const postLines = [];

    const userAgentMap = new Map();

    // Регулярное выражение для парсинга строки лога
    const logRegex = /\[([^\]]+)\]\s"(\w+)\s([^"]+)"\s(\d{3})\s(\d+)\s"([^"]*)"\s"([^"]*)"/;

    lines.forEach((line, index) => {
        const match = line.match(logRegex);
        if (match) {
            const [
                ,
                datetime,
                method,
                url,
                statusCode,
                size,
                referrer,
                userAgent
            ] = match;

            // Подсчет 404 ошибок
            if (statusCode === '404') {
                notFoundCount += 1;
                notFoundEntries.push({
                    datetime,
                    method,
                    url,
                    statusCode,
                    size,
                    referrer,
                    userAgent
                });
                notFoundLines.push(line);
            }

            // Подсчет POST-запросов
            if (method.toUpperCase() === 'POST') {
                postCount += 1;
                postEntries.push({
                    datetime,
                    method,
                    url,
                    statusCode,
                    size,
                    referrer,
                    userAgent
                });
                postLines.push(line);
            }

            // Подсчет уникальных User-Agent
            if (userAgentMap.has(userAgent)) {
                userAgentMap.set(userAgent, userAgentMap.get(userAgent) + 1);
            } else {
                userAgentMap.set(userAgent, 1);
            }
        } else {
            console.warn(`Строка ${index + 1} не соответствует ожидаемому формату: ${line}`);
        }
    });

    // Формирование отчетного содержимого
    let result = '';

    result += '404:\n';
    result += `${notFoundCount}\n`;
    notFoundLines.forEach(line => {
        result += `${line}\n`;
    });
    result += '\n';

    result += 'User-Agent:\n';
    result += `${userAgentMap.size}\n`;
    userAgentMap.forEach((count, ua) => {
        result += `${count} - ${ua}\n`;
    });
    result += '\n';

    result += 'POST:\n';
    result += `${postCount}\n`;
    postLines.forEach(line => {
        result += `${line}\n`;
    });
    result += '\n';

    // Запись результата в файл
    fs.writeFile(outputFilePath, result, 'utf8', (err) => {
        if (err) {
            console.error('Ошибка при записи файла:', err);
            return;
        }
        console.log('Результаты успешно записаны в', outputFilePath);
    });
});
