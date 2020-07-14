namespace doomClone {

    import f = FudgeCore;

    enum defaultKeys {
        UP = f.KEYBOARD_CODE.ARROW_UP, DOWN = f.KEYBOARD_CODE.ARROW_DOWN, LEFT = f.KEYBOARD_CODE.ARROW_LEFT,
        RIGHT = f.KEYBOARD_CODE.ARROW_RIGHT, SHOOT = f.KEYBOARD_CODE.CTRL_LEFT, SPRINT = f.KEYBOARD_CODE.SHIFT_LEFT,
        INTERACT = f.KEYBOARD_CODE.SPACE
    }

    window.addEventListener("load", () => {
        new ControlMenuManager();
    });

    export class ControlMenuManager {

        private activeButton : HTMLButtonElement;
        private defaultButton : HTMLButtonElement;
        private saveButton : HTMLButtonElement;

        constructor() {
            this.activeButton = null;
            this.defaultButton = <HTMLButtonElement>document.getElementById("defaultButton");
            this.saveButton = <HTMLButtonElement>document.getElementById("saveControlsButton");
            this.loadControlConfig();
            this.initHandling()
        }

        private loadControlConfig() : void {
            let upValue = localStorage.getItem('UP');
            let downValue = localStorage.getItem('DOWN');
            let rightValue = localStorage.getItem('RIGHT');
            let leftValue = localStorage.getItem('LEFT');
            let shootValue = localStorage.getItem('SHOOT');
            let sprintValue = localStorage.getItem('SPRINT');
            let interactValue = localStorage.getItem('INTERACT');
            let buttons = document.getElementsByTagName("table")[0].getElementsByTagName("button");
            if(upValue !== null) {
                Array.from(buttons).forEach(button => {
                    switch (button.id) {
                        case 'upButton':
                            button.innerText = upValue;
                            break;
                        case 'downButton':
                            button.innerText = downValue;
                            break;
                        case 'leftButton':
                            button.innerText = leftValue;
                            break;
                        case 'rightButton':
                            button.innerText = rightValue;
                            break;
                        case 'sprintButton':
                            button.innerText = sprintValue;
                            break;
                        case 'shootButton':
                            button.innerText = shootValue;
                            break;
                        case 'interactButton':
                            button.innerText = interactValue;
                            break;
                    }
                });
            } else {
                this.resetButtonLayout(<HTMLButtonElement[]>Array.from(buttons));
                this.saveButtonLayout(<HTMLButtonElement[]>Array.from(buttons));
            }
        }

        private initHandling() : void {
            let buttons = document.getElementsByTagName("table")[0].getElementsByTagName("button");
            let buttonArray : HTMLButtonElement[] = Array.from(buttons);
            buttonArray.forEach(button => {
                button.addEventListener("mousedown", () => {
                   this.activeButton = button;
               });
            });

            window.addEventListener("keydown", (event : KeyboardEvent) => {
                this.setKey(event);
            });

            this.defaultButton.addEventListener("mousedown", () => {
               this.resetButtonLayout(buttonArray);
            });

            this.saveButton.addEventListener("mousedown", () => {
               this .saveButtonLayout(buttonArray);
            });
        }

        private saveButtonLayout(buttons : HTMLButtonElement[]) : void {
            localStorage.clear();
            buttons.forEach(button => {
                switch (button.id) {
                    case 'upButton':
                        doomClone.ControlMenuManager.saveKey('UP', button.innerText);
                        break;
                    case 'downButton':
                        doomClone.ControlMenuManager.saveKey('DOWN', button.innerText);
                        break;
                    case 'leftButton':
                        doomClone.ControlMenuManager.saveKey('LEFT', button.innerText);
                        break;
                    case 'rightButton':
                        doomClone.ControlMenuManager.saveKey('RIGHT', button.innerText);
                        break;
                    case 'sprintButton':
                        doomClone.ControlMenuManager.saveKey('SPRINT', button.innerText);
                        break;
                    case 'shootButton':
                        doomClone.ControlMenuManager.saveKey('SHOOT', button.innerText);
                        break;
                    case 'interactButton':
                        doomClone.ControlMenuManager.saveKey('INTERACT', button.innerText);
                        break;
                }
            });
        }

        private static saveKey(keyString : string, valueString : string) : void {
            localStorage.setItem(keyString, valueString);
        }

        private resetButtonLayout(buttons : HTMLButtonElement[]) : void {
            buttons.forEach(button => {
                switch (button.id) {
                    case 'upButton':
                        button.innerText = String(defaultKeys.UP);
                        break;
                    case 'downButton':
                        button.innerText = String(defaultKeys.DOWN);
                        break;
                    case 'leftButton':
                        button.innerText = String(defaultKeys.LEFT);
                        break;
                    case 'rightButton':
                        button.innerText = String(defaultKeys.RIGHT);
                        break;
                    case 'sprintButton':
                        button.innerText = String(defaultKeys.SPRINT);
                        break;
                    case 'shootButton':
                        button.innerText = String(defaultKeys.SHOOT);
                        break;
                    case 'interactButton':
                        button.innerText = String(defaultKeys.INTERACT);
                        break;
                }
            });
        }

        private setKey(event : KeyboardEvent) : void {
            if(this.activeButton !== null){
                this.activeButton.innerText = event.code;
            }
        }

    }

}