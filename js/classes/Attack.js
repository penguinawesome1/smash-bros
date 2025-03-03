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
                    x: position.x + this.scale * (0 + 50 * (this.direction === "right" ? 1 : 0)),
                    y: position.y + this.scale * 28,
                };
                this.velocity = {
                    x: this.direction === "right" ? 20 : -20,
                    y: 0,
                };
                this.hitbox = {
                    position: this.position,
                    width: 10,
                    height: 10,
                };
                break;
            }
            case "potion": {
                this.position = {
                    x: position.x + this.scale * (50 + 50 * (this.direction === "right" ? 1 : -1)),
                    y: position.y + this.scale * 42.5,
                };
                this.velocity = {
                    x: this.direction === "right" ? 10 : -10,
                    y: 0,
                };
                this.hitbox = {
                    position: this.position,
                    width: 10,
                    height: 10,
                };
                break;
            }
            case "aoe": {
                this.position = position;
                this.velocity = {
                    x: 0,
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
                    x: this.direction === "right" ? 8 : -8,
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
                    x: 350,
                    y: 250,
                }
                this.velocity = {
                    x: 0,
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

        if (dev) {
            c.fillStyle = "red";
            c.fillRect(this.hitbox.position.x, this.hitbox.position.y, this.hitbox.width, this.hitbox.height);
        }

        if (this.type === "boomerang") {
            this.velocity.x += this.direction === "right" ? -.2 : .2;
        } else if (this.type === "potion") {
            this.applyGravity();
            this.applyFriction();
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
        const d1 = calcDistance({
            object1: this.hitbox,
            object2: this.player.hitbox,
        });
        const d2 = calcDistance({
            object1: this.hitbox,
            object2: this.otherPlayer.hitbox,
        });

        const angle = calcAngle({
            object1: this.hitbox,
            object2: (d1 < d2 ? this.player.hitbox : this.otherPlayer.hitbox),
        });

        this.velocity.x = Math.cos(angle) * 8;
        this.velocity.y = Math.sin(angle) * 8;
    }

    reactToCollision() {
        if (this.isCollision()) {
            const i = this.player.attackList.indexOf(this);
            if (i > -1) this.player.attackList.splice(i, 1);
            return;
        }

        const playerCollision = this.checkForPlayerCollision();
        if (!playerCollision) return;

        if (this.type === "potion") {
            this.player.attackList.push(
                new Attack({
                    position: { ...this.position },
                    collisionBlocks,
                    platformCollisionBlocks,
                    imageSrc: this.direction === "right" ? "./img/Bullet.png" : "./img/BulletLeft.png",
                    direction: this.direction,
                    player: this.player,
                    otherPlayer: this.otherPlayer,
                    type: "aoe",
                    scale: 10,
                })
            );
            const i = this.player.attackList.indexOf(this);
            if (i > -1) this.player.attackList.splice(i, 1);
        }
        if (this.type === "bullet") {
            const i = this.player.attackList.indexOf(this);
            if (i > -1) this.player.attackList.splice(i, 1);
        }

        if (this.type === "homingdart") {
            if (collision({
                object1: this.hitbox,
                object2: this.player.hitbox,
            })) {
                const angle = calcAngle({
                    object1: this.hitbox,
                    object2: this.player.hitbox,
                });
                this.player.velocity.x += Math.cos(angle) * .5;
                this.player.velocity.y += Math.sin(angle) * .2;
            } else {
                const angle = calcAngle({
                    object1: this.hitbox,
                    object2: this.otherPlayer.hitbox,
                });
                this.otherPlayer.velocity.x += Math.cos(angle) * .5;
                this.otherPlayer.velocity.y += Math.sin(angle) * .2;
            }
            return;
        }

        const angle = calcAngle({
            object1: this.hitbox,
            object2: this.otherPlayer.hitbox,
        });
        this.otherPlayer.velocity.x += Math.cos(angle) * 500 / this.otherPlayer.healthBar.value;
        this.otherPlayer.velocity.y += Math.sin(angle) * 250 / this.otherPlayer.healthBar.value;

        this.otherPlayer.healthBar.value -= 10;

        if (this.type !== "aoe") {
            this.otherPlayer.hitStop = true;
            setTimeout(() => {
                this.otherPlayer.hitStop = false;
            }, hitStopDuration);
        }
    }

    updateHitbox() {
        this.hitbox = {
            position: {
                x: this.position.x + this.scale * (5 + 5 * (this.direction === "right" ? 1 : -1)),
                y: this.position.y + 0 * this.scale,
            },
            width: 16 * this.scale,
            height: 4 * this.scale,
        }
    }

    checkForPlayerCollision() {
        if (this.type === "homingdart") {
            return collision({
                object1: this.hitbox,
                object2: this.otherPlayer.hitbox,
            }) || collision({
                object1: this.hitbox,
                object2: this.player.hitbox,
            });
        }

        const hitOtherPlayer = collision({
            object1: this.hitbox,
            object2: this.otherPlayer.hitbox,
        });
        return hitOtherPlayer;
    }
}