// Function to get query parameters from the URL
function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    var results = regex.exec(url);
    if (!results) return null; // Handle the case where the parameter is not found at all
  
    //Check if there is a value after the =
    if (!results[2]) return ""; //if the param exists but has no value, return empty string
  
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
const selectedMap = getParameterByName("map") !== null ? getParameterByName("map") : "farm";

const canvas = document.getElementById("game-board");
const c = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const health1 = document.getElementById("health1");
const health2 = document.getElementById("health2");
const maxJumps = 2;
const maxDashes = 2;
const maxLives = 3;
const gravity = 0.3;
const frictionMultiplier = 0.9;
const playerSpeed = 0.3;
const dashStrength = 15;
const dashCooldown = 1000;
const smashStrength = 10;
const jumpStrength = 6;
const player1Type = "player1";
const player2Type = "player2";
const player1Respawn = {
    x: 200,
    y: 300,
};
const player2Respawn = {
    x: 400,
    y: 300,
};

const scaledCanvas = {
    scale: 3,
    width: canvas.width / this.scale,
    height: canvas.height / this.scale,
    transX: 0,
    transY: -175,
    width: canvas.width / this.scale,
    height: canvas.height / this.scale,
}

const floorCollisions2D = [];
for (let i = 0; i < floorCollisions.length; i += 36) {
    floorCollisions2D.push(floorCollisions.slice(i, i + 36));
}

const collisionBlocks = [];
floorCollisions2D.forEach((row, y) => {
    row.forEach((symbol, x) => {
        if(symbol === 202) {
            collisionBlocks.push(new CollisionBlock({
                position: {
                    x: x * 16,
                    y: y * 16,
                },
            }));
        }
    });
});

const platformCollisions2D = [];
for (let i = 0; i < platformCollisions.length; i += 36) {
    platformCollisions2D.push(platformCollisions.slice(i, i + 36));
}

const platformCollisionBlocks = [];
platformCollisions2D.forEach((row, y) => {
    row.forEach((symbol, x) => {
        if(symbol === 202) {
            platformCollisionBlocks.push(
                new CollisionBlock({
                    position: {
                        x: x * 16,
                        y: y * 16,
                    },
                    height: 4,
                })
            );
        }
    });
});

const player1 = new Player({
    position: { ...player1Respawn },
    // scale: 0.2,
    collisionBlocks,
    platformCollisionBlocks,
    imageSrc: `./img/${player1Type}/Idle.png`,
    frameRate: 8,
    animations: {
        Idle: {
            imageSrc: `./img/${player2Type}/Idle.png`,
            frameRate: 1,
            frameBuffer: 0,
        },
        IdleLeft: {
            imageSrc: `./img/${player2Type}/IdleLeft.png`,
            frameRate: 1,
            frameBuffer: 0,
        },
        Run: {
            imageSrc: `./img/${player2Type}/Run.png`,
            frameRate: 5,
            frameBuffer: 6,
        },
        RunLeft: {
            imageSrc: `./img/${player2Type}/RunLeft.png`,
            frameRate: 5,
            frameBuffer: 6,
        },
        Jump: {
            imageSrc: `./img/${player2Type}/Jump.png`,
            frameRate: 2,
            frameBuffer: 12,
        },
        JumpLeft: {
            imageSrc: `./img/${player2Type}/JumpLeft.png`,
            frameRate: 2,
            frameBuffer: 12,
        },
        Fall: {
            imageSrc: `./img/${player2Type}/Fall.png`,
            frameRate: 1,
            frameBuffer: 8,
        },
        FallLeft: {
            imageSrc: `./img/${player2Type}/FallLeft.png`,
            frameRate: 1,
            frameBuffer: 8,
        },
        Attack1: {
            imageSrc: `./img/${player2Type}/Attack1.png`,
            frameRate: 8,
            frameBuffer: 3,
        },
        Attack1Left: {
            imageSrc: `./img/${player2Type}/Attack1Left.png`,
            frameRate: 8,
            frameBuffer: 3,
        },
        Attack2: {
            imageSrc: `./img/${player2Type}/Attack2.png`,
            frameRate: 9,
            frameBuffer: 3,
        },
        Attack2Left: {
            imageSrc: `./img/${player2Type}/Attack2Left.png`,
            frameRate: 9,
            frameBuffer: 3,
        },
    }
});

