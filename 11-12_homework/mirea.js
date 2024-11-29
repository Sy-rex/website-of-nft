const fs = require('fs');
const path = require('path');

const inputFilePath = path.join(__dirname, 'МИРЭА.txt'); // Путь к исходному текстовому файлу
const outputFilePath = path.join(__dirname, 'result1.txt'); // Путь для текстового отчета

// Чтение содержимого файла
fs.readFile(inputFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Ошибка при чтении файла:', err);
        return;
    }

    // Регулярные выражения для поиска
    const yearRegex = /(?<![\w-])\b(1[6-9]\d{2}|20[0-4]\d|2050)\b(?=\s|[+.,!?)]|$)/g;
    const sourceLinkRegex = /\[\d+(-\d+)?\]/g;
    const moneyRegex = /\b\d{1,3}(?:\s\d{3})*(?:\.\d{2})?\s?(?:руб(?:\.|ля|лей|лями)?)/gi;

    // Функция для подсчета уникальных значений
    const getUniqueCounts = (matches) => {
        const counts = {};
        matches.forEach(match => {
            const key = match.trim();
            counts[key] = (counts[key] || 0) + 1;
        });
        return counts;
    };

    // Поиск совпадений
    const years = data.match(yearRegex) || [];
    const sourceLinks = data.match(sourceLinkRegex) || [];
    const moneySums = data.match(moneyRegex) || [];

    // Получение уникальных значений и их количества
    const uniqueYears = getUniqueCounts(years);
    const uniqueSourceLinks = getUniqueCounts(sourceLinks);
    const uniqueMoneySums = getUniqueCounts(moneySums);

    // Формирование текстового отчета
    let outputContent = `Года:
Общее количество: ${years.length}
Уникальные значения и количество:
`;

    for (const [year, count] of Object.entries(uniqueYears)) {
        outputContent += `${year} - ${count}\n`;
    }

    outputContent += `\nСсылки:
Общее количество: ${sourceLinks.length}
Уникальные значения и количество:
`;

    for (const [link, count] of Object.entries(uniqueSourceLinks)) {
        outputContent += `${link} - ${count}\n`;
    }

    outputContent += `\nДенежные суммы:
Общее количество: ${moneySums.length}
Уникальные значения и количество:
`;

    for (const [sum, count] of Object.entries(uniqueMoneySums)) {
        outputContent += `${sum} - ${count}\n`;
    }

    // Запись результатов в текстовый файл
    fs.writeFile(outputFilePath, outputContent, 'utf8', (err) => {
        if (err) {
            console.error('Ошибка при записи файла:', err);
            return;
        }
        console.log('Анализ завершен. Результаты записаны в файл "result1.txt".');
    });
});
