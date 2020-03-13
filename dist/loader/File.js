export default class File {
    constructor(type, key, url, loadHandler, config) {
        this.hasLoaded = false;
        this.type = type;
        this.key = key;
        this.url = url;
        this.loadHandler = loadHandler;
        this.config = config;
    }
}
//# sourceMappingURL=File.js.map