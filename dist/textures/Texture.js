import Frame from './Frame';
export default class Texture {
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
//# sourceMappingURL=Texture.js.map