const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises; // Используем промисы для работы с файлами
const path = require('path');
const cors = require('cors');

// Создание приложения
const app = express();
const PORT = process.env.PORT || 10000; // Используй PORT из окружения или 10000 по умолчанию

// Включение промежуточного ПО
app.use(cors());
app.use(bodyParser.json());

// Статическое обслуживание файлов из папки 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Функция для чтения coins.json
const readCoinsData = async () => {
    try {
        const data = await fs.readFile('coins.json', 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Ошибка чтения файла:', err);
        throw new Error('Ошибка чтения файла.');
    }
};

// Функция для записи в coins.json
const writeCoinsData = async (coinsData) => {
    try {
        await fs.writeFile('coins.json', JSON.stringify(coinsData));
    } catch (err) {
        console.error('Ошибка записи в файл:', err);
        throw new Error('Ошибка записи файла.');
    }
};

// Эндпоинт для получения количества монет
app.get('/coins/:userId', async (req, res) => {
    const userId = req.params.userId; // Получаем userId из параметров

    try {
        const coinsData = await readCoinsData();
        const userCoins = coinsData[userId] || 0; // Если пользователь не найден, возвращаем 0
        res.json({ coins: userCoins });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Эндпоинт для обновления количества монет
app.post('/coins', async (req, res) => {
    const userId = req.body.userId; // Получаем userId из тела запроса

    try {
        const coinsData = await readCoinsData();
        // Увеличиваем количество монет на 1 для конкретного пользователя
        coinsData[userId] = (coinsData[userId] || 0) + 1;

        // Сохранение изменений в файл
        await writeCoinsData(coinsData);
        res.json({ coins: coinsData[userId] });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Обработчик корневого маршрута
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html')); // Отправляем файл index.html
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
