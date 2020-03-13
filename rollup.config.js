import clear from 'rollup-plugin-clear';
import resolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import filesize from 'rollup-plugin-filesize';
import copy from 'rollup-plugin-copy';
import command from 'rollup-plugin-command';
import visualizer from 'rollup-plugin-visualizer';

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
            name: 'Phaser4Nano',
            sourcemap: false,
            plugins: [
                filesize()
            ]
        },
        {
            file: './dist/Phaser4Nano.min.js',
            format: 'umd',
            name: 'Phaser4Nano',
            sourcemap: false,
            plugins: [
                terser(),

                command([
                    `echo "Running tsc ..."`,
                    `tsc`
                ])
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

        copy({
            targets: [
                { src: 'dist.package.json', dest: 'dist', rename: 'package.json' }
            ]
        }),

        visualizer({
            "title": "Phaser 4 Nano Package Stats",
            "sourcemap": false,
            "template": "treemap" // "circlepacking"
        })

    ]

};