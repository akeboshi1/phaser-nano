export default class Rectangle {
    constructor(x = 0, y = 0, width = 0, height = 0) {
        this.set(x, y, width, height);
    }
    set(x = 0, y = 0, width = 0, height = 0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        return this;
    }
    contains(px, py) {
        const { x, y, width, height } = this;
        if (width <= 0 || height <= 0) {
            return false;
        }
        return (x <= px && x + width >= px && y <= py && y + height >= py);
    }
}
//# sourceMappingURL=Rectangle.js.map