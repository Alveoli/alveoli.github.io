const canvas = document.getElementById('skiGame');
const ctx = canvas.getContext('2d');
const leftButton = document.getElementById('leftButton');
const rightButton = document.getElementById('rightButton');
const introText = document.getElementById('introText');
const gameTitle = document.getElementById('gameTitle');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let skier = {
    x: canvas.width / 2,
    y: canvas.height * 0.2,
    emoji: '⛷️',
    size: canvas.width / 20,
    speed: 5,
    moveLeft: false,
    moveRight: false
};

let obstacles = [];
let gameInterval, scoreInterval, obstacleTimer;
let score = 0;
let topScore = 0;
let obstacleInterval = 1000;

function drawSkier() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${skier.size}px Arial`;
    ctx.fillText(skier.emoji, skier.x, skier.y);
    displayScores();
}

function updateSkierPosition() {
    if (skier.moveLeft && skier.x > 0) {
        skier.x -= skier.speed;
    }
    if (skier.moveRight && skier.x < (canvas.width - skier.size)) {
        skier.x += skier.speed;
    }
}

function handleKeyDown(e) {
    if (e.key === 'ArrowLeft') skier.moveLeft = true;
    if (e.key === 'ArrowRight') skier.moveRight = true;
}

function handleKeyUp(e) {
    if (e.key === 'ArrowLeft') skier.moveLeft = false;
    if (e.key === 'ArrowRight') skier.moveRight = false;
}

function createObstacle() {
    const obstacleEmojis = [
        '🌲', '🌲', '🌲', '🌲', // Trees (more common)
        '🌲', '🌲', '🌲', '🌲', // Trees (more common)
        '🌲', '🌲', '🌲', '🌲', // Trees (more common)
        '🌲', '🌲', '🌲', '🌲', // Trees (more common)
        '🌲', '🌲', '🌲', '🌲', // Trees (more common)
        '🌲', '🌲', '🌲', '🌲', // Trees (more common)
        '🗻', '🗻', '🗻', '🗻', // Mountains (more common)
        '🗻', '🗻', '🗻', '🗻', // Mountains (more common)
        '⛰', '⛰', '⛰', '⛰', // Mountains (more common)
        '⛄','❄', // Snow
        '🚧','🚧', // Roadblock
        '🦌','⛪','🐇','🎄','🔥', // Rare stuff!
        '🚗', '🚕', '🚙', '🚌', '🚓', // Vehicles
        '🚶‍♀️', '🏃‍♀️', '🧍‍♀️', '🚶', '🏃', '🧍' // People (more female representations)
    ];
    let obstacleEmoji = obstacleEmojis[Math.floor(Math.random() * obstacleEmojis.length)];

    let obstacle = {
        x: Math.random() * (canvas.width - skier.size),
        y: canvas.height,
        emoji: obstacleEmoji,
        size: skier.size
    };
    obstacles.push(obstacle);
}

function drawObstacles() {
    ctx.font = `${skier.size}px Arial`;
    obstacles.forEach(obstacle => {
        ctx.fillText(obstacle.emoji, obstacle.x, obstacle.y);
        obstacle.y -= 6;
        checkCollision(obstacle);
    });
}

function checkCollision(obstacle) {
    let collisionDistance = skier.size / 1.5;
    if (skier.x < obstacle.x + collisionDistance &&
        skier.x + collisionDistance > obstacle.x &&
        skier.y < obstacle.y + collisionDistance &&
        skier.y + collisionDistance > obstacle.y) {
        score = 0;
        obstacleInterval = 1000;
//        startObstacleCreation();
        skier.emoji = '💩';
        document.getElementById('ouchSound').play(); // Play the ouch sound
        setTimeout(() => skier.emoji = '⛷️', 1000);
    }
}

function startObstacleCreation() {
    if (obstacleTimer) clearInterval(obstacleTimer);
    obstacleTimer = setInterval(createObstacle, obstacleInterval);
}

function increaseDifficulty() {
    if (obstacleInterval > 100) {
        obstacleInterval -= 25;
        startObstacleCreation();
    }
}

function updateGame() {
    updateSkierPosition();
    drawSkier();
    drawObstacles();
}

function startGame() {
    if (gameInterval) clearInterval(gameInterval);
    if (scoreInterval) clearInterval(scoreInterval);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    gameInterval = setInterval(updateGame, 30);
    scoreInterval = setInterval(() => {
        score++;
        if (score > topScore) topScore = score;
        increaseDifficulty();
    }, 1000);
    startObstacleCreation();
}

function displayScores() {
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.fillText(`Score: ${score}`, 10, 20);
    ctx.fillText(`Top Score: ${topScore}`, canvas.width - 110, 20);
}

function showGame() {
    introText.style.display = 'none';
    gameTitle.style.display = 'block';
    canvas.style.display = 'block';
    leftButton.style.display = 'block';
    rightButton.style.display = 'block';
    startGame();
}

leftButton.addEventListener('touchstart', () => skier.moveLeft = true);
leftButton.addEventListener('touchend', () => skier.moveLeft = false);
leftButton.addEventListener('mousedown', () => skier.moveLeft = true);
leftButton.addEventListener('mouseup', () => skier.moveLeft = false);

rightButton.addEventListener('touchstart', () => skier.moveRight = true);
rightButton.addEventListener('touchend', () => skier.moveRight = false);
rightButton.addEventListener('mousedown', () => skier.moveRight = true);
rightButton.addEventListener('mouseup', () => skier.moveRight = false);

document.querySelector('.blinking-cursor').addEventListener('click', showGame);
