class Player extends Sprite {
    constructor({
        position,
        collisionBlocks,
        platformCollisionBlocks,
        imageSrc,
        frameRate,
        scale = .5,
        animations
    }) {
        super({ position, imageSrc, frameRate, scale });
        this.position = position;
        this.velocity = {
            x: 0,
            y: 1,
        }
        this.collisionBlocks = collisionBlocks;
        this.platformCollisionBlocks = platformCollisionBlocks;
        this.hitbox = {
            position: this.position,
            width: 10,
            height: 10,
        }

        this.animations = animations;
        this.lastDirection = "right";

        for (let key in this.animations) {
            const image = new Image();
            image.src = this.animations[key].imageSrc;

            this.animations[key].image = image;
        }

        this.attackBox = {
            position: this.position,
            width: 0,
            height: 0,
        }
    }

    switchSprite(key) {
        const notLastFrame = this.currentFrame < this.animations.Attack1.frameRate - 1;
        const attackImage = this.image === this.animations.Attack1.image || this.image === this.animations.Attack1Left.image;
        if (attackImage && notLastFrame) return;

        const sameImage = this.image === this.animations[key].image;
        if (sameImage || !this.loaded) return;

        this.currentFrame = 0;
        this.image = this.animations[key].image;
        this.frameBuffer = this.animations[key].frameBuffer;
        this.frameRate = this.animations[key].frameRate;
    }

    update() {
        this.updateFrames();
        this.updateHitbox();

        // draws out image
        c.fillStyle = "rgba(0, 255, 0, 0.2)";
        c.fillRect(this.position.x, this.position.y, this.width, this.height);

        // draws out hitbox
        c.fillStyle = "rgba(255, 0, 0, 0.2)";
        c.fillRect(this.hitbox.position.x, this.hitbox.position.y, this.hitbox.width, this.hitbox.height);

        // draws out attack
        if (this.isAttacking) {
            c.fillStyle = "rgba(0, 0, 255, 0.2)";
            c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);
        }
        
        this.draw();

        this.position.x += this.velocity.x;
        this.updateHitbox();
        this.checkForHorizontalCollisions();
        this.applyGravity();
        // this.applyFriction();
        this.updateHitbox();
        this.checkForVerticalCollisions();
    }

    attack() {
        if (this.cooldown) return;
        
        if (this.lastDirection === "right") {
            this.switchSprite("Attack1");
        } else {
            this.switchSprite("Attack1Left");
        }

        this.isAttacking = true;
        this.cooldown = true;
        setTimeout(() => {
            this.isAttacking = false;
        }, 150);
        setTimeout(() => {
            this.cooldown = false;
        }, 500);
    }

    updateHitbox() {
        this.hitbox = {
            position: {
                x: this.position.x + 22,
                y: this.position.y,
            },
            width: 35,
            height: 55,
        }

        this.attackBox = {
            position: {
                x: this.position.x + 37 + 23 * (this.lastDirection === "right" ? 1 : -1),
                y: this.position.y + 13,
            },
            width: 5,
            height: 7,
        }
    }

    checkForHorizontalCollisions() {
        for (let i = 0; i < this.collisionBlocks.length; i++) {
            const collisionBlock = this.collisionBlocks[i];

            if (collision({
                object1: this.hitbox,
                object2: collisionBlock,
            })) {
                if (this.velocity.x > 0) {
                    this.velocity.x = 0;

                    const offset = this.hitbox.position.x - this.position.x + this.hitbox.width;

                    this.position.x = collisionBlock.position.x - offset - 0.01;
                    break;
                }
                if (this.velocity.x < 0) {
                    this.velocity.x = 0;

                    const offset = this.hitbox.position.x - this.position.x;
                    
                    this.position.x = collisionBlock.position.x + collisionBlock.width - offset + 0.01;
                    break;
                }
            }
        }
    }

    applyGravity() {
        this.velocity.y += gravity;
        this.position.y += this.velocity.y;
    }

    applyFriction() {
        this.velocity.x += friction;
        this.position.x += this.velocity.x;
    }

    checkForVerticalCollisions() {
        for (let i = 0; i < this.collisionBlocks.length; i++) {
            const collisionBlock = this.collisionBlocks[i];

            if (collision({
                object1: this.hitbox,
                object2: collisionBlock,
            })) {
                if (this.velocity.y > 0) {
                    this.velocity.y = 0;

                    const offset = this.hitbox.position.y - this.position.y + this.hitbox.height;

                    this.position.y = collisionBlock.position.y - offset - 0.01;
                    break;
                }
                if (this.velocity.y < 0) {
                    this.velocity.y = 0;
                    
                    const offset = this.hitbox.position.y - this.position.y;

                    this.position.y = collisionBlock.position.y + collisionBlock.height - offset + 0.01;
                    break;
                }
            }
        }

        // platform collision blocks
        for (let i = 0; i < this.platformCollisionBlocks.length; i++) {
            const platformCollisionBlock = this.platformCollisionBlocks[i];

            if (platformCollision({
                object1: this.hitbox,
                object2: platformCollisionBlock,
            })) {
                if (this.velocity.y > 0) {
                    this.velocity.y = 0;

                    const offset = this.hitbox.position.y - this.position.y + this.hitbox.height;

                    this.position.y = platformCollisionBlock.position.y - offset - 0.01;
                    break;
                }
            }
        }
    }
}