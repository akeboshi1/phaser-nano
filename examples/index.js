(function () {
    'use strict';

    function DOMContentLoaded(callback) {
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            callback();
            return;
        }
        const check = () => {
            document.removeEventListener('deviceready', check, true);
            document.removeEventListener('DOMContentLoaded', check, true);
            window.removeEventListener('load', check, true);
            callback();
        };
        if (!document.body) {
            window.setTimeout(check, 20);
        }
        else if (window.hasOwnProperty('cordova')) {
            document.addEventListener('deviceready', check, true);
        }
        else {
            document.addEventListener('DOMContentLoaded', check, true);
            window.addEventListener('load', check, true);
        }
    }

    function AddToDOM(element, parent) {
        let target;
        if (parent) {
            if (typeof parent === 'string') {
                //  Hopefully an element ID
                target = document.getElementById(parent);
            }
            else if (typeof parent === 'object' && parent.nodeType === 1) {
                //  Quick test for a HTMLElement
                target = parent;
            }
        }
        else if (element.parentElement) {
            return element;
        }
        //  Fallback, covers an invalid ID and a non HTMLElement object
        if (!target) {
            target = document.body;
        }
        target.appendChild(element);
        return element;
    }

    //  From Pixi v5
    const fragTemplate = [
        'precision mediump float;',
        'void main(void){',
        'float test = 0.1;',
        '%forloop%',
        'gl_FragColor = vec4(0.0);',
        '}',
    ].join('\n');
    function generateSrc(maxIfs) {
        let src = '';
        for (let i = 0; i < maxIfs; ++i) {
            if (i > 0) {
                src += '\nelse ';
            }
            if (i < maxIfs - 1) {
                src += `if(test == ${i}.0){}`;
            }
        }
        return src;
    }
    function CheckShaderMaxIfStatements (maxIfs, gl) {
        const shader = gl.createShader(gl.FRAGMENT_SHADER);
        while (true) {
            const fragmentSrc = fragTemplate.replace(/%forloop%/gi, generateSrc(maxIfs));
            gl.shaderSource(shader, fragmentSrc);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                maxIfs = (maxIfs / 2) | 0;
            }
            else {
                // valid!
                break;
            }
        }
        return maxIfs;
    }

    const shaderSource = {
        fragmentShader: `
precision highp float;

varying vec2 vTextureCoord;
varying float vTextureId;
varying vec4 vTintColor;

uniform sampler2D uTexture[%count%];

void main (void)
{
    vec4 color;

    %forloop%

    gl_FragColor = color * vec4(vTintColor.bgr * vTintColor.a, vTintColor.a);
}`,
        vertexShader: `
precision highp float;

attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;
attribute float aTextureId;
attribute vec4 aTintColor;

uniform mat4 uProjectionMatrix;
uniform mat4 uCameraMatrix;

varying vec2 vTextureCoord;
varying float vTextureId;
varying vec4 vTintColor;

void main (void)
{
    vTextureCoord = aTextureCoord;
    vTextureId = aTextureId;
    vTintColor = aTintColor;

    gl_Position = uProjectionMatrix * uCameraMatrix * vec4(aVertexPosition, 0.0, 1.0);
}`
    };
    class MultiTextureQuadShader {
        constructor(renderer, config = {}) {
            this.renderer = renderer;
            this.gl = renderer.gl;
            const { batchSize = 4096, dataSize = 4, indexSize = 4, vertexElementSize = 6, quadIndexSize = 6, fragmentShader = shaderSource.fragmentShader, vertexShader = shaderSource.vertexShader } = config;
            this.batchSize = batchSize;
            this.dataSize = dataSize;
            this.indexSize = indexSize;
            this.vertexElementSize = vertexElementSize;
            this.vertexByteSize = vertexElementSize * dataSize;
            this.quadByteSize = this.vertexByteSize * 4;
            this.quadElementSize = vertexElementSize * 4;
            this.quadIndexSize = quadIndexSize;
            this.bufferByteSize = batchSize * this.quadByteSize;
            this.createBuffers();
            this.createShaders(fragmentShader, vertexShader);
        }
        createBuffers() {
            let ibo = [];
            //  Seed the index buffer
            for (let i = 0; i < (this.batchSize * this.indexSize); i += this.indexSize) {
                ibo.push(i + 0, i + 1, i + 2, i + 2, i + 3, i + 0);
            }
            this.data = new ArrayBuffer(this.bufferByteSize);
            this.index = new Uint16Array(ibo);
            this.vertexViewF32 = new Float32Array(this.data);
            this.vertexViewU32 = new Uint32Array(this.data);
            const gl = this.gl;
            this.vertexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.data, gl.DYNAMIC_DRAW);
            this.indexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.index, gl.STATIC_DRAW);
            //  Tidy-up
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            ibo = [];
        }
        createShaders(fragmentShaderSource, vertexShaderSource) {
            const gl = this.gl;
            const maxTextures = this.renderer.maxTextures;
            let src = '';
            for (let i = 0; i < maxTextures; i++) {
                if (i > 0) {
                    src += '\n    else ';
                }
                if (i < maxTextures - 1) {
                    src += `if (vTextureId < ${i}.5)`;
                }
                src += '\n    {';
                src += `\n        color = texture2D(uTexture[${i}], vTextureCoord);`;
                src += '\n    }';
            }
            fragmentShaderSource = fragmentShaderSource.replace(/%count%/gi, `${maxTextures}`);
            fragmentShaderSource = fragmentShaderSource.replace(/%forloop%/gi, src);
            //  Create the shaders
            const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(fragmentShader, fragmentShaderSource);
            gl.compileShader(fragmentShader);
            const vertexShader = gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(vertexShader, vertexShaderSource);
            gl.compileShader(vertexShader);
            const program = gl.createProgram();
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);
            gl.useProgram(program);
            this.program = program;
            const vertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
            const vertexTextureCoord = gl.getAttribLocation(program, 'aTextureCoord');
            const vertexTextureIndex = gl.getAttribLocation(program, 'aTextureId');
            const vertexColor = gl.getAttribLocation(program, 'aTintColor');
            const uProjectionMatrix = gl.getUniformLocation(program, 'uProjectionMatrix');
            const uCameraMatrix = gl.getUniformLocation(program, 'uCameraMatrix');
            const uTextureLocation = gl.getUniformLocation(program, 'uTexture');
            gl.enableVertexAttribArray(vertexPosition);
            gl.enableVertexAttribArray(vertexTextureCoord);
            gl.enableVertexAttribArray(vertexTextureIndex);
            gl.enableVertexAttribArray(vertexColor);
            this.attribs = {
                position: vertexPosition,
                textureCoord: vertexTextureCoord,
                textureIndex: vertexTextureIndex,
                color: vertexColor
            };
            this.uniforms = {
                projectionMatrix: uProjectionMatrix,
                cameraMatrix: uCameraMatrix,
                textureLocation: uTextureLocation
            };
        }
        bind(camera) {
            const gl = this.gl;
            const renderer = this.renderer;
            const uniforms = this.uniforms;
            gl.useProgram(this.program);
            gl.uniformMatrix4fv(uniforms.projectionMatrix, false, renderer.projectionMatrix);
            gl.uniformMatrix4fv(uniforms.cameraMatrix, false, camera.matrix);
            gl.uniform1iv(uniforms.textureLocation, renderer.textureIndex);
            this.bindBuffers(this.indexBuffer, this.vertexBuffer);
        }
        bindBuffers(indexBuffer, vertexBuffer) {
            const gl = this.gl;
            const stride = this.vertexByteSize;
            const attribs = this.attribs;
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            //  attributes must be reset whenever you change buffers
            gl.vertexAttribPointer(attribs.position, 2, gl.FLOAT, false, stride, 0); // size = 8
            gl.vertexAttribPointer(attribs.textureCoord, 2, gl.FLOAT, false, stride, 8); // size = 8, offset = position
            gl.vertexAttribPointer(attribs.textureIndex, 1, gl.FLOAT, false, stride, 16); // size = 4, offset = position + tex coord
            gl.vertexAttribPointer(attribs.color, 4, gl.UNSIGNED_BYTE, true, stride, 20); // size = 4, offset = position + tex coord + index
            this.count = 0;
        }
        /*
        batchSpriteBuffer (buffer: SpriteBuffer): boolean
        {
            if (buffer.size > 0)
            {
                this.flush();

                buffer.render();

                //  Restore buffers
                this.bindBuffers(this.indexBuffer, this.vertexBuffer);

                return true;
            }

            return false;
        }
        */
        batchSprite(sprite) {
            if (this.count === this.batchSize) {
                this.flush();
            }
            sprite.updateVertices(this.vertexViewF32, this.vertexViewU32, this.count * this.quadElementSize);
            this.count++;
        }
        flush() {
            const count = this.count;
            if (count === 0) {
                return;
            }
            const gl = this.gl;
            const offset = count * this.quadByteSize;
            if (offset === this.bufferByteSize) {
                gl.bufferData(gl.ARRAY_BUFFER, this.data, gl.DYNAMIC_DRAW);
            }
            else {
                let view = this.vertexViewF32.subarray(0, offset);
                gl.bufferSubData(gl.ARRAY_BUFFER, 0, view);
            }
            gl.drawElements(gl.TRIANGLES, count * this.quadIndexSize, gl.UNSIGNED_SHORT, 0);
            this.count = 0;
        }
    }

    class WebGLRenderer {
        constructor(width, height, resolution = 1) {
            this.contextOptions = {
                alpha: false,
                antialias: false,
                premultipliedAlpha: false,
                stencil: false,
                preserveDrawingBuffer: false
            };
            this.clearColor = [0, 0, 0, 1];
            this.maxTextures = 0;
            this.clearBeforeRender = true;
            this.optimizeRedraw = true;
            this.autoResize = true;
            this.contextLost = false;
            this.width = width;
            this.height = height;
            this.resolution = resolution;
            const canvas = document.createElement('canvas');
            canvas.addEventListener('webglcontextlost', (event) => this.onContextLost(event), false);
            canvas.addEventListener('webglcontextrestored', () => this.onContextRestored(), false);
            this.canvas = canvas;
            this.initContext();
            this.shader = new MultiTextureQuadShader(this);
        }
        initContext() {
            const gl = this.canvas.getContext('webgl', this.contextOptions);
            this.gl = gl;
            this.elementIndexExtension = gl.getExtension('OES_element_index_uint');
            this.getMaxTextures();
            // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/depthFunc
            // gl.enable(gl.DEPTH_TEST);
            // gl.depthFunc(gl.LESS);
            if (this.shader) {
                this.shader.gl = gl;
            }
            this.resize(this.width, this.height, this.resolution);
        }
        resize(width, height, resolution = 1) {
            this.width = width * resolution;
            this.height = height * resolution;
            this.resolution = resolution;
            const canvas = this.canvas;
            canvas.width = this.width;
            canvas.height = this.height;
            if (this.autoResize) {
                canvas.style.width = this.width / resolution + 'px';
                canvas.style.height = this.height / resolution + 'px';
            }
            this.gl.viewport(0, 0, this.width, this.height);
            this.projectionMatrix = this.ortho(width, height, -10000, 10000);
        }
        ortho(width, height, near, far) {
            const m00 = -2 * (1 / -width);
            const m11 = -2 * (1 / height);
            const m22 = 2 * (1 / (near - far));
            return new Float32Array([m00, 0, 0, 0, 0, m11, 0, 0, 0, 0, m22, 0, -1, 1, 0, 1]);
        }
        onContextLost(event) {
            event.preventDefault();
            this.contextLost = true;
        }
        onContextRestored() {
            this.contextLost = false;
            this.initContext();
        }
        setBackgroundColor(color) {
            const clearColor = this.clearColor;
            const r = color >> 16 & 0xFF;
            const g = color >> 8 & 0xFF;
            const b = color & 0xFF;
            const a = (color > 16777215) ? color >>> 24 : 255;
            clearColor[0] = r / 255;
            clearColor[1] = g / 255;
            clearColor[2] = b / 255;
            clearColor[3] = a / 255;
            return this;
        }
        getMaxTextures() {
            const gl = this.gl;
            let maxTextures = CheckShaderMaxIfStatements(gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS), gl);
            //  Create temp textures to stop WebGL errors on mac os
            for (let i = 0; i < maxTextures; i++) {
                let tempTexture = gl.createTexture();
                gl.activeTexture(gl.TEXTURE0 + i);
                gl.bindTexture(gl.TEXTURE_2D, tempTexture);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
            }
            this.maxTextures = maxTextures;
            this.textureIndex = Array.from(Array(maxTextures).keys());
            this.activeTextures = Array(maxTextures);
            this.currentActiveTexture = 0;
            this.startActiveTexture = 0;
        }
        isSizePowerOfTwo(width, height) {
            if (width < 1 || height < 1) {
                return false;
            }
            return ((width & (width - 1)) === 0) && ((height & (height - 1)) === 0);
        }
        createGLTexture(source) {
            const gl = this.gl;
            const glTexture = gl.createTexture();
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, glTexture);
            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            const pot = this.isSizePowerOfTwo(source.width, source.height);
            const wrap = (pot) ? gl.REPEAT : gl.CLAMP_TO_EDGE;
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap);
            if (pot) {
                gl.generateMipmap(gl.TEXTURE_2D);
            }
            return glTexture;
        }
        render(sceneList, dirtyFrame) {
            if (this.contextLost) {
                return;
            }
            const gl = this.gl;
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            if (this.optimizeRedraw && dirtyFrame === 0) {
                return;
            }
            this.currentActiveTexture = 0;
            this.startActiveTexture++;
            const shader = this.shader;
            //  CLS
            gl.viewport(0, 0, this.width, this.height);
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
            const cls = this.clearColor;
            if (this.clearBeforeRender) {
                gl.clearColor(cls[0], cls[1], cls[2], cls[3]);
                gl.clear(gl.COLOR_BUFFER_BIT);
            }
            const maxTextures = this.maxTextures;
            const activeTextures = this.activeTextures;
            const startActiveTexture = this.startActiveTexture;
            for (let c = 0; c < sceneList.length; c += 2) {
                let camera = sceneList[c];
                let list = sceneList[c + 1];
                //  TODO - This only needs binding if
                //  the camera matrix is different to before
                shader.bind(camera);
                //  Process the render list
                for (let i = 0; i < list.length; i++) {
                    let entity = list[i];
                    let texture = entity.texture;
                    if (texture.glIndexCounter < startActiveTexture) {
                        texture.glIndexCounter = startActiveTexture;
                        if (this.currentActiveTexture < maxTextures) {
                            //  Make this texture active
                            activeTextures[this.currentActiveTexture] = texture;
                            texture.glIndex = this.currentActiveTexture;
                            gl.activeTexture(gl.TEXTURE0 + this.currentActiveTexture);
                            gl.bindTexture(gl.TEXTURE_2D, texture.glTexture);
                            this.currentActiveTexture++;
                        }
                    }
                    /*
                    if (entity.type === 'SpriteBuffer')
                    {
                        if (shader.batchSpriteBuffer(entity as SpriteBuffer))
                        {
                            //  Reset active textures
                            this.currentActiveTexture = 0;
                            this.startActiveTexture++;
                        }
                    }
                    */
                    shader.batchSprite(entity);
                }
                //  This only needs flushing if the next
                //  Scene has a different camera matrix
                shader.flush();
            }
        }
    }

    class Scene {
        constructor(game, config) {
            this.game = game;
            game.scenes.init(this, config);
        }
    }

    function Install(baseClass, components) {
        let newClass = baseClass;
        components.forEach(component => {
            newClass = component(newClass);
        });
        return newClass;
    }

    function AlphaComponent(Base) {
        return class AlphaComponent extends Base {
            constructor() {
                super(...arguments);
                this._alpha = 1;
            }
            setAlpha(value = 1) {
                if (value !== this._alpha) {
                    this._alpha = value;
                    this.setDirty();
                }
                return this;
            }
            get alpha() {
                return this._alpha;
            }
            set alpha(value) {
                if (value !== this._alpha) {
                    this._alpha = value;
                    this.setDirty();
                }
            }
        };
    }

    function ContainerComponent(Base) {
        return class ContainerComponent extends Base {
            constructor(...args) {
                super(args);
                this.children = [];
                this.isParent = true;
            }
            getChildren() {
                return this.children;
            }
            addChild(...child) {
                child.forEach((entity) => {
                    this.addChildAt(entity, this.children.length);
                });
                return this;
            }
            addChildAt(child, index) {
                if (index >= 0 && index <= this.children.length) {
                    if (child.parent) {
                        child.parent.removeChild(child);
                    }
                    child.setParent(this);
                    this.children.splice(index, 0, child);
                    child.updateTransform();
                }
                return child;
            }
            swapChildren(child1, child2) {
                if (child1 === child2) {
                    return this;
                }
                const index1 = this.getChildIndex(child1);
                const index2 = this.getChildIndex(child2);
                if (index1 < 0 || index2 < 0) {
                    throw new Error('swap: Both children must belong to the same parent');
                }
                this.children[index1] = child2;
                this.children[index2] = child1;
                return this;
            }
            getChildIndex(child) {
                const index = this.children.indexOf(child);
                if (index === -1) {
                    throw new Error('Supplied DisplayObject not child of the caller');
                }
                return index;
            }
            setChildIndex(child, index) {
                const children = this.children;
                if (index < 0 || index >= children.length) {
                    throw new Error('Index ' + index + ' out of bounds');
                }
                const currentIndex = this.getChildIndex(child);
                children.splice(currentIndex, 1);
                children.splice(index, 0, child);
                return this;
            }
            getChildAt(index) {
                if (index < 0 || index >= this.numChildren) {
                    throw new Error('Index ' + index + ' out of bounds');
                }
                return this.children[index];
            }
            removeChild(child) {
                const index = this.children.indexOf(child);
                if (index === -1) {
                    return;
                }
                return this.removeChildAt(index);
            }
            removeChildAt(index) {
                const child = this.getChildAt(index);
                if (child) {
                    child.parent = undefined;
                    child.updateTransform();
                    this.children.splice(index, 1);
                }
                return child;
            }
            removeChildren(beginIndex = 0, endIndex) {
                const children = this.children;
                if (endIndex === undefined) {
                    endIndex = children.length;
                }
                const range = endIndex - beginIndex;
                if (range > 0 && range <= endIndex) {
                    const removed = children.splice(beginIndex, range);
                    removed.forEach((child) => {
                        child.parent = undefined;
                        child.updateTransform();
                    });
                    return removed;
                }
                else if (range === 0 && children.length === 0) {
                    return [];
                }
                else {
                    throw new Error('Range Error. Values out of bounds');
                }
            }
            update(dt, now) {
                const children = this.children;
                for (let i = 0; i < children.length; i++) {
                    children[i].update(dt, now);
                }
            }
            get numChildren() {
                return this.children.length;
            }
        };
    }

    function DirtyComponent(Base) {
        return class DirtyComponent extends Base {
            constructor() {
                super(...arguments);
                this.dirty = true;
                this.dirtyFrame = 0;
            }
            setDirty(setFrame = true) {
                this.dirty = true;
                if (setFrame) {
                    this.dirtyFrame = this.scene.game.frame;
                }
                return this;
            }
        };
    }

    function InputComponent(Base) {
        return class InputComponent extends Base {
            constructor() {
                super(...arguments);
                this.inputEnabled = false;
                this.inputEnabledChildren = true;
            }
            setInteractive(hitArea) {
                this.inputEnabled = true;
                this.inputHitArea = hitArea;
                this.inputEnabledChildren = true;
                return this;
            }
        };
    }

    class Vec2 {
        /**
         * Creates an instance of a Vector2.
         *
         * @param {number} [x=0] - X component
         * @param {number} [y=0] - Y component
         * @memberof Vec2
         */
        constructor(x = 0, y = 0) {
            this.set(x, y);
        }
        /**
         * Sets the components of this Vector2.
         *
         * @param {number} [x=0] - X component
         * @param {number} [y=0] - Y component
         * @returns {Vec2}
         * @memberof Vec2
         */
        set(x = 0, y = 0) {
            this.x = x;
            this.y = y;
            return this;
        }
        /**
         * Sets all components of this Vector2 to zero.
         *
         * @returns {Vec2}
         * @memberof Vec2
         */
        zero() {
            return this.set();
        }
        /**
         * Returns a new array containg the Vector2 component values.
         *
         * @returns {number[]}
         * @memberof Vec2
         */
        getArray() {
            return [this.x, this.y];
        }
        /**
         * Sets the values of this Vector2 based on the given array, or array-like object, such as a Float32.
         *
         * The source must have 2 elements, starting from index 0 through to index 1.
         *
         * @param {number[]} src - The source array to copy the values from.
         * @returns {Vec2}
         * @memberof Vec2
         */
        fromArray(src) {
            return this.set(src[0], src[1]);
        }
        [Symbol.iterator]() {
            const data = this.getArray();
            return data[Symbol.iterator]();
        }
    }

    function OriginComponent(Base) {
        return class OriginComponent extends Base {
            constructor() {
                super(...arguments);
                this._origin = new Vec2(0.5, 0.5);
            }
            setOrigin(originX, originY = originX) {
                this._origin.set(originX, originY);
                return this;
            }
            get originX() {
                return this._origin.x;
            }
            set originX(value) {
                this._origin.x = value;
            }
            get originY() {
                return this._origin.y;
            }
            set originY(value) {
                this._origin.y = value;
            }
        };
    }

    function ParentComponent(Base) {
        return class ParentComponent extends Base {
            constructor() {
                super(...arguments);
                this.isParent = false;
            }
            setParent(parent) {
                this.parent = parent;
                return this;
            }
            update(dt, now) {
                //  Left blank to be overridden by custom classes
            }
        };
    }

    function PositionComponent(Base) {
        return class PositionComponent extends Base {
            constructor() {
                super(...arguments);
                this._position = new Vec2();
            }
            setPosition(x, y = x) {
                this._position.set(x, y);
                return this.updateTransform();
            }
            set x(value) {
                this._position.x = value;
                this.updateTransform();
            }
            get x() {
                return this._position.x;
            }
            set y(value) {
                this._position.y = value;
                this.updateTransform();
            }
            get y() {
                return this._position.y;
            }
        };
    }

    function QuadAlphaComponent(Base) {
        return class QuadAlphaComponent extends Base {
            constructor(...args) {
                super(args);
                this._alpha = 1;
                this.vertexAlpha = new Float32Array(4).fill(1);
            }
            setAlpha(topLeft = 1, topRight = topLeft, bottomLeft = topLeft, bottomRight = topLeft) {
                const alpha = this.vertexAlpha;
                alpha[0] = topLeft;
                alpha[1] = topRight;
                alpha[2] = bottomLeft;
                alpha[3] = bottomRight;
                return this.packColors();
            }
            get alpha() {
                return this._alpha;
            }
            set alpha(value) {
                this._alpha = value;
                this.setAlpha(value);
            }
        };
    }

    function QuadTintComponent(Base) {
        return class QuadTintComponent extends Base {
            constructor(...args) {
                super(args);
                this._tint = 0xffffff;
                this.vertexTint = new Uint32Array(4).fill(0xffffff);
            }
            setTint(topLeft = 0xffffff, topRight = topLeft, bottomLeft = topLeft, bottomRight = topLeft) {
                const tint = this.vertexTint;
                tint[0] = topLeft;
                tint[1] = topRight;
                tint[2] = bottomLeft;
                tint[3] = bottomRight;
                return this.packColors();
            }
            get tint() {
                return this._tint;
            }
            set tint(value) {
                this._tint = value;
                this.setTint(value);
            }
        };
    }

    function RenderableComponent(Base) {
        return class RenderableComponent extends Base {
            constructor() {
                super(...arguments);
                this.renderable = true;
            }
            setRenderable(value) {
                this.renderable = value;
                return this;
            }
            willRender() {
                return (this.visible && this.renderable && this.alpha > 0 && this.hasTexture);
            }
        };
    }

    function RotationComponent(Base) {
        return class RotationComponent extends Base {
            constructor() {
                super(...arguments);
                this._rotation = 0;
            }
            setRotation(rotation) {
                if (rotation !== this._rotation) {
                    this._rotation = rotation;
                    this.updateCache();
                }
                return this;
            }
            set rotation(value) {
                if (value !== this._rotation) {
                    this._rotation = value;
                    this.updateCache();
                }
            }
            get rotation() {
                return this._rotation;
            }
        };
    }

    function ScaleComponent(Base) {
        return class ScaleComponent extends Base {
            constructor() {
                super(...arguments);
                this._scale = new Vec2(1, 1);
            }
            setScale(scaleX, scaleY = scaleX) {
                this._scale.set(scaleX, scaleY);
                return this.updateCache();
            }
            set scaleX(value) {
                if (value !== this._scale.x) {
                    this._scale.x = value;
                    this.updateCache();
                }
            }
            get scaleX() {
                return this._scale.x;
            }
            set scaleY(value) {
                if (value !== this._scale.y) {
                    this._scale.y = value;
                    this.updateCache();
                }
            }
            get scaleY() {
                return this._scale.y;
            }
        };
    }

    function SceneComponent(Base) {
        return class SceneComponent extends Base {
            setScene(scene) {
                this.scene = scene;
                return this;
            }
        };
    }

    function SizeComponent(Base) {
        return class SizeComponent extends Base {
            setSize(width, height) {
                this.width = width;
                this.height = height;
                return this;
            }
        };
    }

    function SkewComponent(Base) {
        return class SkewComponent extends Base {
            constructor() {
                super(...arguments);
                this._skew = new Vec2(0, 0);
            }
            setSkew(skewX, skewY = skewX) {
                this._skew.set(skewX, skewY);
                return this.updateCache();
            }
            set skewX(value) {
                if (value !== this._skew.x) {
                    this._skew.x = value;
                    this.updateCache();
                }
            }
            get skewX() {
                return this._skew.x;
            }
            set skewY(value) {
                if (value !== this._skew.y) {
                    this._skew.y = value;
                    this.updateCache();
                }
            }
            get skewY() {
                return this._skew.y;
            }
        };
    }

    class Frame {
        constructor(texture, key, x, y, width, height) {
            this.trimmed = false;
            this.texture = texture;
            this.key = key;
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.sourceSizeWidth = width;
            this.sourceSizeHeight = height;
            this.updateUVs();
        }
        setPivot(x, y) {
            this.pivot = { x, y };
        }
        setSourceSize(width, height) {
            this.sourceSizeWidth = width;
            this.sourceSizeHeight = height;
        }
        setTrim(width, height, x, y, w, h) {
            this.trimmed = true;
            this.sourceSizeWidth = width;
            this.sourceSizeHeight = height;
            this.spriteSourceSizeX = x;
            this.spriteSourceSizeY = y;
            this.spriteSourceSizeWidth = w;
            this.spriteSourceSizeHeight = h;
        }
        updateUVs() {
            const { x, y, width, height } = this;
            const baseTextureWidth = this.texture.width;
            const baseTextureHeight = this.texture.height;
            this.u0 = x / baseTextureWidth;
            this.v0 = y / baseTextureHeight;
            this.u1 = (x + width) / baseTextureWidth;
            this.v1 = (y + height) / baseTextureHeight;
        }
    }

    class Texture {
        constructor(key, image) {
            this.glIndex = 0;
            this.glIndexCounter = -1;
            this.key = key;
            this.image = image;
            this.width = image.width;
            this.height = image.height;
            this.frames = new Map();
            this.add('__BASE', 0, 0, image.width, image.height);
        }
        add(key, x, y, width, height) {
            if (this.frames.has(key)) {
                return null;
            }
            let frame = new Frame(this, key, x, y, width, height);
            this.frames.set(key, frame);
            if (!this.firstFrame || this.firstFrame.key === '__BASE') {
                this.firstFrame = frame;
            }
            return frame;
        }
        get(key) {
            //  null, undefined, empty string, zero
            if (!key) {
                return this.firstFrame;
            }
            if (key instanceof Frame) {
                key = key.key;
            }
            let frame = this.frames.get(key);
            if (!frame) {
                console.warn('Texture.frame missing: ' + key);
                frame = this.firstFrame;
            }
            return frame;
        }
        getFrames(frames) {
            const output = [];
            frames.forEach((key) => {
                output.push(this.get(key));
            });
            return output;
        }
        getFramesInRange(prefix, start, end, zeroPad = 0, suffix = '') {
            const frameKeys = [];
            const diff = (start < end) ? 1 : -1;
            //  Adjust because we use i !== end in the for loop
            end += diff;
            for (let i = start; i !== end; i += diff) {
                frameKeys.push(prefix + i.toString().padStart(zeroPad, '0') + suffix);
            }
            return this.getFrames(frameKeys);
        }
    }

    function TextureComponent(Base) {
        return class TextureComponent extends Base {
            constructor() {
                super(...arguments);
                this.hasTexture = false;
                this._prevTextureID = -1;
            }
            setTexture(key, frame) {
                if (key instanceof Texture) {
                    this.texture = key;
                }
                else {
                    this.texture = this.scene.game.textures.get(key);
                }
                if (!this.texture) {
                    console.warn('Invalid Texture key: ' + key);
                }
                else {
                    this.setFrame(frame);
                }
                return this;
            }
            setFrame(key) {
                const frame = this.texture.get(key);
                if (frame === this.frame) {
                    return this;
                }
                this.frame = frame;
                this.setSize(frame.sourceSizeWidth, frame.sourceSizeHeight);
                if (frame.pivot) {
                    this.setOrigin(frame.pivot.x, frame.pivot.y);
                }
                const data = this.vertexData;
                //  This rarely changes, so we'll set it here, rather than every game step:
                data[2] = frame.u0;
                data[3] = frame.v0;
                data[8] = frame.u0;
                data[9] = frame.v1;
                data[14] = frame.u1;
                data[15] = frame.v1;
                data[20] = frame.u1;
                data[21] = frame.v0;
                this.setDirty();
                this.hasTexture = true;
                return this;
            }
        };
    }

    function LocalToGlobal(transform, x, y, outPoint = new Vec2()) {
        const { a, b, c, d, tx, ty } = transform;
        outPoint.x = (a * x) + (c * y) + tx;
        outPoint.y = (b * x) + (d * y) + ty;
        return outPoint;
    }

    function GlobalToLocal(transform, x, y, outPoint = new Vec2()) {
        const { a, b, c, d, tx, ty } = transform;
        const id = 1 / ((a * d) + (c * -b));
        outPoint.x = (d * id * x) + (-c * id * y) + (((ty * c) - (tx * d)) * id);
        outPoint.y = (a * id * y) + (-b * id * x) + (((-ty * a) + (tx * b)) * id);
        return outPoint;
    }

    function TransformComponent(Base) {
        return class TransformComponent extends Base {
            constructor(...args) {
                super(args);
                this.localTransform = { a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0 };
                this.worldTransform = { a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0 };
            }
            updateCache() {
                const transform = this.localTransform;
                const { rotation, skewX, skewY, scaleX, scaleY } = this;
                transform.a = Math.cos(rotation + skewY) * scaleX;
                transform.b = Math.sin(rotation + skewY) * scaleX;
                transform.c = -Math.sin(rotation - skewX) * scaleY;
                transform.d = Math.cos(rotation - skewX) * scaleY;
                return this.updateTransform();
            }
            updateTransform() {
                this.setDirty();
                const parent = this.parent;
                const lt = this.localTransform;
                const wt = this.worldTransform;
                lt.tx = this.x;
                lt.ty = this.y;
                if (!parent) {
                    wt.a = lt.a;
                    wt.b = lt.b;
                    wt.c = lt.c;
                    wt.d = lt.d;
                    wt.tx = lt.tx;
                    wt.ty = lt.ty;
                    return this;
                }
                const pt = parent.worldTransform;
                let { a, b, c, d, tx, ty } = lt;
                wt.a = a * pt.a + b * pt.c;
                wt.b = a * pt.b + b * pt.d;
                wt.c = c * pt.a + d * pt.c;
                wt.d = c * pt.b + d * pt.d;
                wt.tx = tx * pt.a + ty * pt.c + pt.tx;
                wt.ty = tx * pt.b + ty * pt.d + pt.ty;
                return this;
            }
            localToGlobal(x, y, outPoint = new Vec2()) {
                return LocalToGlobal(this.worldTransform, x, y, outPoint);
            }
            globalToLocal(x, y, outPoint = new Vec2()) {
                return GlobalToLocal(this.worldTransform, x, y, outPoint);
            }
        };
    }

    function VisibleComponent(Base) {
        return class VisibleComponent extends Base {
            constructor() {
                super(...arguments);
                this.visible = true;
            }
            setVisible(value) {
                this.visible = value;
                return this;
            }
        };
    }

    class GameObject extends Install(class {
    }, [
        AlphaComponent,
        DirtyComponent,
        ParentComponent,
        InputComponent,
        OriginComponent,
        PositionComponent,
        RenderableComponent,
        RotationComponent,
        ScaleComponent,
        SceneComponent,
        SizeComponent,
        SkewComponent,
        TransformComponent,
        VisibleComponent
    ]) {
        constructor(scene, x = 0, y = 0) {
            super();
            this.scene = scene;
            this._position.set(x, y);
            this.dirty = true;
            this.name = '';
        }
    }

    class Container extends Install(GameObject, [
        ContainerComponent
    ]) {
        constructor(scene, x = 0, y = 0) {
            super();
            this.setScene(scene);
            this.setPosition(x, y);
        }
        update(dt, now) {
            const children = this.children;
            for (let i = 0; i < children.length; i++) {
                children[i].update(dt, now);
            }
        }
        updateTransform() {
            super.updateTransform();
            const children = this.children;
            for (let i = 0; i < children.length; i++) {
                children[i].updateTransform();
            }
            return this;
        }
    }

    class Camera extends GameObject {
        constructor(scene, x = 0, y = 0) {
            super(scene, x, y);
            this.renderer = scene.game.renderer;
            this.matrix = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
            this.setSize(this.renderer.width, this.renderer.height);
        }
        updateTransform() {
            this.setDirty();
            const lt = this.localTransform;
            const wt = this.worldTransform;
            lt.tx = this.x;
            lt.ty = this.y;
            const mat = this.matrix;
            const { a, b, c, d, tx, ty } = lt;
            const viewportW = this.renderer.width * this.originX;
            const viewportH = this.renderer.height * this.originY;
            mat[0] = a;
            mat[1] = b;
            mat[4] = c;
            mat[5] = d;
            //  combinates viewport translation + scrollX/Y
            mat[12] = (a * -viewportW) + (c * -viewportH) + (viewportW + tx);
            mat[13] = (b * -viewportW) + (d * -viewportH) + (viewportH + ty);
            //  Store in worldTransform
            wt.a = a;
            wt.b = b;
            wt.c = c;
            wt.d = d;
            wt.tx = mat[12];
            wt.ty = mat[13];
            // mat[12] = viewportW + tx; // combines translation to center of viewport + scrollX
            // mat[13] = viewportH + ty; // combines translation to center of viewport + scrollY
            // this.translate(-viewportW, -viewportH);
            // console.log(mat);
            return this;
        }
    }

    class World extends Container {
        constructor(scene, key) {
            super(scene);
            //  How many Game Objects were made dirty this frame?
            this.dirtyFrame = 0;
            //  How many Game Objects were processed this frame?
            this.totalFrame = 0;
            this.name = key;
            this.renderList = [];
            this.camera = new Camera(scene, 0, 0);
        }
        scanChildren(root, gameFrame) {
            const children = root.getChildren();
            for (let i = 0; i < children.length; i++) {
                this.buildRenderList(children[i], gameFrame);
            }
        }
        buildRenderList(root, gameFrame) {
            if (root.willRender()) {
                this.renderList.push(root);
                if (root.dirtyFrame >= gameFrame) {
                    this.dirtyFrame++;
                }
            }
            if (root.isParent) {
                this.scanChildren(root, gameFrame);
            }
        }
        update(dt, now) {
            const children = this.children;
            for (let i = 0; i < children.length; i++) {
                children[i].update(dt, now);
            }
        }
        render(gameFrame) {
            this.dirtyFrame = 0;
            this.renderList.length = 0;
            this.scanChildren(this, gameFrame);
            this.totalFrame = this.renderList.length;
            if (this.camera.dirtyFrame >= gameFrame) {
                this.dirtyFrame++;
            }
            return this.dirtyFrame;
        }
    }

    function NOOP() {
        //  A no-op function is intentially blank
    }

    function GetConfigValue(config, property, defaultValue) {
        if (config[property]) {
            return config[property];
        }
        else {
            return defaultValue;
        }
    }

    function SceneRunner(index, scene, config) {
        return {
            index,
            key: scene.world.name,
            scene,
            active: config.active,
            visible: config.visible,
            boot: GetConfigValue(scene, 'boot', NOOP),
            update: GetConfigValue(scene, 'update', NOOP),
            shutdown: GetConfigValue(scene, 'shutdown', NOOP)
        };
    }

    class EE {
        constructor(callback, context, once = false) {
            this.callback = callback;
            this.context = context;
            this.once = once;
        }
    }
    class EventEmitter {
        constructor() {
            this._events = new Map();
        }
        on(event, callback, context = this, once = false) {
            if (typeof callback !== 'function') {
                throw new TypeError('The listener must be a function');
            }
            const listener = new EE(callback, context, once);
            const listeners = this._events.get(event);
            if (!listeners) {
                this._events.set(event, new Set([listener]));
            }
            else {
                listeners.add(listener);
            }
            return this;
        }
        once(event, callback, context = this) {
            return this.on(event, callback, context, true);
        }
        /**
         * Clear an event by name.
         */
        clearEvent(event) {
            this._events.delete(event);
            return this;
        }
        /**
         * Return an array listing the events for which the emitter has registered listeners.
         */
        eventNames() {
            return [...this._events.keys()];
        }
        /**
         * Return the listeners registered for a given event.
         */
        listeners(event) {
            const out = [];
            const listeners = this._events.get(event);
            listeners.forEach((ee) => {
                out.push(ee.callback);
            });
            return out;
        }
        /**
         * Return the number of listeners listening to a given event.
         */
        listenerCount(event) {
            const listeners = this._events.get(event);
            return (listeners) ? listeners.size : 0;
        }
        /**
         * Calls each of the listeners registered for a given event.
         */
        emit(event, ...args) {
            if (!this._events.has(event)) {
                return false;
            }
            const listeners = this._events.get(event);
            for (const ee of listeners) {
                ee.callback.apply(ee.context, args);
                if (ee.once) {
                    listeners.delete(ee);
                }
            }
            if (listeners.size === 0) {
                this._events.delete(event);
            }
            return true;
        }
        /**
         * Remove the listeners of a given event.
         *
         * @param event
         * @param callback
         * @param context
         * @param once
         */
        off(event, callback, context, once) {
            if (!callback) {
                //  Remove all events matching the given key
                this._events.delete(event);
            }
            else {
                const listeners = this._events.get(event);
                const hasContext = !context;
                const hasOnce = (once !== undefined);
                for (const ee of listeners) {
                    if (ee.callback === callback && (hasContext && ee.context === console) && (hasOnce && ee.once === once)) {
                        listeners.delete(ee);
                    }
                }
                if (listeners.size === 0) {
                    this._events.delete(event);
                }
            }
            return this;
        }
        /**
         * Remove all listeners, or those of the specified event.
         *
         * @param event
         */
        removeAllListeners(event) {
            if (!event) {
                this._events.clear();
            }
            else {
                this._events.delete(event);
            }
        }
    }

    class SceneManager extends EventEmitter {
        constructor(game) {
            super();
            //  Flush the cache
            this.flush = false;
            //  How many Game Objects were made dirty this frame across all Scenes?
            this.dirtyFrame = 0;
            //  How many Game Objects were processed this frame across all Scenes?
            this.totalFrame = 0;
            this.sceneIndex = 0;
            this._isDuplicate = false;
            this.game = game;
            this.classes = new Map();
            this.scenes = new Map();
            this.renderList = [];
            this.on('init', this.init, this);
        }
        boot(scenes) {
            scenes.forEach((scene) => {
                this.add(scene);
            });
        }
        init(scene, config = {}) {
            const sceneIndex = this.sceneIndex;
            const sceneConfig = {
                index: sceneIndex,
                key: '',
                active: false,
                visible: false
            };
            const size = this.scenes.size;
            if (typeof config === 'string') {
                sceneConfig.key = config;
                if (size === 0) {
                    //  First Scene is always active (unless specifically set otherwise)
                    sceneConfig.active = true;
                    sceneConfig.visible = true;
                }
            }
            else if (config || (!config && size === 0)) {
                sceneConfig.key = GetConfigValue(config, 'key', 'scene' + sceneIndex);
                sceneConfig.active = GetConfigValue(config, 'active', (size === 0));
                sceneConfig.visible = GetConfigValue(config, 'visible', sceneConfig.active);
            }
            if (this._tempKey) {
                sceneConfig.key = this._tempKey;
                //  Test then reset
                this._tempKey = null;
            }
            if (this.keyExists(sceneConfig.key)) {
                console.warn('Cannot add scene with duplicate key: ' + sceneConfig.key);
            }
            else {
                scene.game = this.game;
                scene.world = new World(scene, sceneConfig.key);
                if (!this._isDuplicate) {
                    this.classes.set(sceneConfig.key, this._tempScene);
                    //  Test then reset
                    this._isDuplicate = false;
                }
                this.scenes.set(SceneRunner(sceneIndex, scene, sceneConfig), scene);
                this.flush = true;
                this.sceneIndex++;
            }
            // console.log('SceneManager.init', sceneConfig);
        }
        add(scene, newKey) {
            this._tempScene = scene;
            this._tempKey = newKey;
            // console.log('SceneManager.add', scene, newKey);
            scene = new scene(this.game);
            return scene;
        }
        update(delta, now) {
            for (const [sceneRunner, scene] of this.scenes) {
                if (sceneRunner.active) {
                    sceneRunner.update.call(sceneRunner.scene, delta, now);
                    scene.world.update(delta, now);
                }
            }
        }
        render(gameFrame) {
            const renderList = this.renderList;
            renderList.length = 0;
            this.dirtyFrame = 0;
            this.totalFrame = 0;
            for (const [sceneRunner, scene] of this.scenes) {
                if (sceneRunner.visible) {
                    let world = scene.world;
                    this.dirtyFrame += world.render(gameFrame);
                    this.totalFrame += world.totalFrame;
                    renderList.push(world.camera);
                    renderList.push(world.renderList);
                }
            }
            if (this.flush) {
                //  Break the renderer cache
                this.dirtyFrame++;
                //  And reset
                this.flush = false;
            }
            return this.dirtyFrame;
        }
        getScene(scene) {
            const runner = this.getSceneRunner(scene);
            if (runner) {
                return runner.scene;
            }
        }
        getSceneRunner(scene) {
            const key = this.getSceneKey(scene);
            for (const sceneRunner of this.scenes.keys()) {
                if (sceneRunner.key === key) {
                    return sceneRunner;
                }
            }
        }
        getSceneKey(scene) {
            return (scene instanceof Scene) ? scene.world.name : scene;
        }
        //  Creates a brand new instance of the given Scene and starts it
        spawn(source, newKey, setActive = true) {
            let scene = this.classes.get(source);
            if (scene) {
                // console.log('SceneManager.spawn', scene);
                this._isDuplicate = true;
                const newScene = this.add(scene, newKey);
                if (setActive) {
                    this.wake(newScene);
                }
                return newScene;
            }
        }
        //  Launches an existing instance of a Scene. Scene must already be in the scenes map.
        start(scene, stopScene) {
            const runner = this.getSceneRunner(scene);
            if (runner) {
                scene = runner.scene;
                this.wake(scene);
                //  Boot
                runner.boot.call(scene);
                this.emit('boot', scene);
                if (stopScene) {
                    this.stop(stopScene);
                }
                this.flush = true;
            }
        }
        stop(scene) {
            const runner = this.getSceneRunner(scene);
            if (runner) {
                scene = runner.scene;
                this.sleep(scene);
                //  Shutdown
                runner.shutdown.call(scene);
                this.emit('shutdown', scene);
                this.flush = true;
            }
        }
        sleep(scene) {
            this.setActive(scene, false);
            this.setVisible(scene, false);
            this.flush = true;
        }
        wake(scene) {
            this.setActive(scene);
            this.setVisible(scene);
            this.flush = true;
        }
        setActive(scene, active = true) {
            const runner = this.getSceneRunner(scene);
            if (runner) {
                runner.active = active;
            }
        }
        setVisible(scene, visible = true) {
            const runner = this.getSceneRunner(scene);
            if (runner) {
                runner.visible = visible;
            }
        }
        keyExists(scene) {
            const key = this.getSceneKey(scene);
            for (const sceneRunner of this.scenes.keys()) {
                if (sceneRunner.key === key) {
                    return true;
                }
            }
            return false;
        }
        getTotal() {
            return this.scenes.size;
        }
    }

    class TextureManager {
        constructor(game) {
            this.game = game;
            this.textures = new Map();
        }
        get(key) {
            if (this.textures.has(key)) {
                return this.textures.get(key);
            }
            else {
                return this.textures.get('__MISSING');
            }
        }
        has(key) {
            return this.textures.has(key);
        }
        add(key, source) {
            let texture;
            if (!this.textures.has(key)) {
                if (source instanceof Texture) {
                    texture = source;
                    texture.key = key;
                }
                else {
                    texture = new Texture(key, source);
                }
                // TODO: Make this happen at render time
                texture.glTexture = this.game.renderer.createGLTexture(texture.image);
                this.textures.set(key, texture);
            }
            return texture;
        }
    }

    class Game extends EventEmitter {
        constructor(config) {
            super();
            this.VERSION = '4.0.0-beta1';
            this.isPaused = false;
            this.isBooted = false;
            this.lifetime = 0;
            this.elapsed = 0;
            //  The current game frame
            this.frame = 0;
            const { width = 800, height = 600, backgroundColor = 0x00000, parent = document.body, scene = null } = config;
            this.config = { width, height, backgroundColor, parent, scene };
            this.cache = {
                json: new Map(),
                csv: new Map(),
                xml: new Map()
            };
            DOMContentLoaded(() => this.boot());
        }
        pause() {
            this.isPaused = true;
            this.emit('pause');
        }
        resume() {
            this.isPaused = false;
            this.lastTick = Date.now();
            this.emit('resume');
        }
        boot() {
            const config = this.config;
            this.isBooted = true;
            this.lastTick = Date.now();
            const renderer = new WebGLRenderer(config.width, config.height);
            renderer.setBackgroundColor(config.backgroundColor);
            AddToDOM(renderer.canvas, config.parent);
            this.renderer = renderer;
            this.textures = new TextureManager(this);
            this.scenes = new SceneManager(this);
            this.banner(this.VERSION);
            this.scenes.boot([].concat(config.scene));
            //  Visibility API
            document.addEventListener('visibilitychange', () => {
                this.emit('visibilitychange', document.hidden);
                if (document.hidden) {
                    this.pause();
                }
                else {
                    this.resume();
                }
            });
            // window.addEventListener('blur', () => this.pause());
            // window.addEventListener('focus', () => this.resume());
            this.emit('boot');
            requestAnimationFrame(() => this.step());
        }
        banner(version) {
            console.log('%c %cPhaser Nano v' + version + '%c https://phaser4.io', 'padding: 2px; background: linear-gradient(to right, #00bcc3, #3e0081)', 'padding: 2px 20px 2px 8px; color: #fff; background: linear-gradient(to right, #3e0081 90%, #3e0081 10%, #00bcc3)', '');
            //  Adds ~400 bytes to build size :(
            // console.log(
            //     '%c  %c  %cPhaser Nano v' + version + '%c https://phaser4.io',
            //     'padding: 2px; background: linear-gradient(to right, #00bcc3, #3e0081)',
            //     'padding: 2px; background: #3e0081 url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAJ1BMVEUALon///+9tJQAAABv9v92d2IAn6qHEhL/DQ3/fCUOOlNMPUD/uz24pItZAAAAaElEQVQI12OAA/YCKKPyOANbWgKQUdFZkOLiBmJ0zHIRdAEKWXR0uQimABnWu3elpIEYhoKCYS4ui8EModBQRQMG09AgQSBQBmpvBzOABhYpAYEBg3FpEJAOZgCqAdEGDAzGIACk4QAAsv0aPCHrnowAAAAASUVORK5CYII=) no-repeat;',
            //     'padding: 2px 20px 2px 8px; color: #fff; background: linear-gradient(to right, #3e0081 90%, #3e0081 10%, #00bcc3)',
            //     ''
            // );
        }
        step() {
            const now = Date.now();
            const delta = now - this.lastTick;
            const dt = delta / 1000;
            this.lifetime += dt;
            this.elapsed = dt;
            this.lastTick = now;
            this.emit('step', dt, now);
            const sceneManager = this.scenes;
            if (!this.isPaused) {
                sceneManager.update(dt, now);
            }
            this.emit('update', dt, now);
            const totalDirty = sceneManager.render(this.frame);
            this.renderer.render(sceneManager.renderList, totalDirty);
            this.emit('render', dt, now);
            //  The frame always advances by 1 each step (even when paused)
            this.frame++;
            requestAnimationFrame(() => this.step());
        }
        destroy() {
            //  TODO
        }
    }

    function PackColor (rgb, alpha) {
        let ua = ((alpha * 255) | 0) & 0xFF;
        return ((ua << 24) | rgb) >>> 0;
    }

    class Sprite extends Install(GameObject, [
        ContainerComponent,
        QuadAlphaComponent,
        QuadTintComponent,
        TextureComponent
    ]) {
        constructor(scene, x, y, texture, frame) {
            super();
            this.vertexData = new Float32Array(24).fill(0);
            this.vertexColor = new Uint32Array(4).fill(4294967295);
            this.setScene(scene);
            this.setTexture(texture, frame);
            this.setPosition(x, y);
        }
        packColors() {
            const alpha = this.vertexAlpha;
            const tint = this.vertexTint;
            const color = this.vertexColor;
            //  In lots of cases, this *never* changes, so cache it here:
            color[0] = PackColor(tint[0], alpha[0]);
            color[1] = PackColor(tint[1], alpha[1]);
            color[2] = PackColor(tint[2], alpha[2]);
            color[3] = PackColor(tint[3], alpha[3]);
            this.setDirty();
            return this;
        }
        updateVertices(F32, U32, offset) {
            const data = this.vertexData;
            //  Skip all of this if not dirty
            if (this.dirty) {
                this.dirty = false;
                const frame = this.frame;
                const origin = this._origin;
                let w0;
                let w1;
                let h0;
                let h1;
                const { a, b, c, d, tx, ty } = this.worldTransform;
                if (frame.trimmed) {
                    w1 = frame.spriteSourceSizeX - (origin.x * frame.sourceSizeWidth);
                    w0 = w1 + frame.spriteSourceSizeWidth;
                    h1 = frame.spriteSourceSizeY - (origin.y * frame.sourceSizeHeight);
                    h0 = h1 + frame.spriteSourceSizeHeight;
                }
                else {
                    w1 = -origin.x * frame.sourceSizeWidth;
                    w0 = w1 + frame.sourceSizeWidth;
                    h1 = -origin.y * frame.sourceSizeHeight;
                    h0 = h1 + frame.sourceSizeHeight;
                }
                //  top left
                data[0] = (w1 * a) + (h1 * c) + tx;
                data[1] = (w1 * b) + (h1 * d) + ty;
                //  bottom left
                data[6] = (w1 * a) + (h0 * c) + tx;
                data[7] = (w1 * b) + (h0 * d) + ty;
                //  bottom right
                data[12] = (w0 * a) + (h0 * c) + tx;
                data[13] = (w0 * b) + (h0 * d) + ty;
                //  top right
                data[18] = (w0 * a) + (h1 * c) + tx;
                data[19] = (w0 * b) + (h1 * d) + ty;
            }
            const textureIndex = this.texture.glIndex;
            //  Do we have a different texture ID?
            if (textureIndex !== this._prevTextureID) {
                this._prevTextureID = textureIndex;
                data[4] = textureIndex;
                data[10] = textureIndex;
                data[16] = textureIndex;
                data[22] = textureIndex;
            }
            //  Copy the data to the array buffer
            F32.set(data, offset);
            const color = this.vertexColor;
            //  Copy the vertex colors to the Uint32 view (as the data copy above overwrites them)
            U32[offset + 5] = color[0];
            U32[offset + 11] = color[2];
            U32[offset + 17] = color[3];
            U32[offset + 23] = color[1];
        }
    }
    /*
        vertexData array structure:

        0 = topLeft.x
        1 = topLeft.y
        2 = frame.u0
        3 = frame.v0
        4 = textureIndex
        5 = topLeft.packedColor

        6 = bottomLeft.x
        7 = bottomLeft.y
        8 = frame.u0
        9 = frame.v1
        10 = textureIndex
        11 = bottomLeft.packedColor

        12 = bottomRight.x
        13 = bottomRight.y
        14 = frame.u1
        15 = frame.v1
        16 = textureIndex
        17 = bottomRight.packedColor

        18 = topRight.x
        19 = topRight.y
        20 = frame.u1
        21 = frame.v0
        22 = textureIndex
        23 = topRight.packedColor
    */

    class File {
        constructor(key, url, config) {
            this.responseType = 'text';
            this.crossOrigin = undefined;
            this.skipCache = false;
            this.hasLoaded = false;
            this.key = key;
            this.url = url;
            this.config = config;
        }
    }

    function ImageTagLoader(file) {
        file.data = new Image();
        if (file.crossOrigin) {
            file.data.crossOrigin = file.crossOrigin;
        }
        return new Promise((resolve, reject) => {
            file.data.onload = () => {
                if (file.data.onload) {
                    file.data.onload = null;
                    file.data.onerror = null;
                    resolve(file);
                }
            };
            file.data.onerror = (event) => {
                if (file.data.onload) {
                    file.data.onload = null;
                    file.data.onerror = null;
                    file.error = event;
                    reject(file);
                }
            };
            file.data.src = file.url;
            // Image is immediately-available or cached
            if (file.data.complete && file.data.width && file.data.height) {
                file.data.onload = null;
                file.data.onerror = null;
                resolve(file);
            }
        });
    }

    function GetURL(key, url, extension, loader) {
        if (!url) {
            url = key + extension;
        }
        if (url.match(/^(?:blob:|data:|http:\/\/|https:\/\/|\/\/)/)) {
            return url;
        }
        else {
            if (loader) {
                return loader.baseURL + loader.path + url;
            }
            else {
                return url;
            }
        }
    }

    function ImageFile(game, key, url) {
        const file = new File(key, url);
        file.load = () => {
            file.url = GetURL(file.key, file.url, '.png', file.loader);
            if (file.loader) {
                file.crossOrigin = file.loader.crossOrigin;
            }
            return new Promise((resolve, reject) => {
                ImageTagLoader(file).then(file => {
                    game.textures.add(key, file.data);
                    resolve(file);
                }).catch(file => {
                    reject(file);
                });
            });
        };
        return file;
    }

    class Loader extends EventEmitter {
        constructor(game) {
            super();
            this.baseURL = '';
            this.path = '';
            this.crossOrigin = 'anonymous';
            //  -1 means load everything at once
            this.maxParallelDownloads = -1;
            this.isLoading = false;
            this.game = game;
            this.reset();
        }
        reset() {
            this.isLoading = false;
            this.queue = new Set();
            this.inflight = new Set();
            this.completed = new Set();
            this.progress = 0;
        }
        add(...file) {
            file.forEach(entity => {
                entity.loader = this;
                this.queue.add(entity);
            });
            return this;
        }
        start(onComplete) {
            if (this.isLoading) {
                return;
            }
            this.completed.clear();
            this.progress = 0;
            if (this.queue.size > 0) {
                this.isLoading = true;
                this.onComplete = onComplete;
                this.emit('start');
                this.nextFile();
            }
            else {
                this.progress = 1;
                this.emit('complete');
                onComplete();
            }
            return this;
        }
        nextFile() {
            let limit = this.queue.size;
            if (this.maxParallelDownloads !== -1) {
                limit = Math.min(limit, this.maxParallelDownloads) - this.inflight.size;
            }
            if (limit) {
                // console.log('Batching', limit, 'files to download');
                const iterator = this.queue.values();
                while (limit > 0) {
                    const file = iterator.next().value;
                    // console.log('Loader.nextFile', file.key, '=>', file.url);
                    this.inflight.add(file);
                    this.queue.delete(file);
                    file.load().then((file) => this.fileComplete(file)).catch((file) => this.fileError(file));
                    limit--;
                }
            }
            else if (this.inflight.size === 0) {
                this.stop();
            }
        }
        stop() {
            this.isLoading = false;
            this.emit('complete', this.completed);
            this.onComplete();
            this.completed.clear();
        }
        updateProgress(file) {
            this.inflight.delete(file);
            this.completed.add(file);
            const totalCompleted = this.completed.size;
            const totalQueued = this.queue.size + this.inflight.size;
            if (totalCompleted > 0) {
                this.progress = totalCompleted / (totalCompleted + totalQueued);
            }
            this.emit('progress', this.progress, totalCompleted, totalQueued);
            this.nextFile();
        }
        fileComplete(file) {
            this.emit('filecomplete', file);
            this.updateProgress(file);
        }
        fileError(file) {
            this.emit('fileerror', file);
            this.updateProgress(file);
        }
        totalFilesToLoad() {
            return this.queue.size + this.inflight.size;
        }
        setBaseURL(url = '') {
            if (url !== '' && url.substr(-1) !== '/') {
                url = url.concat('/');
            }
            this.baseURL = url;
            return this;
        }
        setPath(path = '') {
            if (path !== '' && path.substr(-1) !== '/') {
                path = path.concat('/');
            }
            this.path = path;
            return this;
        }
        setCORS(crossOrigin) {
            this.crossOrigin = crossOrigin;
            return this;
        }
        setMaxParallelDownloads(max) {
            this.maxParallelDownloads = max;
            return this;
        }
    }

    function AppendMatrix2d(mat1, mat2) {
        const a1 = mat1.a;
        const b1 = mat1.b;
        const c1 = mat1.c;
        const d1 = mat1.d;
        const a = (mat2.a * a1) + (mat2.b * c1);
        const b = (mat2.a * b1) + (mat2.b * d1);
        const c = (mat2.c * a1) + (mat2.d * c1);
        const d = (mat2.c * b1) + (mat2.d * d1);
        const tx = (mat2.tx * a1) + (mat2.ty * c1) + mat1.tx;
        const ty = (mat2.tx * b1) + (mat2.ty * d1) + mat1.ty;
        return { a, b, c, d, tx, ty };
    }

    class Mouse extends EventEmitter {
        constructor(target) {
            super();
            this.primaryDown = false;
            this.auxDown = false;
            this.secondaryDown = false;
            this.resolution = 1;
            this.mousedownHandler = (event) => this.onMouseDown(event);
            this.mouseupHandler = (event) => this.onMouseUp(event);
            this.mousemoveHandler = (event) => this.onMouseMove(event);
            this.blurHandler = () => this.onBlur();
            target.addEventListener('mousedown', this.mousedownHandler);
            target.addEventListener('mouseup', this.mouseupHandler);
            window.addEventListener('mouseup', this.mouseupHandler);
            window.addEventListener('blur', this.blurHandler);
            window.addEventListener('mousemove', this.mousemoveHandler);
            this.localPoint = new Vec2();
            this.hitPoint = new Vec2();
            this.transPoint = new Vec2();
            this.target = target;
        }
        onBlur() {
        }
        onMouseDown(event) {
            this.positionToPoint(event);
            this.primaryDown = (event.button === 0);
            this.auxDown = (event.button === 1);
            this.secondaryDown = (event.button === 2);
            this.emit('pointerdown', this.localPoint.x, this.localPoint.y, event.button, event);
        }
        onMouseUp(event) {
            this.positionToPoint(event);
            this.primaryDown = !(event.button === 0);
            this.auxDown = !(event.button === 1);
            this.secondaryDown = !(event.button === 2);
            this.emit('pointerup', this.localPoint.x, this.localPoint.y, event.button, event);
        }
        onMouseMove(event) {
            this.positionToPoint(event);
            this.emit('pointermove', this.localPoint.x, this.localPoint.y, event);
        }
        positionToPoint(event) {
            const local = this.localPoint;
            //  if the event has offsetX/Y we can use that directly, as it gives us a lot better
            //  result, taking into account things like css transforms
            if (typeof event.offsetX === 'number') {
                local.set(event.offsetX, event.offsetY);
            }
            else {
                const rect = this.target.getBoundingClientRect();
                const width = this.target.hasAttribute('width') ? this.target['width'] : 0;
                const height = this.target.hasAttribute('height') ? this.target['height'] : 0;
                const multiplier = 1 / this.resolution;
                local.x = ((event.clientX - rect.left) * (width / rect.width)) * multiplier;
                local.y = ((event.clientY - rect.top) * (height / rect.height)) * multiplier;
            }
            return local;
        }
        getInteractiveChildren(parent, results) {
            const children = parent.children;
            for (let i = 0; i < children.length; i++) {
                let child = children[i];
                if (child.visible && child.inputEnabled) {
                    results.push(child);
                }
                if (child.inputEnabledChildren && child.isParent) {
                    this.getInteractiveChildren(child, results);
                }
            }
        }
        checkHitArea(entity, px, py) {
            if (entity.inputHitArea) {
                if (entity.inputHitArea.contains(px, py)) {
                    return true;
                }
            }
            else {
                const left = -(entity.width * entity.originX);
                const right = left + entity.width;
                const top = -(entity.height * entity.originY);
                const bottom = top + entity.height;
                return (px >= left && px <= right && py >= top && py <= bottom);
            }
            return false;
        }
        hitTest(...entities) {
            const localX = this.localPoint.x;
            const localY = this.localPoint.y;
            const point = this.transPoint;
            for (let i = 0; i < entities.length; i++) {
                let entity = entities[i];
                let mat = AppendMatrix2d(entity.scene.world.camera.worldTransform, entity.worldTransform);
                GlobalToLocal(mat, localX, localY, point);
                if (this.checkHitArea(entity, point.x, point.y)) {
                    this.hitPoint.set(point.x, point.y);
                    return true;
                }
            }
            return false;
        }
        hitTestChildren(container, topOnly = true) {
            const output = [];
            if (!container.visible) {
                return output;
            }
            //  Build a list of potential input candidates
            const candidates = [];
            if (container.inputEnabled) {
                candidates.push(container);
            }
            if (container.inputEnabledChildren && container.numChildren > 0) {
                this.getInteractiveChildren(container, candidates);
            }
            for (let i = candidates.length - 1; i >= 0; i--) {
                let entity = candidates[i];
                if (this.hitTest(entity)) {
                    output.push(entity);
                    if (topOnly) {
                        break;
                    }
                }
            }
            return output;
        }
    }

    class Demo extends Scene {
        constructor(game) {
            super(game);
            // new Stats(game, 'base');
            const loader = new Loader(game);
            loader.setPath('assets');
            loader.add(ImageFile(game, '512', '512x512.png'), ImageFile(game, '256', 'f-texture.png'), ImageFile(game, '128', '128x128.png'), ImageFile(game, '64', 'box-item-boxed.png'), ImageFile(game, '32', '32x32.png'));
            loader.start(() => this.create());
        }
        create() {
            const mouse = new Mouse(this.game.renderer.canvas);
            const parent1 = new Sprite(this, 400, 300, '512');
            const parent2 = new Sprite(this, 0, 0, '256');
            const parent3 = new Sprite(this, 0, 0, '128');
            const parent4 = new Sprite(this, 0, 0, '64');
            const child = new Sprite(this, 0, 0, '32');
            child.setInteractive();
            parent1.addChild(parent2);
            parent2.addChild(parent3);
            parent3.addChild(parent4);
            parent4.addChild(child);
            this.world.addChild(parent1);
            mouse.on('pointerdown', (x, y) => {
                const results = mouse.hitTestChildren(parent1);
                console.log((results.length > 0) ? 'Hit!' : 'None');
            });
        }
    }
    function demo36 () {
        let game = new Game({
            width: 800,
            height: 600,
            backgroundColor: 0x000033,
            parent: 'gameParent',
            scene: Demo
        });
    }

    // import demo1 from './demo1'; // test single sprite
    demo36();
    //  Next steps:
    //  * Camera tint + alpha (as shader uniform)
    //  * Camera background color (instead of renderer bgc)
    //  * Multi Texture re-use old texture IDs when count > max supported
    //  * Single Texture shader
    //  * Tile Layer
    //  * Sprite Sheet from Atlas Frame extractor
    //  * Instead of a Quad class, try a class that can have any number of vertices in it (ala Rope), or any vertex moved
    //  Done:
    //  X Camera moving needs to dirty the renderer
    //  X Load json / csv / xml on their own
    //  X Base64 Loader Test
    //  X Input point translation
    //  X Static Batch shader (Sprite Buffer)
    //  X Texture Atlas Loader
    //  X Don't defer updateTransform - do immediately
    //  X Context lost handler
    //  X Renderer resize handler
    //  X Renderer resolution
    //  X Camera class (position, scale, rotation, alpha)
    //  X Container class - Transform stack test (Sprite with children, children of children, etc)
    //  X Encode color as a single float, rather than a vec4 and add back to the shader
    //  X Moved all code to WebGL Renderer and supporting classes
    //  X Game class, single Scene, Loader, DOM Content Load handler, Texture Cache
    //  X Encapsulate a Simple asset loader (images + json) and remove responsibility from the Texture class
    //  X DOM Loaded handler + small boot = Game class
    //  X Basic Scene class
    //  X Tidy-up all of the classes, boil down into tiny WebGL1 + Sprite + Container + StaticContainer renderer package
    //  X Update Merged Transform to cache rotation and scale
    //  X Multi Textures round-robin, don't use glIndex
    //  X Texture Frames (UV) support
    //  X Camera matrix, added to the shader (projection * camera * vertex pos), so we can move the camera around, rotate it, etc.
    //  X Static buffer but use bufferSubData to update just a small part of it (i.e. a single moving quad in a static buffer)
    //  X Static test using sprites
    //  X Bunny mark (because, why not?)
    //  X Multi Textures assigned at run-time up to max
    //  X Multi-texture support
    //  X Sub-data buffer with batch flush, like current renderer handles it
    //  X Add a basic display list, so the buffer is cleared each frame and populated via the list
    //  X Try adding all quads to a single huge buffer on creation (remove on destruction), then in the render loop
    //    copy chunks from this buffer to the gl buffer - depends how fast typed array copies are vs. pushing elements by index

}());
//# sourceMappingURL=index.js.map
