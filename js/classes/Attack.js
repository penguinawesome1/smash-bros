class Attack extends Component {
    constructor({
        position,
        collisionBlocks,
        platformCollisionBlocks,
        direction = "right",
        imageSrc,
        scale = 1,
        player,
        otherPlayer,
        type = "bullet",
    }) {
        super({ position, imageSrc, scale });
        this.direction = direction;
        this.collisionBlocks = collisionBlocks;
        this.platformCollisionBlocks = platformCollisionBlocks;
        this.player = player;
        this.otherPlayer = otherPlayer;
        this.counter = 0;
        this.type = type;
        switch (this.type) {
            case "bullet": {
                this.position = {
                    x: position.x + this.scale * (0 + 40 * (this.direction === "right" ? 1 : 0)),
                    y: position.y + this.scale * 17,
                };
                this.velocity = {
                    x: direction === "right" ? 20 : -20,
                    y: 0,
                };
                this.hitbox = {
                    position: this.position,
                    width: 10,
                    height: 10,
                };
                break;
            }
            case "boomerang": {
                this.position = {
                    x: position.x + this.scale * (0 + 40 * (this.direction === "right" ? 1 : 0)),
                    y: position.y + this.scale * 17,
                };
                this.velocity = {
                    x: direction === "right" ? 8 : -8,
                    y: -1,
                };
                this.hitbox = {
                    position: this.position,
                    width: 10,
                    height: 10,
                };
                break;
            }
            case "homingdart": {
                this.position = {
                    x: position.x + this.scale * (0 + 40 * (this.direction === "right" ? 1 : 0)),
                    y: position.y + this.scale * 17,
                };
                this.velocity = {
                    x: direction === "right" ? 2 : -2,
                    y: 0,
                };
                this.hitbox = {
                    position: this.position,
                    width: 10,
                    height: 10,
                };
                break;
            }
        }
    }

    update() {
        this.updateFrames();
        this.updateHitbox();

        this.draw();

        // c.fillStyle = "red";
        // c.fillRect(this.hitbox.position.x, this.hitbox.position.y, this.hitbox.width, this.hitbox.height);

        if (this.type === "boomerang") {
            this.velocity.x += this.direction === "right" ? -.2 : .2;
            // this.applyFriction();
            // this.applyGravity();
        }

        this.counter++;
        if (this.counter % 10 === 0 && this.type === "homingdart") {
            this.homing();
        }

        this.reactToCollision();

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }

    homing() {
        const angle = calcAngle({
            object1: this.hitbox,
            object2: this.otherPlayer.hitbox,
        });
        const d = calcDistance({
            object1: this.hitbox,
            object2: this.otherPlayer.hitbox,
        });
        this.velocity.x += Math.cos(angle) * 100 / d;
        this.velocity.y += Math.sin(angle) * 100 / d;
    }

    reactToCollision() {
        if (this.otherPlayer.dashing) return;

        const playerCollision = this.checkForPlayerCollision();
        if (!playerCollision && !this.isCollision()) return;

        if (playerCollision && this.type !== "boomerang") {
            const i = player1.attackList.indexOf(this);
            if (i) this.player.attackList.splice(i, 1);
        }

        if (!playerCollision) return;

        const angle = calcAngle({
            object1: this.hitbox,
            object2: this.otherPlayer.hitbox,
        });
        this.otherPlayer.velocity.x += Math.cos(angle) * 500 / this.otherPlayer.healthBar.value;
        this.otherPlayer.velocity.y += Math.sin(angle) * 250 / this.otherPlayer.healthBar.value;

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