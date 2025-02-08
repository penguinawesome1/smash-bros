class Bullet extends Component {
    constructor({
        position,
        collisionBlocks,
        platformCollisionBlocks,
        imageSrc,
        frameRate,
        scale = 1,
        direction = "right",
        player,
        otherPlayer,
    }) {
        super({ position, imageSrc, frameRate, scale });
        this.direction = direction;
        this.position = {
            x: position.x + this.scale * (0 + 40 * (this.direction === "right" ? 1 : 0)),
            y: position.y + this.scale * 17,
        }
        this.velocity = {
            x: direction === "right" ? 20 : -20,
            y: 0,
        }
        this.collisionBlocks = collisionBlocks;
        this.platformCollisionBlocks = platformCollisionBlocks;
        this.hitbox = {
            position: this.position,
            width: 10,
            height: 10,
        }
        this.player = player;
        this.otherPlayer = otherPlayer;
    }

    update() {
        this.updateFrames();
        this.updateHitbox();

        this.draw();

        // c.fillStyle = "red";
        // c.fillRect(this.hitbox.position.x, this.hitbox.position.y, this.hitbox.width, this.hitbox.height);

        this.reactToCollision();

        this.position.x += this.velocity.x;
    }

    reactToCollision() {
        const playerCollision = this.checkForPlayerCollision();
        if (!playerCollision && !this.isCollision()) return;
        
        const i = player1.bulletList.indexOf(this);
        if (i) this.player.bulletList.splice(i, 1);

        if (!playerCollision) return;

        const angle = calcAngle({
            object1: this.hitbox,
            object2: this.otherPlayer.hitbox,
        });
        this.otherPlayer.velocity.x += Math.cos(angle) * 500 / this.otherPlayer.healthBar.value;
        this.otherPlayer.velocity.y += Math.cos(angle) * 250 / this.otherPlayer.healthBar.value;

        this.otherPlayer.healthBar.value -= 10;
    }

    updateHitbox() {
        this.hitbox = {
            position: {
                x: this.position.x + this.scale * (0 + 10 * (this.direction === "right" ? 1 : 0)),
                y: this.position.y + 0 * this.scale,
            },
            width: 16 * this.scale,
            height: 4 * this.scale,
        }
    }

    checkForPlayerCollision() {
        if (this.player === player1) {
            return collision({
                object1: this.hitbox,
                object2: player2.hitbox,
            });
        }

        return collision({
            object1: this.hitbox,
            object2: player1.hitbox,
        });
    }
}