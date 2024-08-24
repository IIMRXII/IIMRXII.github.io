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
app.use(express.static(path.join(__dirname, 'public'))); 

// Эндпоинт для получения количества монет 
app.get('/coins/:userId', (req, res) => { 
    const userId = req.params.userId; 

    // Чтение данных из файла
    fs.readFile('coins.json', 'utf8', (err, data) => { 
        if (err) { 
            // Создание файла, если он не существует
            if (err.code === 'ENOENT') {
                fs.writeFile('coins.json', JSON.stringify({}), (err) => {
                    if (err) {
                        return res.status(500).json({ error: 'Ошибка создания файла.' });
                    }
                    return res.json({ coins: 0 }); // Если файл создан, отдаем 0 монет
                });
            } else {
                return res.status(500).json({ error: 'Ошибка чтения файла.' }); 
            }
        } 

        const coinsData = JSON.parse(data); 
        const userCoins = coinsData[userId] || 0; // Если пользователь не найден, возвращаем 0 
        res.json({ coins: userCoins }); 
    }); 
}); 

// Эндпоинт для обновления количества монет 
app.post('/coins', (req, res) => { 
    const userId = req.body.userId; 

    // Чтение данных из файла
    fs.readFile('coins.json', 'utf8', (err, data) => { 
        if (err) { 
            return res.status(500).json({ error: 'Ошибка чтения файла.' }); 
        } 

        const coinsData = JSON.parse(data); 
        coinsData[userId] = (coinsData[userId] || 0) + 1; // Увеличиваем количество монет на 1 
        
        // Записываем обновленные данные обратно в файл
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


