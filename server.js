const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname)); // Позволяет обслуживать статические файлы, такие как index.html

// Корневой маршрут
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html'); // Отправляем index.html
});

// Получение количества монет для пользователя
app.get('/coins/:userId', (req, res) => {
    const userId = req.params.userId;

    fs.readFile('coins.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Ошибка чтения файла.' });
        }
        let coinsData;
        try {
            coinsData = JSON.parse(data);
        } catch (parseErr) {
            return res.status(500).json({ error: 'Ошибка парсинга данных.' });
        }

        const userCoins = coinsData[userId] || 0;
        res.json({ coins: userCoins });
    });
});

// Увеличение количества монет
app.post('/coins', (req, res) => {
    const userId = req.body.userId;

    fs.readFile('coins.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Ошибка чтения файла.' });
        }
        let coinsData;
        try {
            coinsData = JSON.parse(data);
        } catch (parseErr) {
            return res.status(500).json({ error: 'Ошибка парсинга данных.' });
        }

        // Увеличиваем количество монет для пользователя
        if (!coinsData[userId]) {
            coinsData[userId] = 0;
        }
        coinsData[userId] += 1;

        fs.writeFile('coins.json', JSON.stringify(coinsData, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Ошибка записи файла.' });
            }
            res.json({ coins: coinsData[userId] });
        });
    });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
