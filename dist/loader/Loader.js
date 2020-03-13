import File from './File';
export default class Loader {
    constructor(game) {
        this.baseURL = '';
        this.path = '';
        this.crossOrigin = undefined;
        this.maxParallelDownloads = 32;
        this.isLoading = false;
        this.game = game;
        this.reset();
    }
    reset() {
        this.isLoading = false;
        this.queue = [];
        this.inflight = new Map();
    }
    start(onComplete) {
        if (this.isLoading) {
            return;
        }
        // console.log('Loader.start', this.totalFilesToLoad());
        if (this.queue.length > 0) {
            this.isLoading = true;
            this.onComplete = onComplete;
            this.nextFile();
        }
        else {
            onComplete();
        }
    }
    nextFile() {
        // let total: number = this.inflight.size;
        let total = this.queue.length;
        if (total) {
            //  One at a time ...
            let file = this.queue.shift();
            this.inflight.set(file.url, file);
            // console.log('Loader.nextFile', file.key, file.url);
            file.loadHandler(file);
        }
        else if (this.inflight.size === 0) {
            this.stop();
        }
    }
    stop() {
        this.isLoading = false;
        this.onComplete();
    }
    fileComplete(file) {
        //  Link file?
        if (file.linkFile && file.linkFile.hasLoaded) {
            const imageFile = (file.type === 'atlasimage') ? file : file.linkFile;
            const jsonFile = (file.type === 'atlasjson') ? file : file.linkFile;
            this.game.textures.addAtlas(file.key, imageFile.data, jsonFile.data);
        }
        this.inflight.delete(file.url);
        this.nextFile();
    }
    fileError(file) {
        this.inflight.delete(file.url);
        this.nextFile();
    }
    totalFilesToLoad() {
        return this.queue.length + this.inflight.size;
    }
    image(key, url) {
        let file = new File('image', key, this.getURL(key, url, '.png'), (file) => this.imageTagLoader(file));
        this.queue.push(file);
        return this;
    }
    spritesheet(key, url, frameConfig) {
        let file = new File('spritesheet', key, this.getURL(key, url, '.png'), (file) => this.imageTagLoader(file));
        file.config = frameConfig;
        this.queue.push(file);
        return this;
    }
    atlas(key, textureURL, atlasURL) {
        let textureFile = new File('atlasimage', key, this.getURL(key, textureURL, '.png'), (file) => this.imageTagLoader(file));
        let JSONFile = new File('atlasjson', key, this.getURL(key, atlasURL, '.json'), (file) => this.XHRLoader(file));
        JSONFile.config = { responseType: 'text' };
        textureFile.linkFile = JSONFile;
        JSONFile.linkFile = textureFile;
        this.queue.push(textureFile);
        this.queue.push(JSONFile);
        return this;
    }
    json(key, url) {
        let file = new File('json', key, this.getURL(key, url, '.json'), (file) => this.XHRLoader(file));
        file.config = { responseType: 'text' };
        this.queue.push(file);
        return this;
    }
    csv(key, url) {
        let file = new File('csv', key, this.getURL(key, url, '.csv'), (file) => this.XHRLoader(file));
        file.config = { responseType: 'text' };
        this.queue.push(file);
        return this;
    }
    XHRLoader(file) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', file.url, true);
        xhr.responseType = file.config['responseType'];
        xhr.onload = (event) => {
            file.hasLoaded = true;
            if (file.type === 'json' || file.type === 'atlasjson') {
                file.data = JSON.parse(xhr.responseText);
            }
            else {
                file.data = xhr.responseText;
            }
            this.fileComplete(file);
        };
        xhr.onerror = () => {
            file.hasLoaded = true;
            this.fileError(file);
        };
        xhr.send();
    }
    imageTagLoader(file) {
        // console.log('Loader.imageTagLoader', file.key);
        // console.log(this);
        file.data = new Image();
        if (this.crossOrigin) {
            file.data.crossOrigin = this.crossOrigin;
        }
        file.data.onload = () => {
            // console.log('File.data.onload', file.key);
            file.data.onload = null;
            file.data.onerror = null;
            file.hasLoaded = true;
            if (file.type === 'image') {
                this.game.textures.addImage(file.key, file.data);
            }
            else if (file.type === 'spritesheet') {
                this.game.textures.addSpriteSheet(file.key, file.data, file.config);
            }
            this.fileComplete(file);
        };
        file.data.onerror = () => {
            // console.log('File.data.onerror', file.key);
            file.data.onload = null;
            file.data.onerror = null;
            file.hasLoaded = true;
            this.fileError(file);
        };
        file.data.src = file.url;
        //  Image is cached / available immediately
        if (file.data.complete && file.data.width && file.data.height) {
            file.data.onload = null;
            file.data.onerror = null;
            file.hasLoaded = true;
            if (file.type === 'image') {
                this.game.textures.addImage(file.key, file.data);
            }
            else if (file.type === 'spritesheet') {
                this.game.textures.addSpriteSheet(file.key, file.data, file.config);
            }
            this.fileComplete(file);
        }
    }
    getURL(key, url, extension) {
        if (!url) {
            url = key + extension;
        }
        if (url.match(/^(?:blob:|data:|http:\/\/|https:\/\/|\/\/)/)) {
            return url;
        }
        else {
            return this.baseURL + this.path + url;
        }
    }
    setBaseURL(url) {
        if (url !== '' && url.substr(-1) !== '/') {
            url = url.concat('/');
        }
        this.baseURL = url;
        return this;
    }
    setPath(path) {
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
}
//# sourceMappingURL=Loader.js.map