const express = require('express'); // Импортируем Express
const bodyParser = require('body-parser'); // Импортируем body-parser для обработки JSON
const fs = require('fs'); // Импортируем файловую систему
const cors = require('cors'); // Импортируем cors для работы с кросс-доменными запросами

// Создание приложения Express
const app = express();
const PORT = 3000; // Указываем порт, на котором будет работать сервер

// Включение промежуточного ПО
app.use(cors()); // Разрешаем кросс-доменные запросы
app.use(bodyParser.json()); // Обрабатываем JSON в запросах

// Эндпоинт для получения данных о кликах
app.get('/coins/:userId', (req, res) => {
    const userId = req.params.userId; // Получаем ID пользователя из URL
    
    // Чтение данных из файла
    fs.readFile('coins.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Ошибка чтения файла' }); // Обрабатываем ошибку чтения файла
        }
        
        const coins = JSON.parse(data || '{}'); // Парсим данные JSON
        const userCoins = coins[userId] || 0; // Получаем монеты для этого пользователя

        res.json({ coins: userCoins }); // Отправляем количество монет пользователю
    });
});

// Эндпоинт для обновления данных о кликах
app.post('/coins', (req, res) => {
    const { userId } = req.body; // Извлекаем userId из тела запроса
    
    // Чтение данных из файла
    fs.readFile('coins.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Ошибка чтения файла' }); // Обрабатываем ошибку чтения файла
        }

        const coins = JSON.parse(data || '{}'); // Парсим данные JSON
        coins[userId] = (coins[userId] || 0) + 1; // Увеличиваем количество монет для пользователя

        // Записываем обновленные данные обратно в файл
        fs.writeFile('coins.json', JSON.stringify(coins), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Ошибка при записи в файл' }); // Обрабатываем ошибку записи файла
            }

            res.json({ coins: coins[userId] }); // Отправляем обновленное количество монет пользователю
        });
    });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`); // Выводим сообщение о запуске сервера
});
