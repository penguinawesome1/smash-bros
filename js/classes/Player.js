class Player extends Sprite {
    constructor({
        position,
        collisionBlocks,
        platformCollisionBlocks,
        imageSrc,
        frameRate,
        scaleX = .2,
        scaleY = .45,
        animations
    }) {
        super({ position, imageSrc, frameRate, scaleX, scaleY });
        this.position = position;
        this.velocity = {
            x: 0,
            y: 1,
        }
        this.collisionBlocks = collisionBlocks;
        this.platformCollisionBlocks = platformCollisionBlocks;
        this.hitbox = {
            position: {
                x: this.position.x,
                y: this.position.y,
            },
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
            width: 20,
            height: 20,
        }

        this.prevIsAttacking = false;
    }

    switchSprite(key) {
        const sameImage = this.image === this.animations[key].image;
        if (sameImage || this.prevIsAttacking || !this.loaded) {
            this.prevIsAttacking = this.isAttacking;
            return;
        }

        this.currentFrame = 0;
        this.image = this.animations[key].image;
        this.frameBuffer = this.animations[key].frameBuffer;
        this.frameRate = this.animations[key].frameRate;

        this.prevIsAttacking = this.isAttacking;
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
        this.updateHitbox();
        this.checkForVerticalCollisions();
    }

    attack() {
        this.isAttacking = true;
        setTimeout(() => {
            this.isAttacking = false;
        }, 500000);
    }

    updateHitbox() {
        this.hitbox = {
            position: {
                x: this.position.x + 4,
                y: this.position.y,
            },
            width: 23,
            height: 50,
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