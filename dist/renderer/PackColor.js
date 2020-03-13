export default function (rgb, alpha) {
    let ua = ((alpha * 255) | 0) & 0xFF;
    return ((ua << 24) | rgb) >>> 0;
}
//# sourceMappingURL=PackColor.js.map