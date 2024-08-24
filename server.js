const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

// Создание приложения
const app = express();
const PORT = process.env.PORT || 3000; // Используй PORT из окружения или 3000 по умолчанию

// Включение промежуточного ПО
app.use(cors());
app.use(bodyParser.json());

// Статическое обслуживание файлов из папки 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Эндпоинт для получения количества монет
app.get('/coins/:userId', (req, res) => {
    const userId = req.params.userId;

    // Здесь предполагается, что у тебя есть coins.json для хранения данных о монетах
    fs.readFile('coins.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Ошибка чтения файла.' });
        }

        const coinsData = JSON.parse(data);
        const userCoins = coinsData[userId] || 0; // Если пользователь не найден, возвращаем 0
        res.json({ coins: userCoins });
    });
});

// Эндпоинт для обновления количества монет
app.post('/coins', (req, res) => {
    const userId = req.body.userId;

    // Здесь предполагается, что у тебя есть coins.json для хранения данных о монетах
    fs.readFile('coins.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Ошибка чтения файла.' });
        }

        const coinsData = JSON.parse(data);
        coinsData[userId] = (coinsData[userId] || 0) + 1; // Увеличиваем количество монет на 1
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
    res.send('Сервер работает!'); // Отправляем простой текст для проверки
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});


