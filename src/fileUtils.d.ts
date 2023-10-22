export function getDiskUsageInfo(diskpath?: string): {
    fileSystem: any;
    used: number;
    avail: number;
    usedPercentage: number;
    mountPoint: any;
};
export function getDiskUsageSummary(diskpath?: string): string;
export function groomDestPath(filePath: any): {
    root: any;
    dir: any;
    base: any;
    ext: any;
    user: string;
    group: string;
};
export function commonize(dirPath: any): void;
export function isFile(path: any): any;
export function isFolder(path: any): any;
export function isLink(path: any): any;
export function writeFile(filePath: any, ...lines: any[]): void;
export function getFolderSize(filePath: any, size?: string): number;
export function rsyncFolder(src: any, dest: any, config?: {}): void;
export function fileCopy(src: any, dest: any, config?: {}): void;
export function makeDirs(...dirsAndOptions: any[]): void;
export function fileHasSnippet(file: any, snippet: any): boolean;
declare namespace _default {
    export { getDiskUsageInfo };
    export { getDiskUsageSummary };
    export { groomDestPath };
    export { commonize };
    export { writeFile };
    export { getFolderSize };
    export { isFile };
    export { isFolder };
    export { isLink };
    export { rsyncFolder };
    export { fileCopy };
    export { makeDirs };
    export { fileHasSnippet };
}
export default _default;
//# sourceMappingURL=fileUtils.d.ts.map