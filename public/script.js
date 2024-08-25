let coinCount = 0; // Переменная для хранения количества монет
const userId = 'user1'; // Идентификатор пользователя (может быть изменен)

// Функция для получения количества монет с сервера
function getCoins() {
    fetch(`/coins/${userId}`) // Запрос на сервер
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка загрузки количества монет');
            }
            return response.json(); // Преобразование ответа в JSON
        })
        .then(data => {
            coinCount = data.coins; // Обновляем coinCount из ответа сервера
            document.getElementById('coinCount').innerText = `У тебя ${coinCount} монет!`; // Обновляем текст на странице
        })
        .catch(error => {
            console.error('Ошибка при получении количества монет:', error);
        });
}

// Обработчик клика на кнопку
document.getElementById('coinButton').onclick = function() {
    coinCount++; // Увеличиваем количество монет на 1
    document.getElementById('coinCount').innerText = `У тебя ${coinCount} монет!`; // Обновляем текст на странице

    // Отправляем обновление количества монет на сервер
    fetch('/coins', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: userId }) // Отправляем ID пользователя
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Ошибка обновления количества монет');
        }
        return response.json(); // Преобразуем ответ в JSON
    })
    .then(data => {
        console.log('Монеты обновлены на сервере:', data);
    })
    .catch(error => {
        console.error('Ошибка при обновлении монет на сервере:', error);
    });
};

// Получаем количество монет при загрузке страницы
window.onload = function() {
    getCoins(); // Вызов функции для получения количества монет с сервера
};
