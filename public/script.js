let coinCount = 0;
const userId = 'user_' + Math.random().toString(36).substr(2, 9);

// Функция для получения количества монет
function getCoins() {
    fetch(`/coins/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка загрузки количества монет');
            }
            return response.json();
        })
        .then(data => {
            coinCount = data.coins;
            document.getElementById('coinCount').innerText = `У тебя ${coinCount} монет!`;
        })
        .catch(error => {
            console.error('Ошибка при получении количества монет:', error);
        });
}

// Обработчик клика на кнопку
document.getElementById('coinButton').onclick = function() {
    coinCount++;
    document.getElementById('coinCount').innerText = `У тебя ${coinCount} монет!`;

    fetch('/coins', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Ошибка обновления количества монет');
        }
        return response.json();
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
    getCoins();
};
