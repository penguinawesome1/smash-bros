class Player extends Sprite {
    constructor({
        position,
        collisionBlocks,
        platformCollisionBlocks,
        imageSrc,
        frameRate,
        scale = .4,
        animations
    }) {
        super({ position, imageSrc, frameRate, scale });
        this.position = position;
        this.velocity = {
            x: 0,
            y: 0,
        }
        this.collisionBlocks = collisionBlocks;
        this.platformCollisionBlocks = platformCollisionBlocks;
        this.hitbox = {
            position: this.position,
            width: 10,
            height: 10,
        }

        this.otherPlayer = null;
        this.healthBar = null;
        this.lives = maxLives;
        this.jumps = maxJumps;
        this.dashes = maxDashes;
        this.lastDirection = "right";
        this.animations = animations;

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

        this.keys = {
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
    }

    switchSprite(key) {
        const notLastFrame = this.currentFrame < this.animations.Attack1.frameRate - 1;
        const attackImage = this.image === this.animations.Attack1.image || this.image === this.animations.Attack1Left.image;
        const sameImage = this.image === this.animations[key].image;
        if (sameImage || !this.loaded || (attackImage && notLastFrame)) return;

        this.currentFrame = 0;
        this.image = this.animations[key].image;
        this.frameBuffer = this.animations[key].frameBuffer;
        this.frameRate = this.animations[key].frameRate;
    }

    update() {
        this.updateFrames();
        this.updateHitbox();

        // draws out image
        // c.fillStyle = "rgba(0, 255, 0, 0.2)";
        // c.fillRect(this.position.x, this.position.y, this.width, this.height);

        // // draws out hitbox
        // c.fillStyle = "rgba(255, 0, 0, 0.2)";
        // c.fillRect(this.hitbox.position.x, this.hitbox.position.y, this.hitbox.width, this.hitbox.height);

        // // draws out attack
        // if (this.isAttacking) {
        //     c.fillStyle = "rgba(0, 0, 255, 0.2)";
        //     c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);
        // }
        
        this.draw();

        this.checkForKeys();
        
        this.applyFriction();
        this.updateHitbox();
        this.checkForHorizontalCollisions();
        this.checkForPlayerCollisions();
        
        this.applyGravity();
        this.updateHitbox();
        this.checkForVerticalCollisions();

        this.checkForHit();
        this.checkForDeath();
    }

    attack() {
        if (this.cooldownAttack) return;
        
        if (this.lastDirection === "right") {
            this.switchSprite("Attack1");
        } else {
            this.switchSprite("Attack1Left");
        }

        this.cooldownAttack = true;
        setTimeout(() => {
            this.isAttacking = true;

            setTimeout(() => {
                this.isAttacking = false;
            }, 150);
            setTimeout(() => {
                this.cooldownAttack = false;
            }, attackCooldown);
        }, 100);
    }

    jump() {
        if (this.jumps < 1) return;
        this.velocity.y = jumpStrength;
        this.jumps--;
    }

    dash() {
        if (this.dashes < 1 || this.cooldownDash) return;
        this.velocity.x = this.lastDirection === "right" ? dashStrength : -1 * dashStrength;
        this.dashes--;
        this.cooldownDash = true;
        setTimeout(() => {
            this.cooldownDash = false;
        }, dashCooldown);
    }

    checkForHit() {
        if (this.isAttacking) {
            const hitOtherPlayer = collision({
                object1: this.attackBox,
                object2: this.otherPlayer.hitbox,
            });
            if (hitOtherPlayer) {
                const angle = calcAngle({
                    object1: this.attackBox,
                    object2: this.otherPlayer.hitbox,
                });
                this.otherPlayer.velocity.x += Math.cos(angle) * 2000 / this.otherPlayer.healthBar.value;
                this.otherPlayer.velocity.y += Math.sin(angle) * 700 / this.otherPlayer.healthBar.value;
    
                this.otherPlayer.healthBar.value -= 10;
                this.isAttacking = false;
            }
        }
    }

    checkForDeath() {
        if (this.position.y > 3000) {
            this.lives--;
            if (this.lives < 1) {
                gameOver(this === player1 ? 2 : 1);
            } else {
                if (this === player1) {
                    this.position = { ...player1Respawn };
                } else {
                    this.position = { ...player2Respawn };
                }
                this.healthBar.value = 100;
                this.velocity = { x: 0, y: 0 };
            }
        }
    }

    checkForKeys() {
        let sprite = "Idle";
        
        if (this.keys.right.pressed && !this.keys.left.pressed) {
            sprite = "Run";
            this.velocity.x += playerSpeed;
            if (!this.isAttacking) this.lastDirection = "right";
        } else if (this.keys.left.pressed && !this.keys.right.pressed) {
            sprite = "RunLeft";
            this.velocity.x += -playerSpeed;
            if (!this.isAttacking) this.lastDirection = "left";
        } else if (this.velocity.y === 0) {
            if (this.lastDirection === "right") {
                sprite = "Idle";
            } else {
                sprite = "IdleLeft";
            }
        }
    
        if (this.velocity.y < 0) {
            if (this.lastDirection === "right") {
                sprite = "Jump";
            } else {
                sprite = "JumpLeft";
            }
        } else if (this.velocity.y > 0) {
            if (this.lastDirection === "right") {
                sprite = "Fall";
            } else {
                sprite = "FallLeft";
            }
        }

        this.switchSprite(sprite);
    }

    updateHitbox() {
        this.hitbox = {
            position: {
                x: this.position.x + 44 * this.scale,
                y: this.position.y,
            },
            width: 70 * this.scale,
            height: 110 * this.scale,
        }

        this.attackBox = {
            position: {
                x: this.position.x + this.scale * (54 + 26 * (this.lastDirection === "right" ? 1 : -1)),
                y: this.position.y + 23 * this.scale,
            },
            width: 53 * this.scale,
            height: 20 * this.scale,
        }
    }

    checkForPlayerCollisions() {
        if (collision({
            object1: this.hitbox,
            object2: this.otherPlayer.hitbox,
        })) {
            if (this.velocity.x > 0) {
                this.velocity.x = 0;
    
                const offset = this.hitbox.position.x - this.position.x + this.hitbox.width;
    
                this.position.x = this.otherPlayer.hitbox.position.x - offset - 0.01;
            } else if (this.velocity.x < 0) {
                this.velocity.x = 0;
    
                const offset = this.hitbox.position.x - this.position.x;
                
                this.position.x = this.otherPlayer.hitbox.position.x + this.otherPlayer.hitbox.width - offset + 0.01;
            }
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
        this.velocity.x *= frictionMultiplier;
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
                    this.jumps = maxJumps;
                    this.dashes = maxDashes;

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
                    this.jumps = maxJumps;
                    this.dashes = maxDashes;

                    const offset = this.hitbox.position.y - this.position.y + this.hitbox.height;

                    this.position.y = platformCollisionBlock.position.y - offset - 0.01;
                    break;
                }
            }
        }
    }
}