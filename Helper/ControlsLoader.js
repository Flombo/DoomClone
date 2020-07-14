"use strict";
var doomClone;
(function (doomClone) {
    var f = FudgeCore;
    class ControlsLoader {
        getUpKey() {
            return doomClone.ControlsLoader.loadCertainValueWithKey('UP', f.KEYBOARD_CODE.ARROW_UP);
        }
        getDownKey() {
            return doomClone.ControlsLoader.loadCertainValueWithKey('DOWN', f.KEYBOARD_CODE.ARROW_DOWN);
        }
        getLeftKey() {
            return doomClone.ControlsLoader.loadCertainValueWithKey('LEFT', f.KEYBOARD_CODE.ARROW_LEFT);
        }
        getRightKey() {
            return doomClone.ControlsLoader.loadCertainValueWithKey('RIGHT', f.KEYBOARD_CODE.ARROW_RIGHT);
        }
        getShootKey() {
            return doomClone.ControlsLoader.loadCertainValueWithKey('SHOOT', f.KEYBOARD_CODE.CTRL_LEFT);
        }
        getSprintKey() {
            return doomClone.ControlsLoader.loadCertainValueWithKey('SPRINT', f.KEYBOARD_CODE.SHIFT_LEFT);
        }
        getInteractKey() {
            return doomClone.ControlsLoader.loadCertainValueWithKey('INTERACT', f.KEYBOARD_CODE.SPACE);
        }
        static loadCertainValueWithKey(key, defaultValue) {
            let loadedValue = localStorage.getItem(key);
            if (loadedValue === null) {
                loadedValue = defaultValue;
            }
            return loadedValue;
        }
    }
    doomClone.ControlsLoader = ControlsLoader;
})(doomClone || (doomClone = {}));
//# sourceMappingURL=ControlsLoader.js.map