export default function IsPowerOfTwo (width: number, height: number): boolean
{
    if (width < 1 || height < 1)
    {
        return false;
    }

    return ((width & (width - 1)) === 0) && ((height & (height - 1)) === 0);
}
