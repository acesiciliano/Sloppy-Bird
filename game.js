const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Load bird image
let birdImg = new Image();
birdImg.src = './bird.png';

// Load tree image
let treeImg = new Image();
treeImg.src = './tree.png';

// Bird object
let bird = {
    x: 50,
    y: 150,
    width: 40,
    height: 30,
    gravity: 0.6,
    lift: -15,
    velocity: 0
};

// Tree array
let trees = [];
let score = 0;
let frame = 0;
let gameOver = false;

// Game loop
function gameLoop() {
    if (!gameOver) {
        updateGame();  // Update game state
        drawGame();    // Draw game elements
        requestAnimationFrame(gameLoop);  // Continue the loop
    } else {
        drawGameOver();  // Show game over screen
    }
}

// Update bird and trees
function updateGame() {
    // Bird physics
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Prevent bird from falling out of bounds (top or bottom)
    if (bird.y + bird.height >= canvas.height || bird.y <= 0) {
        triggerGameOver();
    }

    // Tree generation logic (every 90 frames)
    if (frame % 90 === 0) {
        let gap = 150;
        let topHeight = Math.floor(Math.random() * (canvas.height / 2));
        trees.push({
            x: canvas.width,
            top: topHeight,
            bottom: canvas.height - (topHeight + gap),
            width: 50
        });
    }

    // Move trees left
    trees.forEach(tree => tree.x -= 2);

    // Check for collisions
    trees.forEach(tree => {
        if (bird.x < tree.x + tree.width &&
            bird.x + bird.width > tree.x &&
            (bird.y < tree.top || bird.y + bird.height > canvas.height - tree.bottom)) {
            triggerGameOver();
        }
    });

    // Remove off-screen trees
    if (trees.length && trees[0].x < -trees[0].width) {
        trees.shift();
        score++;
    }

    frame++;
}

// Draw game elements (bird, trees, score)
function drawGame() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw bird
    ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    // Draw trees (top and bottom)
    trees.forEach(tree => {
        ctx.drawImage(treeImg, tree.x, 0, tree.width, tree.top);  // Top tree
        ctx.drawImage(treeImg, tree.x, canvas.height - tree.bottom, tree.width, tree.bottom);  // Bottom tree
    });

    // Draw score
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
}

// Draw game over screen
function drawGameOver() {
    ctx.fillStyle = 'red';
    ctx.font = '30px Arial';
    ctx.fillText('Game Over', canvas.width / 2 - 80, canvas.height / 2);
    ctx.fillText('Press any key to restart', canvas.width / 2 - 150, canvas.height / 2 + 40);
}

// Trigger game over
function triggerGameOver() {
    gameOver = true;
}

// Reset the game
function resetGame() {
    bird.y = 150;
    bird.velocity = 0;
    trees = [];
    score = 0;
    frame = 0;
    gameOver = false;
    gameLoop();
}

// Bird flap when key is pressed
document.addEventListener('keydown', () => {
    if (!gameOver) {
        bird.velocity = bird.lift;
    } else {
        resetGame();  // Reset the game if it's over
    }
});

// Start the game loop
gameLoop();
