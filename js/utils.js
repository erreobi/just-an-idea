

export function checkCollition(a, b){
    const dx = a.collisionX - b.collisionX;
    const dy = a.collisionY - b.collisionY;
    const distHypotenuse = Math.hypot(dx, dy);
    const minDistanceBetween2Objects = a.collisionRadius + b.collisionRadius;

    return [(distHypotenuse < minDistanceBetween2Objects), distHypotenuse, minDistanceBetween2Objects, dx, dy];
}


