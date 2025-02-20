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

const passedMap = getParameterByName("map");
const passedPlayer1 = getParameterByName("player1");
const passedPlayer2 = getParameterByName("player2");
if (passedMap) localStorage.setItem("MAP", passedMap);
if (passedPlayer1) localStorage.setItem("PLAYER1", passedPlayer1);
if (passedPlayer2) localStorage.setItem("PLAYER2", passedPlayer2);

const selectedMap = localStorage.getItem("MAP") ? localStorage.getItem("MAP") : "farm";
const selectedPlayer1 = localStorage.getItem("PLAYER1") ? localStorage.getItem("PLAYER1") : "country-boy";
const selectedPlayer2 = localStorage.getItem("PLAYER2") ? localStorage.getItem("PLAYER2") : "country-boy";

const canvas = document.getElementById("game-board");
const c = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const health1 = document.getElementById("health1");
const health2 = document.getElementById("health2");
const lives1 = document.getElementById("lives1");
const lives2 = document.getElementById("lives2");
const maxJumps = 2;
const maxDashes = 2;
const maxLives = 3;
const gravity = 0.3;
const frictionMultiplier = 0.9;
const playerSpeed = 0.3;
const dashStrength = 15;
const smashStrength = 10;
const jumpStrength = 6;
const hitStopDuration = 100;
const player1Respawn = {
    x: 100,
    y: 300,
};
const player2Respawn = {
    x: 350,
    y: 300,
};

const scales = {
    "farm": .4,
    "gas-station": .5,
}
const scale = scales[selectedMap];

const scaledCanvas = {
    scale: 2.7,
    width: canvas.width / this.scale,
    height: canvas.height / this.scale,
    transX: 0,
    transY: -150,
    width: canvas.width / this.scale,
    height: canvas.height / this.scale,
}

const background = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imageSrc: `./img/backgrounds/${selectedMap}.png`,
});

const floorCollisions = floorHolder[selectedMap];
const floorCollisions2D = [];
for (let i = 0; i < floorCollisions.length; i += 64) {
    floorCollisions2D.push(floorCollisions.slice(i, i + 32));
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

const platformCollisions = platformHolder[selectedMap];
const platformCollisions2D = [];
for (let i = 0; i < platformCollisions.length; i += 32) {
    platformCollisions2D.push(platformCollisions.slice(i, i + 32));
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
                    height: 8,
                })
            );
        }
    });
});

const player1 = new Player({
    position: { ...player1Respawn },
    scale,
    collisionBlocks,
    platformCollisionBlocks,
    imageSrc: `./img/players/temp/Idle.png`,
    frameRate: 8,
    animations: {
        Idle: {
            imageSrc: `./img/players/${selectedPlayer1}/Idle.png`,
            frameRate: 1,
            frameBuffer: 0,
        },
        IdleLeft: {
            imageSrc: `./img/players/${selectedPlayer1}/IdleLeft.png`,
            frameRate: 1,
            frameBuffer: 0,
        },
        Run: {
            imageSrc: `./img/players/${selectedPlayer1}/Run.png`,
            frameRate: 5,
            frameBuffer: 6,
        },
        RunLeft: {
            imageSrc: `./img/players/${selectedPlayer1}/RunLeft.png`,
            frameRate: 5,
            frameBuffer: 6,
        },
        Jump: {
            imageSrc: `./img/players/${selectedPlayer1}/Jump.png`,
            frameRate: 2,
            frameBuffer: 12,
        },
        JumpLeft: {
            imageSrc: `./img/players/${selectedPlayer1}/JumpLeft.png`,
            frameRate: 2,
            frameBuffer: 12,
        },
        Fall: {
            imageSrc: `./img/players/${selectedPlayer1}/Fall.png`,
            frameRate: 1,
            frameBuffer: 8,
        },
        FallLeft: {
            imageSrc: `./img/players/${selectedPlayer1}/FallLeft.png`,
            frameRate: 1,
            frameBuffer: 8,
        },
        Attack1: {
            imageSrc: `./img/players/${selectedPlayer1}/Attack1.png`,
            frameRate: 8,
            frameBuffer: 3,
        },
        Attack1Left: {
            imageSrc: `./img/players/${selectedPlayer1}/Attack1Left.png`,
            frameRate: 8,
            frameBuffer: 3,
        },
        Attack2: {
            imageSrc: `./img/players/${selectedPlayer1}/Attack2.png`,
            frameRate: 9,
            frameBuffer: 2,
        },
        Attack2Left: {
            imageSrc: `./img/players/${selectedPlayer1}/Attack2Left.png`,
            frameRate: 9,
            frameBuffer: 2,
        },
        Dash: {
            imageSrc: `./img/players/${selectedPlayer1}/Dash.png`,
            frameRate: 1,
            frameBuffer: 0,
        },
        DashLeft: {
            imageSrc: `./img/players/${selectedPlayer1}/DashLeft.png`,
            frameRate: 1,
            frameBuffer: 0,
        },
        Hurt: {
            imageSrc: `./img/players/${selectedPlayer1}/Hurt.png`,
            frameRate: 1,
            frameBuffer: 0,
        },
        HurtLeft: {
            imageSrc: `./img/players/${selectedPlayer1}/HurtLeft.png`,
            frameRate: 1,
            frameBuffer: 0,
        },
    }
});

