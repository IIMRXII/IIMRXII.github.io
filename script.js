let coinCount = 0;

document.getElementById('coinButton').addEventListener('click', () => {
    coinCount++;
    document.getElementById('coinCount').innerText = `У тебя ${coinCount} монет!`;
});
