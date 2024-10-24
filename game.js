const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Load bird image
let birdImg = new Image();
birdImg.src = './bird.png';  // Change this to your bird image filename

// Load tree image
let treeImg = new Image();
treeImg.src = './tree.png';  // Change this to your tree image filename

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

// Obstacle (tree) array
let trees = [];
let score = 0;
let frame = 0;
let gameOver = false;  // New variable to track if the game is over

// Game loop
function gameLoop() {
    if (!gameOver) {  // Only run the game loop if the game isn't over
        frame++;
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }
}

// Update bird and trees
function update() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Prevent bird from falling out of bounds
    if (bird.y + bird.height >= canvas.height || bird.y <= 0) {
        endGame();
    }

    // Tree logic (creating new trees every 90 frames)
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

    // Move trees
    trees.forEach(tree => tree.x -= 2);

    // Check for collisions
    trees.forEach(tree => {
        if (bird.x < tree.x + tree.width &&
            bird.x + bird.width > tree.x &&
            (bird.y < tree.top || bird.y + bird.height > canvas.height - tree.bottom)) {
            endGame();
        }
    });

    // Remove off-screen trees
    if (trees.length && trees[0].x < -trees[0].width) {
        trees.shift();
        score++;
    }
}

// Draw bird, trees, and score
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw bird
    ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    // Draw trees (top and bottom)
    trees.forEach(tree => {
        ctx.drawImage(treeImg, tree.x, 0, tree.width, tree.top); // Top part
        ctx.drawImage(treeImg, tree.x, canvas.height - tree.bottom, tree.width, tree.bottom); // Bottom part
    });

    // Draw score
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
}

// End the game
function endGame() {
    gameOver = true;  // Stop the game loop
    ctx.fillStyle = 'red';
    ctx.font = '30px Arial';
    ctx.fillText('Game Over!', canvas.width / 2 - 80, canvas.height / 2);
}

// Restart the game
function resetGame() {
    bird.y = 150;
    bird.velocity = 0;
    trees = [];
    score = 0;
    frame = 0;
    gameOver = false;  // Reset the gameOver flag
    gameLoop();  // Restart the game loop
}

// Bird flap when key is pressed
document.addEventListener('keydown', () => {
    if (!gameOver) {
        bird.velocity = bird.lift;  // Make the bird flap
    } else {
        resetGame();  // Restart the game if it's over
    }
});

// Start the game loop
gameLoop();
