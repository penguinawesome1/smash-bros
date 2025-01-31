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
const gravity = 0.2;
const frictionMultiplier = 0.8;
const playerSpeed = 0.6;
const dashStrength = 15;
const jumpStrength = -6;
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
    }
});

player1.otherPlayer = player2;
player2.otherPlayer = player1;
player2.lastDirection = "left";

const keys = {
    d: {
        pressed: false,
    },
    a: {
        pressed: false,
    },
    s: {
        pressed: false,
    },
    left: {
        pressed: false,
    },
    right: {
        pressed: false,
    },
    down: {
        pressed: false,
    },
};

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
    
    if (player1.isAttacking) {
        const hitPlayer2 = collision({
            object1: player1.attackBox,
            object2: player2.hitbox,
        });
        if (hitPlayer2) {
            const angle = calcAngle({
                object1: player1.attackBox,
                object2: player2.hitbox,
            });
            player2.velocity.x += Math.cos(angle) * 2000 / health2.value;
            player2.velocity.y += Math.sin(angle) * 700 / health2.value;

            health2.value -= 10;
            player1.isAttacking = false;
        }
    }
    if (player2.isAttacking) {
        const hitPlayer1 = collision({
            object1: player2.attackBox,
            object2: player1.hitbox,
        });
    
        if (hitPlayer1) {
            const angle = calcAngle({
                object1: player2.attackBox,
                object2: player1.hitbox,
            });
            player1.velocity.x += Math.cos(angle) * 2000 / health1.value;
            player1.velocity.y += Math.sin(angle) * 700 / health1.value;

            health1.value -= 10;
            player2.isAttacking = false;
        }
    }
    
    if (keys.d.pressed && !keys.a.pressed) {
        player1Sprite = "Run";
        player1.velocity.x += playerSpeed;
        player1.lastDirection = "right";
    } else if (keys.a.pressed && !keys.d.pressed) {
        player1Sprite = "RunLeft";
        player1.velocity.x += -playerSpeed;
        player1.lastDirection = "left";
    } else if (player1.velocity.y === 0) {
        if (player1.lastDirection === "right") {
            player1Sprite = "Idle";
        } else {
            player1Sprite = "IdleLeft";
        }
    }

    if (player1.velocity.y < 0) {
        if (player1.lastDirection === "right") {
            player1Sprite = "Jump";
        } else {
            player1Sprite = "JumpLeft";
        }
    } else if (player1.velocity.y > 0) {
        if (player1.lastDirection === "right") {
            player1Sprite = "Fall";
        } else {
            player1Sprite = "FallLeft";
        }
    }
    
    if (keys.right.pressed && !keys.left.pressed) {
        player2Sprite = "Run";
        player2.velocity.x += playerSpeed;
        if (!player2.isAttacking) player2.lastDirection = "right";
    } else if (keys.left.pressed && !keys.right.pressed) {
        player2Sprite = "RunLeft";
        player2.velocity.x += -playerSpeed;
        if (!player2.isAttacking) player2.lastDirection = "left";
    } else if (player2.velocity.y === 0) {
        if (player2.lastDirection === "right") {
            player2Sprite = "Idle";
        } else {
            player2Sprite = "IdleLeft";
        }
    }

    if (player2.velocity.y < 0) {
        if (player2.lastDirection === "right") {
            player2Sprite = "Jump";
        } else {
            player2Sprite = "JumpLeft";
        }
    } else if (player2.velocity.y > 0) {
        if (player2.lastDirection === "right") {
            player2Sprite = "Fall";
        } else {
            player2Sprite = "FallLeft";
        }
    }

    player1.switchSprite(player1Sprite);
    player2.switchSprite(player2Sprite);

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
        case "D": keys.d.pressed = true; break;
        case "A": keys.a.pressed = true; break;
        case "S": keys.s.pressed = true; break;
        case "W": player1.jump(); break;
        case "E": player1.attack(); break;
        case "SHIFT": player1.dash(); break;

        case "ARROWRIGHT": keys.right.pressed = true; break;
        case "ARROWLEFT": keys.left.pressed = true; break;
        case "ARROWDOWN": keys.down.pressed = true; break;
        case "ARROWUP": player2.jump(); break;
        case "/": player2.attack(); break;
        case ".": player2.dash(); break;
    }
});

window.addEventListener("keyup", (event) => {
    switch (event.key.toUpperCase()) {
        case "D": keys.d.pressed = false; break;
        case "A": keys.a.pressed = false; break;
        case "S": keys.s.pressed = false; break;

        case "ARROWRIGHT": keys.right.pressed = false; break;
        case "ARROWLEFT": keys.left.pressed = false; break;
        case "ARROWDOWN": keys.down.pressed = false; break;
    }
});