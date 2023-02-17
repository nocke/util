export function serializeMsg(args: any): any;
export const clear: "\u001B[2J\u001B[H";
export function red(...msg: any[]): string;
export function green(...msg: any[]): string;
export function blue(...msg: any[]): string;
export function purple(...msg: any[]): string;
export function yellow(...msg: any[]): string;
export function info(...msg: any[]): void;
export function warn(...msg: any[]): void;
export function important(...msg: any[]): void;
export function superLog(...msg: any[]): void;
export const worthySuperlog: RegExp;
export function loggedMainWrap(main: any): void;
declare namespace _default {
    export { serializeMsg };
    export { clear };
    export { red };
    export { green };
    export { blue };
    export { purple };
    export { yellow };
    export { info };
    export { warn };
    export { important };
    export { loggedMainWrap };
    export { superLog };
    export { worthySuperlog };
}
export default _default;
//# sourceMappingURL=log.d.ts.map