import Vec2 from './Vec2';
export default function LocalToGlobal(transform, x, y, outPoint = new Vec2()) {
    const { a, b, c, d, tx, ty } = transform;
    outPoint.x = (a * x) + (c * y) + tx;
    outPoint.y = (b * x) + (d * y) + ty;
    return outPoint;
}
//# sourceMappingURL=LocalToGlobal.js.map