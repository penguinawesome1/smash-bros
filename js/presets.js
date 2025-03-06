function getCountryBoy(position) {
  return new Player({
    position,
    collisionBlocks,
    platformCollisionBlocks,
    scale,
    imageSrc: `./img/players/country-boy/Idle.png`,
    frameRate: 1,
    animations: {
      Idle: {
        imageSrc: `./img/players/country-boy/Idle.png`,
        frameRate: 1,
        frameBuffer: 0,
      },
      IdleLeft: {
        imageSrc: `./img/players/country-boy/IdleLeft.png`,
        frameRate: 1,
        frameBuffer: 0,
      },
      Run: {
        imageSrc: `./img/players/country-boy/Run.png`,
        frameRate: 5,
        frameBuffer: 1,
      },
      RunLeft: {
        imageSrc: `./img/players/country-boy/RunLeft.png`,
        frameRate: 5,
        frameBuffer: 1,
      },
      Jump: {
        imageSrc: `./img/players/country-boy/Jump.png`,
        frameRate: 2,
        frameBuffer: 12,
      },
      JumpLeft: {
        imageSrc: `./img/players/country-boy/JumpLeft.png`,
        frameRate: 2,
        frameBuffer: 12,
      },
      Fall: {
        imageSrc: `./img/players/country-boy/Fall.png`,
        frameRate: 1,
        frameBuffer: 8,
      },
      FallLeft: {
        imageSrc: `./img/players/country-boy/FallLeft.png`,
        frameRate: 1,
        frameBuffer: 0,
      },
      Attack1: {
        imageSrc: `./img/players/country-boy/Attack1.png`,
        frameRate: 8,
        frameBuffer: 3,
      },
      Attack1Left: {
        imageSrc: `./img/players/country-boy/Attack1Left.png`,
        frameRate: 8,
        frameBuffer: 3,
      },
      Attack2: {
        imageSrc: `./img/players/country-boy/Attack2.png`,
        frameRate: 9,
        frameBuffer: 2,
      },
      Attack2Left: {
        imageSrc: `./img/players/country-boy/Attack2Left.png`,
        frameRate: 9,
        frameBuffer: 2,
      },
      Dash: {
        imageSrc: `./img/players/country-boy/Dash.png`,
        frameRate: 1,
        frameBuffer: 0,
      },
      DashLeft: {
        imageSrc: `./img/players/country-boy/DashLeft.png`,
        frameRate: 1,
        frameBuffer: 0,
      },
      Hurt: {
        imageSrc: `./img/players/country-boy/Hurt.png`,
        frameRate: 1,
        frameBuffer: 0,
      },
      HurtLeft: {
        imageSrc: `./img/players/country-boy/HurtLeft.png`,
        frameRate: 1,
        frameBuffer: 0,
      },
      Crouch: {
        imageSrc: `./img/players/country-boy/Crouch.png`,
        frameRate: 1,
        frameBuffer: 0,
      },
      CrouchLeft: {
        imageSrc: `./img/players/country-boy/CrouchLeft.png`,
        frameRate: 1,
        frameBuffer: 0,
      },
    },
  });
}

function getMechanic(position) {
  return new Player({
    position,
    scale,
    collisionBlocks,
    platformCollisionBlocks,
    imageSrc: `./img/players/mechanic/Hurt.png`,
    frameRate: 1,
    animations: {
      Idle: {
        imageSrc: `./img/players/mechanic/Idle.png`,
        frameRate: 1,
        frameBuffer: 0,
      },
      IdleLeft: {
        imageSrc: `./img/players/mechanic/IdleLeft.png`,
        frameRate: 1,
        frameBuffer: 0,
      },
      Run: {
        imageSrc: `./img/players/mechanic/Run.png`,
        frameRate: 5,
        frameBuffer: 6,
      },
      RunLeft: {
        imageSrc: `./img/players/mechanic/RunLeft.png`,
        frameRate: 5,
        frameBuffer: 6,
      },
      Jump: {
        imageSrc: `./img/players/mechanic/Jump.png`,
        frameRate: 2,
        frameBuffer: 12,
      },
      JumpLeft: {
        imageSrc: `./img/players/mechanic/JumpLeft.png`,
        frameRate: 2,
        frameBuffer: 12,
      },
      Fall: {
        imageSrc: `./img/players/mechanic/Fall.png`,
        frameRate: 2,
        frameBuffer: 8,
      },
      FallLeft: {
        imageSrc: `./img/players/mechanic/FallLeft.png`,
        frameRate: 2,
        frameBuffer: 8,
      },
      Attack1: {
        imageSrc: `./img/players/mechanic/Attack1.png`,
        frameRate: 6,
        frameBuffer: 4,
      },
      Attack1Left: {
        imageSrc: `./img/players/mechanic/Attack1Left.png`,
        frameRate: 6,
        frameBuffer: 4,
      },
      Attack2: {
        imageSrc: `./img/players/mechanic/Attack2.png`,
        frameRate: 8,
        frameBuffer: 5,
      },
      Attack2Left: {
        imageSrc: `./img/players/mechanic/Attack2Left.png`,
        frameRate: 8,
        frameBuffer: 5,
      },
      Dash: {
        imageSrc: `./img/players/mechanic/Dash.png`,
        frameRate: 1,
        frameBuffer: 0,
      },
      DashLeft: {
        imageSrc: `./img/players/mechanic/DashLeft.png`,
        frameRate: 1,
        frameBuffer: 0,
      },
      Hurt: {
        imageSrc: `./img/players/mechanic/Hurt.png`,
        frameRate: 1,
        frameBuffer: 0,
      },
      HurtLeft: {
        imageSrc: `./img/players/mechanic/HurtLeft.png`,
        frameRate: 1,
        frameBuffer: 0,
      },
      Crouch: {
        imageSrc: `./img/players/mechanic/Crouch.png`,
        frameRate: 1,
        frameBuffer: 0,
      },
      CrouchLeft: {
        imageSrc: `./img/players/mechanic/CrouchLeft.png`,
        frameRate: 1,
        frameBuffer: 0,
      },
    },
  });
}

