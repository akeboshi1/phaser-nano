import Texture from './Texture';
import Frame from './Frame';

/**
 * Read an integer value from an XML Node.
 *
 * @function getValue
 * @since 3.0.0
 * @private
 *
 * @param {Node} node - The XML Node.
 * @param {string} attribute - The attribute to read.
 *
 * @return {integer} The parsed value.
 */
function getValue (node: any, attribute: string): number
{
    return parseInt(node.getAttribute(attribute), 10);
}

export default function BitmapTextParser (texture: Texture, xml: XMLDocument, frame?: Frame)
{
    const xSpacing = 0;
    const ySpacing = 0;

    const info = xml.getElementsByTagName('info')[0];
    const common = xml.getElementsByTagName('common')[0];

    const data = {
        font: info.getAttribute('face'),
        size: getValue(info, 'size'),
        lineHeight: getValue(common, 'lineHeight') + ySpacing,
        chars: {}
    };

    const letters = xml.getElementsByTagName('char');

    // var adjustForTrim = (frame !== undefined && frame.trimmed);

    // if (adjustForTrim)
    // {
    //     var top = frame.height;
    //     var left = frame.width;
    // }

    for (let i: number = 0; i < letters.length; i++)
    {
        let node = letters[i];

        let charCode = getValue(node, 'id');
        let x = getValue(node, 'x');
        let y = getValue(node, 'y');
        let width = getValue(node, 'width');
        let height = getValue(node, 'height');

        //  Handle frame trim issues

        // if (adjustForTrim)
        // {
        //     if (gx < left)
        //     {
        //         left = gx;
        //     }

        //     if (gy < top)
        //     {
        //         top = gy;
        //     }
        // }

        data.chars[charCode] =
        {
            x,
            y,
            width,
            height,
            // centerX: Math.floor(width / 2),
            // centerY: Math.floor(height / 2),
            xOffset: getValue(node, 'xoffset'),
            yOffset: getValue(node, 'yoffset'),
            xAdvance: getValue(node, 'xadvance') + xSpacing,
            // data: {},
            kerning: {}
        };

        texture.add(charCode, x, y, width, height);
    }

    /*
    if (adjustForTrim && top !== 0 && left !== 0)
    {
        //  Now we know the top and left coordinates of the glyphs in the original data
        //  so we can work out how much to adjust the glyphs by

        for (var code in data.chars)
        {
            var glyph = data.chars[code];

            glyph.x -= frame.x;
            glyph.y -= frame.y;
        }
    }
    */

    const kernings = xml.getElementsByTagName('kerning');

    for (let i: number = 0; i < kernings.length; i++)
    {
        let kern = kernings[i];

        let first = getValue(kern, 'first');
        let second = getValue(kern, 'second');
        let amount = getValue(kern, 'amount');

        data.chars[second].kerning[first] = amount;
    }

    return data;
}
