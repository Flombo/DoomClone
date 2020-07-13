"use strict";
var doomClone;
(function (doomClone) {
    class ControlsLoader {
        getUpKey() {
            return localStorage.getItem('UP');
        }
        getDownKey() {
            return localStorage.getItem('DOWN');
        }
        getLeftKey() {
            return localStorage.getItem('LEFT');
        }
        getRightKey() {
            return localStorage.getItem('RIGHT');
        }
        getShootKey() {
            return localStorage.getItem('SHOOT');
        }
        getSprintKey() {
            return localStorage.getItem('SPRINT');
        }
        getInteractKey() {
            return localStorage.getItem('INTERACT');
        }
    }
    doomClone.ControlsLoader = ControlsLoader;
})(doomClone || (doomClone = {}));
//# sourceMappingURL=ControlsLoader.js.map