const player2 = new Player({
    position: { ...player2Respawn },
    collisionBlocks,
    platformCollisionBlocks,
    imageSrc: `./img/${player1Type}/Idle.png`,
    frameRate: 8,
    animations: {
        Idle: {
            imageSrc: `./img/${player2Type}/Idle.png`,
            frameRate: 1,
            frameBuffer: 0,
        },
        IdleLeft: {
            imageSrc: `./img/${player2Type}/IdleLeft.png`,
            frameRate: 1,
            frameBuffer: 0,
        },
        Run: {
            imageSrc: `./img/${player2Type}/Run.png`,
            frameRate: 5,
            frameBuffer: 6,
        },
        RunLeft: {
            imageSrc: `./img/${player2Type}/RunLeft.png`,
            frameRate: 5,
            frameBuffer: 6,
        },
        Jump: {
            imageSrc: `./img/${player2Type}/Jump.png`,
            frameRate: 2,
            frameBuffer: 12,
        },
        JumpLeft: {
            imageSrc: `./img/${player2Type}/JumpLeft.png`,
            frameRate: 2,
            frameBuffer: 12,
        },
        Fall: {
            imageSrc: `./img/${player2Type}/Fall.png`,
            frameRate: 1,
            frameBuffer: 8,
        },
        FallLeft: {
            imageSrc: `./img/${player2Type}/FallLeft.png`,
            frameRate: 1,
            frameBuffer: 8,
        },
        Attack1: {
            imageSrc: `./img/${player2Type}/Attack1.png`,
            frameRate: 8,
            frameBuffer: 3,
        },
        Attack1Left: {
            imageSrc: `./img/${player2Type}/Attack1Left.png`,
            frameRate: 8,
            frameBuffer: 3,
        },
        Attack2: {
            imageSrc: `./img/${player2Type}/Attack2.png`,
            frameRate: 9,
            frameBuffer: 6,
        },
        Attack2Left: {
            imageSrc: `./img/${player2Type}/Attack2Left.png`,
            frameRate: 9,
            frameBuffer: 6,
        },
    }
});

player1.otherPlayer = player2;
player2.otherPlayer = player1;
player1.healthBar = health1;
player2.healthBar = health2;
player2.lastDirection = "left";

const background = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imageSrc: `./img/backgrounds/${selectedMap}.png`,
});

function animate() {
    window.requestAnimationFrame(animate);

    c.save();
    c.scale(scaledCanvas.scale, scaledCanvas.scale);
    c.translate(scaledCanvas.transX, scaledCanvas.transY);

    background.update();

    collisionBlocks.forEach((collisionBlock) => {
        collisionBlock.update();
    });
    platformCollisionBlocks.forEach((block) => {
        block.update();
    });

    player1.update();
    player2.update();

    c.restore();
}

function gameOver(winner) {
    document.getElementById("game-over-popup").classList.remove("hidden");
    document.getElementById("winner").innerText = winner;
    setTimeout(() => {
        location.reload();
    }, 3000);
}

animate();

window.addEventListener("keydown", (event) => {
    switch (event.key.toUpperCase()) {
        case "D": player1.keys.right = true; break;
        case "A": player1.keys.left = true; break;
        case "S": player1.keys.down = true; player1.smash(); break;
        case "W": player1.keys.up = true; player1.jump(); break;
        case "F": player1.attack1(); break;
        case "R": player1.attack2(); break;
        case "G": player1.dash(); break;

        case "ARROWRIGHT": player2.keys.right = true; break;
        case "ARROWLEFT": player2.keys.left = true; break;
        case "ARROWDOWN": player2.keys.down = true; player2.smash(); break;
        case "ARROWUP": player2.keys.up = true; player2.jump(); break;
        case "/": player2.attack1(); break;
        case "L": player2.attack2(); break;
        case ".": player2.dash(); break;
    }
});

window.addEventListener("keyup", (event) => {
    switch (event.key.toUpperCase()) {
        case "D": player1.keys.right = false; break;
        case "A": player1.keys.left = false; break;
        case "S": player1.keys.down = false; break;
        case "W": player1.keys.up = false; break;

        case "ARROWRIGHT": player2.keys.right = false; break;
        case "ARROWLEFT": player2.keys.left = false; break;
        case "ARROWDOWN": player2.keys.down = false; break;
        case "ARROWUP": player2.keys.up = false; break;
    }
});