const player2 = new Player({
    position: { ...player2Respawn },
    collisionBlocks,
    platformCollisionBlocks,
    scale,
    imageSrc: `./img/players/temp/Idle.png`,
    frameRate: 8,
    animations: {
        Idle: {
            imageSrc: `./img/players/${selectedPlayer2}/Idle.png`,
            frameRate: 1,
            frameBuffer: 0,
        },
        IdleLeft: {
            imageSrc: `./img/players/${selectedPlayer2}/IdleLeft.png`,
            frameRate: 1,
            frameBuffer: 0,
        },
        Run: {
            imageSrc: `./img/players/${selectedPlayer2}/Run.png`,
            frameRate: 5,
            frameBuffer: 6,
        },
        RunLeft: {
            imageSrc: `./img/players/${selectedPlayer2}/RunLeft.png`,
            frameRate: 5,
            frameBuffer: 6,
        },
        Jump: {
            imageSrc: `./img/players/${selectedPlayer2}/Jump.png`,
            frameRate: 2,
            frameBuffer: 12,
        },
        JumpLeft: {
            imageSrc: `./img/players/${selectedPlayer2}/JumpLeft.png`,
            frameRate: 2,
            frameBuffer: 12,
        },
        Fall: {
            imageSrc: `./img/players/${selectedPlayer2}/Fall.png`,
            frameRate: 1,
            frameBuffer: 8,
        },
        FallLeft: {
            imageSrc: `./img/players/${selectedPlayer2}/FallLeft.png`,
            frameRate: 1,
            frameBuffer: 0,
        },
        Attack1: {
            imageSrc: `./img/players/${selectedPlayer2}/Attack1.png`,
            frameRate: 8,
            frameBuffer: 3,
        },
        Attack1Left: {
            imageSrc: `./img/players/${selectedPlayer2}/Attack1Left.png`,
            frameRate: 8,
            frameBuffer: 3,
        },
        Attack2: {
            imageSrc: `./img/players/${selectedPlayer2}/Attack2.png`,
            frameRate: 9,
            frameBuffer: 2,
        },
        Attack2Left: {
            imageSrc: `./img/players/${selectedPlayer2}/Attack2Left.png`,
            frameRate: 9,
            frameBuffer: 2,
        },
        Dash: {
            imageSrc: `./img/players/${selectedPlayer2}/Dash.png`,
            frameRate: 1,
            frameBuffer: 0,
        },
        DashLeft: {
            imageSrc: `./img/players/${selectedPlayer2}/DashLeft.png`,
            frameRate: 1,
            frameBuffer: 0,
        },
        Hurt: {
            imageSrc: `./img/players/${selectedPlayer1}/Hurt.png`,
            frameRate: 1,
            frameBuffer: 0,
        },
        HurtLeft: {
            imageSrc: `./img/players/${selectedPlayer1}/HurtLeft.png`,
            frameRate: 1,
            frameBuffer: 0,
        },
    }
});

player1.otherPlayer = player2;
player2.otherPlayer = player1;
player1.healthBar = health1;
player2.healthBar = health2;
player1.livesBar = lives1;
player2.livesBar = lives2;
player2.lastDirection = "left";

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

    if (player1.dev) {
        player1.hack();
        player1.lives = maxLives;
        player2.lives = maxLives;
    }

    c.restore();
}

animate();

window.addEventListener("keydown", (event) => {
    switch (event.key.toUpperCase()) {
        case "D": player1.keys.right = true; break;
        case "A": player1.keys.left = true; break;
        case "S": player1.keys.down = true; player1.smash(); break;
        case "W": player1.keys.up = true; player1.jump(); break;
        case "F": player1.attack1(); break;
        case "G": player1.attack2(); break;
        case "H": player1.dash(); break;
        case "J": player1.grab(); break;

        case "ARROWRIGHT": player2.keys.right = true; break;
        case "ARROWLEFT": player2.keys.left = true; break;
        case "ARROWDOWN": player2.keys.down = true; player2.smash(); break;
        case "ARROWUP": player2.keys.up = true; player2.jump(); break;
        case "/": player2.attack1(); break;
        case ".": player2.attack2(); break;
        case ",": player2.dash(); break;
        case "M": player2.grab(); break;
        case "1": player1.hack(); break;
        case "2": player1.dev = !player1.dev; break;
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