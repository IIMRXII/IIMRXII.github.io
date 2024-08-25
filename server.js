const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

// Создание приложения
const app = express();
const PORT = 3000; // Используй PORT из окружения или 3000 по умолчанию

// Включение промежуточного ПО
app.use(cors());
app.use(bodyParser.json());

// Статическое обслуживание файлов из папки 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Эндпоинт для получения количества монет
app.get('/coins/:userId', (req, res) => {
    const userId = req.params.userId; // Получаем userId из параметров

    fs.readFile('coins.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Ошибка чтения файла.' });
        }

        let coinsData = {};
        if (data) {
            coinsData = JSON.parse(data); // Парсинг JSON только если файл не пуст
        }

        const userCoins = coinsData[userId] || 0; // Если пользователь не найден, возвращаем 0
        res.json({ coins: userCoins });
    });
});

// Эндпоинт для обновления количества монет
app.post('/coins', (req, res) => {
    const userId = req.body.userId; // Получаем userId из тела запроса

    fs.readFile('coins.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Ошибка чтения файла.' });
        }

        let coinsData = {};
        if (data) {
            coinsData = JSON.parse(data); // Парсинг JSON только если файл не пуст
        }

        coinsData[userId] = (coinsData[userId] || 0) + 1; // Увеличиваем количество монет на 1 для конкретного пользователя

        // Сохранение изменений в файл
        fs.writeFile('coins.json', JSON.stringify(coinsData), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Ошибка записи файла.' });
            }
            res.json({ coins: coinsData[userId] });
        });
    });
});

// Обработчик корневого маршрута
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html')); // Отправляем файл index.html
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
