export class FailError extends Error {
    constructor(message: any);
}
export function pass(...msg: any[]): void;
export function fail(...msg: any[]): never;
export function ensureTrue(value: any, ...msg: any[]): void;
export function ensureFalse(value: any, ...msg: any[]): void;
export function ensureTruthy(value: any, ...msg: any[]): void;
export function ensureEqual(shouldValue: any, isValue: any, ...msg: any[]): void;
export function ensureString(value: any, ...msg: any[]): void;
export function ensureFileExists(path: any, ...msg: any[]): void;
export function ensureFolderExists(path: any, ...msg: any[]): void;
export function ensureFileOrFolderExists(path: any, ...msg: any[]): void;
export function ensureFileOrFolderOrLinkExists(path: any, ...msg: any[]): void;
export function ensureWellFormedUser(user: any, ...msg: any[]): void;
export function ensureRoot(): void;
export function ensureValidURL(url: any): void;
export function ensureFails(fn: any, ...msg: any[]): void;
export function ensureRealObject(o: any): void;
export function ensureArray(a: any): void;
export function validateOptions(optionsObject: any, validOptions: any): void;
declare namespace _default {
    export { FailError };
    export { pass };
    export { fail };
    export { ensureTrue };
    export { ensureFalse };
    export { ensureTruthy };
    export { ensureEqual };
    export { ensureString };
    export { ensureFileExists };
    export { ensureFolderExists };
    export { ensureFileOrFolderExists };
    export { ensureFileOrFolderOrLinkExists };
    export { ensureRoot };
    export { ensureWellFormedUser };
    export { ensureValidURL };
    export { ensureFails };
    export { ensureRealObject };
    export { ensureArray };
    export { validateOptions };
}
export default _default;
//# sourceMappingURL=assert.d.ts.map