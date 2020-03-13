import Vec2 from './Vec2';
export default function GlobalToLocal(transform, x, y, outPoint = new Vec2()) {
    const { a, b, c, d, tx, ty } = transform;
    const id = 1 / ((a * d) + (c * -b));
    outPoint.x = (d * id * x) + (-c * id * y) + (((ty * c) - (tx * d)) * id);
    outPoint.y = (a * id * y) + (-b * id * x) + (((-ty * a) + (tx * b)) * id);
    return outPoint;
}
//# sourceMappingURL=GlobalToLocal.js.map