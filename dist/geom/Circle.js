export default class Circle {
    constructor(x = 0, y = 0, radius = 0) {
        this.set(x, y, radius);
    }
    set(x = 0, y = 0, radius = 0) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        return this;
    }
    contains(px, py) {
        const { x, y, radius } = this;
        var dx = (x - px) * (x - px);
        var dy = (y - py) * (y - py);
        return (dx + dy) <= (radius * radius);
    }
    get diameter() {
        return this.radius * 2;
    }
    set diameter(value) {
        this.radius = value * 0.5;
    }
}
//# sourceMappingURL=Circle.js.map