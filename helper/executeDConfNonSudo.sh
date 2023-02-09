#!/bin/bash

# DO NOT REMOVE/CHANGE, also used from NodeJS utils.js
# (since there is no other way...)

# REF COULDTRY for true NodeJS seteuid
# REF https://stackoverflow.com/a/6732456

_sadTrick() {
    # yes, it's a hack. But one even Ubuntu uses.
    # ubuntu-mate.community/t/reload-desktop-background-via-command-line/19972/8

    state="$(dconf read /org/mate/desktop/background/show-desktop-icons |tr -d '\n')"
    # forth+back, whereever we com from (1st path somehow less flicker-ish)
    if [ "$state" = "true" ]; then
        dconf write /org/mate/desktop/background/show-desktop-icons false
        sleep .2
        dconf write /org/mate/desktop/background/show-desktop-icons true
        sleep .2
    else
        dconf write /org/mate/desktop/background/show-desktop-icons true
        sleep .2
        dconf write /org/mate/desktop/background/show-desktop-icons false
        sleep .2
    fi
}

echo "applying dconf $1 as regular user $(whoami), DBUS_SESSION_BUS_ADDRESS: $DBUS_SESSION_BUS_ADDRESS"
cat $1 | dconf load /
_sadTrick
