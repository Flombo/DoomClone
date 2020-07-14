namespace doomClone {

    import f = FudgeCore;

    export class ControlsLoader {

        public getUpKey() : string {
            return doomClone.ControlsLoader.loadCertainValueWithKey('UP', f.KEYBOARD_CODE.ARROW_UP);
        }

        public getDownKey() : string {
            return doomClone.ControlsLoader.loadCertainValueWithKey('DOWN', f.KEYBOARD_CODE.ARROW_DOWN);
        }

        public getLeftKey() : string {
            return doomClone.ControlsLoader.loadCertainValueWithKey('LEFT', f.KEYBOARD_CODE.ARROW_LEFT);
        }

        public getRightKey() : string {
            return doomClone.ControlsLoader.loadCertainValueWithKey('RIGHT', f.KEYBOARD_CODE.ARROW_RIGHT);
        }

        public getShootKey() : string {
            return doomClone.ControlsLoader.loadCertainValueWithKey('SHOOT', f.KEYBOARD_CODE.CTRL_LEFT);
        }

        public getSprintKey() : string {
            return doomClone.ControlsLoader.loadCertainValueWithKey('SPRINT', f.KEYBOARD_CODE.SHIFT_LEFT);
        }

        public getInteractKey() : string {
            return doomClone.ControlsLoader.loadCertainValueWithKey('INTERACT', f.KEYBOARD_CODE.SPACE);
        }

        private static loadCertainValueWithKey(key : string, defaultValue : string) : string {
            let loadedValue : string = localStorage.getItem(key);
            if(loadedValue === null) {
                loadedValue = defaultValue;
            }
            return loadedValue;
        }

    }

}