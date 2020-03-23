import IMatrix2d from './IMatrix2d';

export default function Matrix2dEqual (mat1: IMatrix2d, mat2: IMatrix2d): boolean
{
    return (
        mat1.a === mat2.a &&
        mat1.b === mat2.b &&
        mat1.c === mat2.c &&
        mat1.d === mat2.d &&
        mat1.tx === mat2.tx &&
        mat1.ty === mat2.ty
    );
}
