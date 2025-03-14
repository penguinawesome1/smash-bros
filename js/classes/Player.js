class Player extends Component {
  constructor({
    position,
    collisionBlocks,
    platformCollisionBlocks,
    imageSrc,
    frameRate,
    scale = 0.4,
    animations,
  }) {
    super({ position, imageSrc, frameRate, scale });
    this.position = position;
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.collisionBlocks = collisionBlocks;
    this.platformCollisionBlocks = platformCollisionBlocks;
    this.hitbox = {
      position: this.position,
      width: 10,
      height: 10,
    };

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
    };

    this.keys = {
      left: false,
      right: false,
      down: false,
      up: false,
    };

    this.attackList = [];

    this.attackImages = new Set([
      this.animations.Attack1.image,
      this.animations.Attack1Left.image,
      this.animations.Attack2.image,
      this.animations.Attack2Left.image,
    ]);
  }

  switchSprite(key) {
    const isAttacking = this.attackImages.has(this.image);
    const notLastFrame =
      this.currentFrame < this.animations.Attack1.frameRate - 1;
    const sameImage = this.image === this.animations[key].image;
    if (sameImage || !this.loaded || (isAttacking && notLastFrame)) return;

    this.currentFrame = 0;
    this.image = this.animations[key].image;
    this.frameBuffer = this.animations[key].frameBuffer;
    this.frameRate = this.animations[key].frameRate;
  }

  update() {
    this.updateFrames();
    this.updateHitbox();

    if (hack) {
      this.hack();
      this.lives = maxLives;
      this.otherPlayer.lives = maxLives;
    }

    if (dev) {
      // draws out image
      c.fillStyle = "rgba(0, 255, 0, 0.2)";
      c.fillRect(this.position.x, this.position.y, this.width, this.height);
      // draws out hitbox
      c.fillStyle = "rgba(255, 0, 0, .2)";
      c.fillRect(
        this.hitbox.position.x,
        this.hitbox.position.y,
        this.hitbox.width,
        this.hitbox.height
      );
      // draws out attack
      if (this.isAttacking) {
        c.fillStyle = "rgba(0, 0, 255, .2)";
        c.fillRect(
          this.attackBox.position.x,
          this.attackBox.position.y,
          this.attackBox.width,
          this.attackBox.height
        );
      }
    }

    this.draw();

    if (this.hitStop) {
      this.switchSprite(this.lastDirection === "right" ? "Hurt" : "HurtLeft");
    }

    this.updateArrow();
    this.attackList.forEach((attack) => {
      attack.update();
    });

    this.checkGrabbed();
    if (this.grabbed || this.hitStop) return;

    this.checkForKeys();

    this.applyFriction();
    this.updateHitbox();
    this.respondToHorizontalCollision();
    // this.checkForHorizontalPlayerCollision();

    this.applyGravity();
    this.updateHitbox();
    this.grounded = this.respondToVerticalCollision() !== false;
    this.crouching = this.grounded && this.keys.down;
    if (this.crouching) {
      const image = this.lastDirection === "right" ? "Crouch" : "CrouchLeft";
      this.switchSprite(image);
      return;
    }

    if (this.dashing) {
      const image = this.lastDirection === "right" ? "Dash" : "DashLeft";
      this.switchSprite(image);
      return;
    }

    this.checkForVerticalPlayerCollision();
    // this.checkForHorizontalPlayerCollision();

    this.checkForHit();
    this.checkForDeath();
  }

  jump() {
    if (this.jumps < 1 || this.crouching) return;
    this.velocity.y = -jumpStrength;
    this.jumps--;
  }

  smash() {
    if (this.smashing || this.grounded) return;
    this.velocity.y = 0;
    setTimeout(() => {
      this.velocity.y = smashStrength;
      this.smashing = true;
    }, 100);
  }

  attack1() {
    if (this.cooldownAttack || this.otherPlayer.grabbed) return;

    this.switchSprite(
      this.lastDirection === "right" ? "Attack1" : "Attack1Left"
    );
    this.attackDirection = this.lastDirection;

    this.cooldownAttack = true;
    setTimeout(() => {
      this.isAttacking = true;

      setTimeout(() => {
        this.isAttacking = false;
      }, 150);

      setTimeout(() => {
        this.cooldownAttack = false;
      }, 300);
    }, 100);
  }

  attack2() {
    if (this.cooldownAttack || this.otherPlayer.grabbed) return;

    this.switchSprite(
      this.lastDirection === "right" ? "Attack2" : "Attack2Left"
    );
    const direction = this.lastDirection;

    this.cooldownAttack = true;
    setTimeout(() => {
      this.attackList.push(
        new Attack({
          position: { ...this.position },
          collisionBlocks,
          platformCollisionBlocks,
          imageSrc:
            direction === "right" ? "./img/Bullet.png" : "./img/BulletLeft.png",
          direction,
          player: this,
          otherPlayer: this.otherPlayer,
          type: "bullet",
          scale: this.scale * 4,
        })
      );

      setTimeout(() => {
        this.cooldownAttack = false;
      }, 1100);
    }, 50);
  }

  hack() {
    this.attackList.push(
      new Attack({
        position: { ...this.position },
        collisionBlocks,
        platformCollisionBlocks,
        imageSrc:
          this.lastDirection === "right"
            ? "./img/Bullet.png"
            : "./img/BulletLeft.png",
        direction: this.lastDirection,
        player: this,
        otherPlayer: this.otherPlayer,
        type: "homingdart",
      })
    );
  }

  dash() {
    if (this.dashes < 1 || this.cooldownDash) return;

    let x = 0,
      y = 0;
    if (this.keys.up && !this.keys.down) {
      if (this.keys.left && !this.keys.right) {
        // up left
        x = -dashStrength / 1.414;
        y = -dashStrength / 1.414;
      } else if (this.keys.right && !this.keys.left) {
        // up right
        x = dashStrength / 1.414;
        y = -dashStrength / 1.414;
      } else {
        // up only
        y = -dashStrength;
      }
    } else if (this.keys.down && !this.keys.up) {
      if (this.keys.left && !this.keys.right) {
        // down left
        x = -dashStrength / 1.414;
        y = dashStrength / 1.414;
      } else if (this.keys.right && !this.keys.left) {
        // down right
        x = dashStrength / 1.414;
        y = dashStrength / 1.414;
      } else {
        // down only
        y = dashStrength;
      }
    } else {
      if (this.keys.left && !this.keys.right) {
        // left only
        x = -dashStrength;
      } else if (this.keys.right && !this.keys.left) {
        // right only
        x = dashStrength;
      } else {
        // no direction
        x = this.lastDirection === "right" ? dashStrength : -dashStrength;
      }
    }

    this.velocity.x += x;
    this.velocity.y += y;

    this.dashing = true;
    setTimeout(() => {
      this.dashing = false;
    }, 220);

    this.dashes--;
    this.cooldownDash = true;
    setTimeout(() => {
      this.cooldownDash = false;
    }, 2000);
  }

  grab() {
    if (this.otherPlayer.grabbed) {
      this.otherPlayer.grabbed = false;
      this.otherPlayer.velocity = {
        x:
          this.velocity.x +
          (1500 * (this.lastDirection === "right" ? 1 : -1)) /
            this.otherPlayer.healthBar.value,
        y: this.velocity.y,
      };
      return;
    }

    this.attackDirection = this.lastDirection;
    this.grabbing = true;
    this.updateHitbox();
    this.grabbing = false;
    if (
      collision({
        object1: this.attackBox,
        object2: this.otherPlayer.hitbox,
      })
    ) {
      this.otherPlayer.grabbed = true;
      this.otherPlayer.velocity = {
        x: 0,
        y: 0,
      };
      this.otherPlayer.lastDirection = this.lastDirection;
      this.otherPlayer.switchSprite("Idle");
      setTimeout(() => {
        this.otherPlayer.grabbed = false;
      }, 2000);
    }
  }

  checkGrabbed() {
    if (!this.grabbed) return;

    this.position = {
      x: this.otherPlayer.position.x,
      y: this.otherPlayer.position.y - this.height,
    };
  }

  applyGravity() {
    this.velocity.y += gravity;
    this.position.y += this.velocity.y;
  }

  applyFriction() {
    this.velocity.x *= frictionMultiplier;
    this.position.x += this.velocity.x;
  }

  checkForHit() {
    if (!this.isAttacking || this.otherPlayer.dashing) return;

    if (
      collision({
        object1: this.attackBox,
        object2: this.otherPlayer.hitbox,
      })
    ) {
      const angle = calcAngle({
        object1: this.attackBox,
        object2: this.otherPlayer.hitbox,
      });
      this.otherPlayer.velocity.x +=
        (Math.cos(angle) * 2000) / this.otherPlayer.healthBar.value;
      this.otherPlayer.velocity.y +=
        (Math.sin(angle) * 700) / this.otherPlayer.healthBar.value;

      this.hitStop = true;
      this.otherPlayer.hitStop = true;
      setTimeout(() => {
        this.hitStop = false;
        this.otherPlayer.hitStop = false;
      }, hitStopDuration);

      this.otherPlayer.healthBar.value -= 14;
      this.isAttacking = false;
    }
  }

  checkForDeath() {
    if (this.lives < 1) return;
    if (this.position.y > 1000 || this.position.y < -3000) {
      this.lives--;
      this.livesBar.children[this.lives].style.backgroundColor = "black";
      if (this.lives < 1) {
        if (!document.getElementById("game-over-popup").classList.contains("hidden")) return;
        const winner = this === player1 ? 2 : 1;
        document.getElementById("game-over-popup").classList.remove("hidden");
        document.getElementById("winner").innerText = winner;
        return;
      }
      this.position =
        this === player1 ? { ...player1Respawn } : { ...player2Respawn };
      this.healthBar.value = 100;
      this.velocity = { x: 0, y: 0 };
    }
  }

  updateArrow() {
    const arrow =
      this === player1
        ? document.getElementById("arrow-1")
        : document.getElementById("arrow-2");
    if (this.position.y > 0) {
      arrow.classList.add("hidden");
      return;
    }
    arrow.classList.remove("hidden");

    const distance = calcDistance({
      object1: this.hitbox,
      object2: {
        position: {
          x: 350,
          y: 250,
        },
        width: 0,
        height: 0,
      },
    });
    arrow.style.width = 2000 / Math.sqrt(distance) + "px";

    const angle = calcAngle({
      object1: this.hitbox,
      object2: {
        position: {
          x: 350,
          y: 250,
        },
        width: 0,
        height: 0,
      },
    });
    arrow.style.transform = `rotate(${angle - 3.14 / 2}rad)`;

    const x = this.position.x * scaledCanvas.scale;

    if (x < 0) arrow.style.left = "0px";
    else if (x > canvas.width - 160)
      arrow.style.left = `${canvas.width - 160}px`;
    else arrow.style.left = this.position.x * scaledCanvas.scale + "px";
  }

  updateHitbox() {
    if (this.crouching || this.keys.up || this.velocity.y < 0) {
      this.hitbox = {
        position: {
          x: this.position.x + 75 * this.scale,
          y: this.position.y + this.height / 2,
        },
        width: 135 * this.scale,
        height: this.height / 2,
      };
    } else {
      this.hitbox = {
        position: {
          x: this.position.x + 75 * this.scale,
          y: this.position.y,
        },
        width: 135 * this.scale,
        height: this.height,
      };
    }

    if (this.dashing) {
      this.attackBox.width = 0;
    } else if (this.grabbing) {
      this.attackBox = {
        position: {
          x:
            this.position.x +
            this.scale *
              (84 + 60 * (this.attackDirection === "right" ? 1 : -1)),
          y: this.position.y + 40 * this.scale,
        },
        width: 106 * this.scale,
        height: 240 * this.scale,
      };
    } else if (this.keys.up) {
      this.attackBox = {
        position: {
          x:
            this.position.x +
            this.scale *
              (84 + 60 * (this.attackDirection === "right" ? 1 : -1)),
          y: this.position.y - 42 * this.scale,
        },
        width: 120 * this.scale,
        height: 120 * this.scale,
      };
    } else {
      this.attackBox = {
        position: {
          x:
            this.position.x +
            this.scale *
              (84 + 60 * (this.attackDirection === "right" ? 1 : -1)),
          y: this.position.y + 65 * this.scale,
        },
        width: 106 * this.scale,
        height: 40 * this.scale,
      };
    }
  }

  checkForKeys() {
    let sprite = "Idle";

    if (this.keys.right && !this.keys.left) {
      sprite = "Run";
      this.velocity.x += playerSpeed;
      if (!this.isAttacking) this.lastDirection = "right";
    } else if (this.keys.left && !this.keys.right) {
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

  respondToHorizontalCollision() {
    const collisionBlock = this.isCollision();
    if (!collisionBlock) return;

    if (this.velocity.x > 0) {
      this.velocity.x = 0;

      const offset =
        this.hitbox.position.x - this.position.x + this.hitbox.width;

      this.position.x = collisionBlock.position.x - offset - 0.01;
    } else if (this.velocity.x < 0) {
      this.velocity.x = 0;

      const offset = this.hitbox.position.x - this.position.x;

      this.position.x =
        collisionBlock.position.x + collisionBlock.width - offset + 0.01;
    }
  }

  respondToVerticalCollision() {
    const collisionBlock = this.isCollision();
    const platformCollisionBlock = this.isPlatformCollision();
    if (collisionBlock) {
      if (this.velocity.y > 0) {
        this.velocity.y = 0;
        this.jumps = maxJumps;
        this.dashes = maxDashes;
        this.smashing = false;

        const offset =
          this.hitbox.position.y - this.position.y + this.hitbox.height;

        this.position.y = collisionBlock.position.y - offset - 0.01;
      } else if (this.velocity.y < 0) {
        this.velocity.y = 0;

        const offset = this.hitbox.position.y - this.position.y;

        this.position.y =
          collisionBlock.position.y + collisionBlock.height - offset + 0.01;
      }
      return true;
    } else if (platformCollisionBlock) {
      const jumpDown = this.crouching && this.keys.up;
      if (jumpDown || this.velocity.y <= 0) return;

      this.velocity.y = 0;
      this.jumps = maxJumps;
      this.dashes = maxDashes;
      this.smashing = false;

      const offset =
        this.hitbox.position.y - this.position.y + this.hitbox.height;

      this.position.y = platformCollisionBlock.position.y - offset - 0.01;
      return true;
    }
    return false;
  }

  checkForHorizontalPlayerCollision() {
    if (
      collision({
        object1: this.hitbox,
        object2: this.otherPlayer.hitbox,
      })
    ) {
      if (this.velocity.x > 0) {
        this.velocity.x = 0;

        const offset =
          this.hitbox.position.x - this.position.x + this.hitbox.width;

        this.position.x = this.otherPlayer.hitbox.position.x - offset - 0.01;
      } else if (this.velocity.x < 0) {
        this.velocity.x = 0;

        const offset = this.hitbox.position.x - this.position.x;

        this.position.x =
          this.otherPlayer.hitbox.position.x +
          this.otherPlayer.hitbox.width -
          offset +
          0.01;
      }
    }
  }

  checkForVerticalPlayerCollision() {
    if (!this.smashing || this.velocity.y <= 0) return;

    if (
      collision({
        object1: this.hitbox,
        object2: this.otherPlayer.hitbox,
      })
    ) {
      const multiplier = this.smashing ? 2 : 1;
      console.log(this.velocity.y);
      this.otherPlayer.healthBar.value -= Math.max(
        8,
        multiplier * Math.sqrt(Math.abs(this.velocity.y))
      );

      const angle = calcAngle({
        object1: this.otherPlayer.hitbox,
        object2: this.hitbox,
      });
      this.velocity.x +=
        (multiplier * Math.cos(angle) * 1000) / this.healthBar.value;
      this.velocity.y +=
        (multiplier * Math.sin(angle) * 700) / this.healthBar.value;
      this.otherPlayer.velocity.x -=
        (multiplier * Math.cos(angle) * 1000) /
        (this.otherPlayer.healthBar.value + 1);
      this.otherPlayer.velocity.y -=
        (multiplier * Math.sin(angle) * 350) /
        (this.otherPlayer.healthBar.value + 1);
      this.dashes = maxDashes;

      this.hitStop = true;
      this.otherPlayer.hitStop = true;
      setTimeout(() => {
        this.hitStop = false;
        this.otherPlayer.hitStop = false;
      }, hitStopDuration);
    }

    // this.smashing = false;
  }
}
