import resolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import filesize from 'rollup-plugin-filesize';

const extensions = [
    '.js', '.jsx', '.ts', '.tsx'
];

export default {

    input: './examples/index.ts',

    output: [
        {
            file: './examples/index.min.js',
            format: 'iife',
            name: 'Phaser4NanoExample',
            sourcemap: true,
            plugins: [
                terser(),
                filesize()
            ]
        }
    ],

    onwarn: (warning, next) =>
    {
        if (warning.code === 'DEPRECATED_FEATURE')
        {
            return;
        }
        else
        {
            next(warning);
        }
    },

    plugins: [

        resolve({
            extensions
        }),

        typescript({
            tsconfig: './examples.tsconfig.json'
        })

    ]

};