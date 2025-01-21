class Board {
    constructor() {
        this.canvas = document.getElementById("game-board");
        this.context = this.canvas.getContext("2d");
        this.scoreDisplay = document.getElementById("score");
        this.score = 0;
        this.alienList = [];
        this.enemyBulletList = [];
        this.playerBulletList = [];
        this.loop = setInterval(this.update.bind(this), 32);
    }

    animate() {
        window.requestAnimationFrame(animate);
    }
 
    update() {
        this.clear();
        player.newPos();
        player.grounded();
        player.draw();
    }

    getRandomInt(n) {
        return Math.floor(Math.random() * n);
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    gameOver() {
        console.log("game over!");
        const lossMenu = document.getElementById("loss-menu");
        lossMenu.showModal();
        lossMenu.classList.remove("hidden");
        clearInterval(board.loop);
    }
}

class Component {
    constructor(url, x, y, width, height) {
        this.canvas = document.getElementById("game-board");
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.context = this.canvas.getContext("2d");
        this.image = new Image();
        this.image.src = url;
        this.image.onload = () => this.draw();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
   
    draw() {
        this.context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    crashWith(otherObj) {
        const myLeft = this.x;
        const myRight = this.x + this.width;
        const myTop = this.y;
        const myBottom = this.y + this.height;
        const otherLeft = otherObj.x;
        const otherRight = otherObj.x + otherObj.width;
        const otherTop = otherObj.y;
        const otherBottom = otherObj.y + otherObj.height;
        const crash = !(myBottom < otherTop || myTop > otherBottom || myRight < otherLeft || myLeft > otherRight);
        return crash;
    }
}

class Player extends Component {
    constructor(url, x, y, width, height) {
        super(url, x, y, width, height);
        this.jumpSpeed = 8;
        this.gravity = -1;
        this.respawnX = x;
        this.respawnY = y;
        this.maxJumps = 2;
        this.maxLives = 3;
        this.jumps = this.maxJumps;
        this.lives = this.maxLives;
        this.speedX = 0;
        this.speedY = 0;
    }

    newPos() {
        const belowScreen = this.y > this.canvas.height;
        if (belowScreen) {
            this.respawn();
            return;
        }

        this.x += this.speedX;
        this.y -= this.speedY;
        this.speedY += this.gravity;
    }

    moveLeft() {
        this.speedX = -5;
    }

    moveRight() {
        this.speedX = 5;
    }

    stopLeft() {
        if (this.speedX < 0) {
            this.speedX = 0;
        }
    }

    stopRight() {
        if (this.speedX > 0) {
            this.speedX = 0;
        }
    }

    jump() {
        if (this.jumps > 0) {
            this.speedY = this.jumpSpeed;
            this.jumps--;
        }
    }

    grounded() {
        const grounded = (this.y + 60 + this.height > this.canvas.height) && (this.x > 20 && this.x < this.canvas.width - 20 - this.width);
        if (grounded) {
            this.y = this.canvas.height - 60 - this.height;
            this.speedY = 0;
            this.jumps = this.maxJumps;
        }
    }

    respawn() {
        console.log("respawn!");
        this.lives--;
        if (this.lives < 0) {
            this.gameOver();
            return;
        }
        this.jumps = this.maxJumps;
        this.speedX = 0;
        this.speedY = 0;
        this.x = this.respawnX;
        this.y = this.respawnY;
    }

    gameOver() {
        console.log("game over!");
    }
}


let player = new Player("./images/logo.png", 200, 20, 200, 200);
let board = new Board();

document.addEventListener('keydown', (event) => {
    switch(event.key.toUpperCase()) {
        case "ARROWLEFT": player.moveLeft(); break;
        case "ARROWRIGHT": player.moveRight(); break;
        case "ARROWUP": player.jump(); break;

        case "A": player.moveLeft(); break;
        case "D": player.moveRight(); break;
        case "W": player.jump(); break;
    }
});

document.addEventListener('keyup', (event) => {
    switch(event.key.toUpperCase()) {
        case "ARROWLEFT": player.stopLeft(); break;
        case "ARROWRIGHT": player.stopRight(); break;

        case "A": player.stopLeft(); break;
        case "D": player.stopRight(); break;
    }
});
