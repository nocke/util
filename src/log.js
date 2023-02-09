import { scriptBasename } from "./_common.js";

export const howdy = function() {
    const msg = 'howdy, npm package! ♥♥♥ 1234576 ' + scriptBasename
    return msg;
};

export const fruit = 'banana'

export default {
    howdy,
    fruit
}
