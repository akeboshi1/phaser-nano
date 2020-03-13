import clear from 'rollup-plugin-clear';
import resolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import filesize from 'rollup-plugin-filesize';
// import banner from 'rollup-plugin-banner';
// import path from 'path';

const extensions = [
    '.js', '.jsx', '.ts', '.tsx'
];

export default {

    input: './src/index.ts',

    output: [
        {
            file: './dist/Phaser4Nano.esm.js',
            format: 'es',
            sourcemap: true
        },
        {
            file: './dist/Phaser4Nano.js',
            format: 'umd',
            name: 'Phaser4Nano'
        },
        {
            file: './dist/Phaser4Nano.min.js',
            format: 'umd',
            name: 'Phaser4Nano',
            plugins: [ terser() ]
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

        clear({
            targets: [ './dist '],
            watch: true
        }),

        resolve({
            extensions
        }),

        typescript({
            tsconfig: './tsconfig.json'
        }),

        //  Messes-up the sourcemap
        // banner({
        //     file: path.join(__dirname, 'banner.txt'),
        //     encoding: 'utf-8'
        // }),

        //  Current version requires onwarn override handler
        filesize()

    ]

};