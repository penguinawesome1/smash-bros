class CollisionBlock extends Sprite {
    constructor({
        position,
        imageSrc,
        scale = .4,
        scaleY = .4,
    }) {
        super({ position, imageSrc, scale, scaleY });
    }

    // draw() {
    //     c.fillStyle = "rgba(255, 0, 0, 0.5)"
    //     c.fillRect(this.position.x, this.position.y, this.width, this.height);
    // }

    update() {
        this.draw();
    }
}