function getCube(position) {
  return new Player({
    position,
    scale,
    collisionBlocks,
    platformCollisionBlocks,
    imageSrc: `./img/players/cube/Idle.png`,
    frameRate: 1,
    animations: {
      Idle: {
        imageSrc: `./img/players/cube/Idle.png`,
        frameRate: 1,
        frameBuffer: 0,
      },
      IdleLeft: {
        imageSrc: `./img/players/cube/IdleLeft.png`,
        frameRate: 1,
        frameBuffer: 0,
      },
      Run: {
        imageSrc: `./img/players/cube/Run.png`,
        frameRate: 1,
        frameBuffer: 6,
      },
      RunLeft: {
        imageSrc: `./img/players/cube/RunLeft.png`,
        frameRate: 1,
        frameBuffer: 6,
      },
      Jump: {
        imageSrc: `./img/players/cube/Jump.png`,
        frameRate: 1,
        frameBuffer: 12,
      },
      JumpLeft: {
        imageSrc: `./img/players/cube/JumpLeft.png`,
        frameRate: 1,
        frameBuffer: 12,
      },
      Fall: {
        imageSrc: `./img/players/cube/Fall.png`,
        frameRate: 1,
        frameBuffer: 8,
      },
      FallLeft: {
        imageSrc: `./img/players/cube/FallLeft.png`,
        frameRate: 1,
        frameBuffer: 8,
      },
      Attack1: {
        imageSrc: `./img/players/cube/Attack1.png`,
        frameRate: 1,
        frameBuffer: 4,
      },
      Attack1Left: {
        imageSrc: `./img/players/cube/Attack1Left.png`,
        frameRate: 1,
        frameBuffer: 4,
      },
      Attack2: {
        imageSrc: `./img/players/cube/Attack2.png`,
        frameRate: 1,
        frameBuffer: 5,
      },
      Attack2Left: {
        imageSrc: `./img/players/cube/Attack2Left.png`,
        frameRate: 1,
        frameBuffer: 5,
      },
      Dash: {
        imageSrc: `./img/players/cube/Dash.png`,
        frameRate: 1,
        frameBuffer: 0,
      },
      DashLeft: {
        imageSrc: `./img/players/cube/DashLeft.png`,
        frameRate: 1,
        frameBuffer: 0,
      },
      Hurt: {
        imageSrc: `./img/players/cube/Hurt.png`,
        frameRate: 1,
        frameBuffer: 0,
      },
      HurtLeft: {
        imageSrc: `./img/players/cube/HurtLeft.png`,
        frameRate: 1,
        frameBuffer: 0,
      },
    },
  });
}

function getFarmCollision() {
  return [
    new CollisionBlock({
      position: {
        x: 60,
        y: 420,
      },
      imageSrc: `./img/colliders/island.png`,
      scale: 0.6,
      scaleY: 0.4,
    }),
  ];
}

function getFarmPlatformCollision() {
  return [
    new CollisionBlock({
      position: {
        x: 60,
        y: 300,
      },
      imageSrc: `./img/colliders/default.png`,
      scale: 4,
      scaleY: 0.05,
    }),
  ];
}

function getGasStationCollision() {
  return [
    new CollisionBlock({
      position: {
        x: 60,
        y: 440,
      },
      imageSrc: `./img/colliders/default.png`,
      scale: 4,
      scaleY: 0.2,
    }),
  ];
}

function getGasStationPlatformCollision() {
  return [];
}
