// REF GPT example:
declare module '@nocke/util' {
    export const isWindows: string;
    export const argv: string[];

    export const add: (a: number, b: number) => number;

    export const capitalize: (str: string) => string;

    export const delay: (ms: number) => Promise<void>;
  }
