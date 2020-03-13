export default class Circle {
    x: number;
    y: number;
    radius: number;
    constructor(x?: number, y?: number, radius?: number);
    set(x?: number, y?: number, radius?: number): this;
    contains(px: number, py: number): boolean;
    get diameter(): number;
    set diameter(value: number);
}
//# sourceMappingURL=Circle.d.ts.map