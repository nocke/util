#!/usr/bin/env node
// TODO 'use strict'
import { execSync } from 'child_process';

export const howdy = function() {
    const msg = '\nhowdy, npm package! ♥♥♥'
    console.log(msg)
    execSync(`notify-send -i info '${msg}' -t 4000`)
    return;
};

export default {
    howdy
}


