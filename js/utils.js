function collision({ object1, object2, type = null }) {
    const grounded = object1.position.y + object1.height >= object2.position.y;
    if (type !== null) type.grounded = grounded;
    return (
        grounded &&
        object1.position.y <= object2.position.y + object2.height &&
        object1.position.x <= object2.position.x + object2.width &&
        object1.position.x + object1.width >= object2.position.x
    );
}
  
function platformCollision({ object1, object2, type = null }) {
    const grounded = object1.position.y + object1.height >= object2.position.y;
    if (type !== null) type.grounded = grounded;
    return (
        grounded &&
        object1.position.y + object1.height <= object2.position.y + object2.height &&
        object1.position.x <= object2.position.x + object2.width &&
        object1.position.x + object1.width >= object2.position.x
    );
}

function calcAngle({ object1, object2 }) {
    const x1 = object1.position.x + object1.width / 2;
    const y1 = object1.position.y + object1.height / 2;
    const x2 = object2.position.x + object2.width / 2;
    const y2 = object2.position.y + object2.height / 2;
    return Math.atan2(y2 - y1, x2 - x1);
}