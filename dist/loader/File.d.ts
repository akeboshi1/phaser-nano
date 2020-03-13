export default class File {
    type: string;
    key: string;
    url: string;
    data: any;
    config: any;
    linkFile: File;
    loadHandler: Function;
    hasLoaded: boolean;
    constructor(type: string, key: string, url: string, loadHandler: Function, config?: any);
}
//# sourceMappingURL=File.d.ts.map