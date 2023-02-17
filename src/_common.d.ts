export const scriptPath: any;
export const scriptBasename: any;
export const scriptDir: any;
export const argv: any;
export const isWindows: boolean;
export const isRoot: boolean;
export namespace symbols {
    const ok: string;
    const tripleCross: string;
}
export function xor(a: any, b: any): boolean;
export function trim(str: any, ch: any): any;
export function ucFirst([first, ...rest]: [string?, ...any[]]): string;
export function sleep(ms: any): Promise<any>;
export function iterate(...argsAndFn: any[]): void;
export function userIsLoggedIn(user: any): boolean;
export function getIsoDateAndTime(): string;
declare namespace _default {
    export { scriptPath };
    export { scriptBasename };
    export { scriptDir };
    export { argv };
    export { trim };
    export { isRoot };
    export { isWindows };
    export { symbols };
    export { xor };
    export { ucFirst };
    export { sleep };
    export { iterate };
    export { userIsLoggedIn };
    export { getIsoDateAndTime };
}
export default _default;
//# sourceMappingURL=_common.d.ts.map