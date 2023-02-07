import { execSync } from 'child_process';

export const howdy = function() {
    const msg = '\nhowdy, npm package! ♥♥♥ 1234576'
    console.log(msg)
    return;
};

export default {
    howdy
}
