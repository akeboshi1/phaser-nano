export default class Ellipse {
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
        //  Normalize the coords to an ellipse with center 0,0 and a radius of 0.5
        let normx = ((px - x) / width);
        let normy = ((py - y) / height);
        normx *= normx;
        normy *= normy;
        return (normx + normy < 0.25);
    }
}
//# sourceMappingURL=Ellipse.js.map