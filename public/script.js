let coinCount = 0;
const userId = 'user123'; // Это должен быть уникальный идентификатор для каждого пользователя

// Получить количество монет при загрузке
fetch(`http://localhost:3000/coins/${userId}`)
    .then(response => response.json())
    .then(data => {
        coinCount = data.coins; // Устанавливаем количество монет
        document.getElementById('coinCount').innerText = `У тебя ${coinCount} монет!`;
    });

// Обработка клика по кнопке
document.getElementById('coinButton').addEventListener('click', () => {
    coinCount++; // Увеличиваем количество монет на 1
    document.getElementById('coinCount').innerText = `У тебя ${coinCount} монет!`;

    // Отправка обновленного количества монет на сервер
    fetch('http://localhost:3000/coins', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }) // Отправляем userId в формате JSON
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('coinCount').innerText = `У тебя ${data.coins} монет!`;
    })
    .catch(error => {
        console.error('Ошибка:', error); // Обработка ошибок
    });
});


