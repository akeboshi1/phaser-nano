export default function Ortho (width: number, height: number, near: number = -1, far: number = 1): Float32Array
{
    const m00: number = -2 * (1 / -width);
    const m11: number = -2 * (1 / height);
    const m22: number = 2 * (1 / (near - far));

    return new Float32Array([ m00, 0, 0, 0, 0, m11, 0, 0, 0, 0, m22, 0, -1, 1, 0, 1 ]);
}
