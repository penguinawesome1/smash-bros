const canvas = document.getElementById("game-board");
const c = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const scaledCanvas = {
    transX: 0,
    transY: -160,
    scaleX: 3,
    scaleY: 3,
    width: canvas.width / this.scaleX,
    height: canvas.height / this.scaleY,
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

const gravity = 0.3;

const player1Type = "player1";
const player2Type = "player2";

const player1 = new Player({
    position: {
        x: 100,
        y: 300,
    },
    collisionBlocks,
    platformCollisionBlocks,
    imageSrc: `./img/${player1Type}/Idle.png`,
    frameRate: 8,
    animations: {
        Idle: {
            imageSrc: `./img/${player1Type}/Idle.png`,
            frameRate: 8,
            frameBuffer: 8,
        },
        IdleLeft: {
            imageSrc: `./img/${player1Type}/IdleLeft.png`,
            frameRate: 8,
            frameBuffer: 8,
        },
        Run: {
            imageSrc: `./img/${player1Type}/Run.png`,
            frameRate: 8,
            frameBuffer: 14,
        },
        RunLeft: {
            imageSrc: `./img/${player1Type}/RunLeft.png`,
            frameRate: 8,
            frameBuffer: 14,
        },
        Jump: {
            imageSrc: `./img/${player1Type}/Jump.png`,
            frameRate: 2,
            frameBuffer: 8,
        },
        JumpLeft: {
            imageSrc: `./img/${player1Type}/JumpLeft.png`,
            frameRate: 2,
            frameBuffer: 8,
        },
        Fall: {
            imageSrc: `./img/${player1Type}/Fall.png`,
            frameRate: 2,
            frameBuffer: 8,
        },
        FallLeft: {
            imageSrc: `./img/${player1Type}/FallLeft.png`,
            frameRate: 2,
            frameBuffer: 8,
        },
    }
});

const player2 = new Player({
    position: {
        x: 200,
        y: 300,
    },
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
            frameBuffer: 14,
        },
        RunLeft: {
            imageSrc: `./img/${player2Type}/RunLeft.png`,
            frameRate: 5,
            frameBuffer: 14,
        },
        Jump: {
            imageSrc: `./img/${player1Type}/Jump.png`,
            frameRate: 2,
            frameBuffer: 8,
        },
        JumpLeft: {
            imageSrc: `./img/${player1Type}/JumpLeft.png`,
            frameRate: 2,
            frameBuffer: 8,
        },
        Fall: {
            imageSrc: `./img/${player1Type}/Fall.png`,
            frameRate: 2,
            frameBuffer: 8,
        },
        FallLeft: {
            imageSrc: `./img/${player1Type}/FallLeft.png`,
            frameRate: 2,
            frameBuffer: 8,
        },
    }
});

const keys = {
    d: {
        pressed: false,
    },
    a: {
        pressed: false,
    },
    left: {
        pressed: false,
    },
    right: {
        pressed: false,
    },
}

const background = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imageSrc: "./img/backgrounds/farm.png",
})

function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = "white";
    c.fillRect(0, 0, canvas.width, canvas.height);

    c.save();
    c.scale(scaledCanvas.scaleX, scaledCanvas.scaleY);
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

    player1.velocity.x = 0;
    if (keys.d.pressed && !keys.a.pressed) {
        player1.switchSprite("Run");
        player1.velocity.x = 1.5;
        player1.lastDirection = "right";
    } else if (keys.a.pressed && !keys.d.pressed) {
        player1.switchSprite("RunLeft");
        player1.velocity.x = -1.5;
        player1.lastDirection = "left";
    } else if (player1.velocity.y === 0) {
        if (player1.lastDirection === "right") {
            player1.switchSprite("Idle");
        } else {
            player1.switchSprite("IdleLeft");
        }
    }

    if (player1.velocity.y < 0) {
        if (player1.lastDirection === "right") {
            player1.switchSprite("Jump");
        } else {
            player1.switchSprite("JumpLeft");
        }
    } else if (player1.velocity.y > 0) {
        if (player1.lastDirection === "right") {
            player1.switchSprite("Fall");
        } else {
            player1.switchSprite("FallLeft");
        }
    }

    player2.velocity.x = 0;
    if (keys.right.pressed && !keys.left.pressed) {
        player2.switchSprite("Run");
        player2.velocity.x = 1.5;
        player2.lastDirection = "right";
    } else if (keys.left.pressed && !keys.right.pressed) {
        player2.switchSprite("RunLeft");
        player2.velocity.x = -1.5;
        player2.lastDirection = "left";
    } else if (player2.velocity.y === 0) {
        if (player2.lastDirection === "right") {
            player2.switchSprite("Idle");
        } else {
            player2.switchSprite("IdleLeft");
        }
    }

    if (player2.velocity.y < 0) {
        if (player2.lastDirection === "right") {
            player2.switchSprite("Jump");
        } else {
            player2.switchSprite("JumpLeft");
        }
    } else if (player2.velocity.y > 0) {
        if (player2.lastDirection === "right") {
            player2.switchSprite("Fall");
        } else {
            player2.switchSprite("FallLeft");
        }
    }

    c.restore();
}

animate();

window.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "d": keys.d.pressed = true; break;
        case "a": keys.a.pressed = true; break;
        case "w": player1.velocity.y = -4; break;

        case "ArrowRight": keys.right.pressed = true; break;
        case "ArrowLeft": keys.left.pressed = true; break;
        case "ArrowUp": player2.velocity.y = -4; break;
    }
});

window.addEventListener("keyup", (event) => {
    switch (event.key) {
        case "d": keys.d.pressed = false; break;
        case "a": keys.a.pressed = false; break;

        case "ArrowRight": keys.right.pressed = false; break;
        case "ArrowLeft": keys.left.pressed = false; break;
    }
});