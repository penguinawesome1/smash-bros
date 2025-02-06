class Bullet extends Sprite {
    constructor({
        position,
        collisionBlocks,
        platformCollisionBlocks,
        imageSrc,
        frameRate,
        scale = 1,
        direction = "right",
    }) {
        super({ position, imageSrc, frameRate, scale });
        this.position = position;
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
    }

    update() {
        this.updateFrames();
        this.updateHitbox();

        this.draw();

        this.checkForHorizontalCollisions();

        this.position.x += this.velocity.x;
    }

    updateHitbox() {
        this.hitbox = {
            position: {
                x: this.position.x + 44 * this.scale,
                y: this.position.y,
            },
            width: 20 * this.scale,
            height: 20 * this.scale,
        }
    }

    checkForHorizontalCollisions() {
        for (let i = 0; i < this.collisionBlocks.length; i++) {
            const collisionBlock = this.collisionBlocks[i];

            if (collision({
                object1: this.hitbox,
                object2: collisionBlock,
            })) {
                const i1 = player1.bulletList.indexOf(this);
                const i2 = player2.bulletList.indexOf(this);
                if (i1) player1.bulletList.splice(i1, 1);
                else if (i2) player2.bulletList.splice(i2, 1);
            }
        }
    }
}