namespace doomClone {

    import f = FudgeCore;

    enum DefaultKeys {
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
        private saveMessage : HTMLDivElement;

        constructor() {
            this.activeButton = null;
            this.defaultButton = <HTMLButtonElement>document.getElementById("defaultButton");
            this.saveButton = <HTMLButtonElement>document.getElementById("saveControlsButton");
            this.saveMessage = <HTMLDivElement>document.getElementById("saveMessage");
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
               this.saveButtonLayout(buttonArray);
            });
        }

        private saveButtonLayout(buttons : HTMLButtonElement[]) : void {
            localStorage.clear();
            buttons.forEach(button => {
                switch (button.id) {
                    case 'upButton':
                        this.saveKey('UP', button.innerText);
                        break;
                    case 'downButton':
                        this.saveKey('DOWN', button.innerText);
                        break;
                    case 'leftButton':
                        this.saveKey('LEFT', button.innerText);
                        break;
                    case 'rightButton':
                        this.saveKey('RIGHT', button.innerText);
                        break;
                    case 'sprintButton':
                        this.saveKey('SPRINT', button.innerText);
                        break;
                    case 'shootButton':
                        this.saveKey('SHOOT', button.innerText);
                        break;
                    case 'interactButton':
                        this.saveKey('INTERACT', button.innerText);
                        break;
                }
            });
        }

        private saveKey(keyString : string, valueString : string) : void {
            localStorage.setItem(keyString, valueString);
            if (localStorage.getItem(keyString) !== null) {
                this.saveMessage.innerText = "Successfully saved";
            } else {
                this.saveMessage.innerText = "There occured an error while saving";
            }
        }

        private resetButtonLayout(buttons : HTMLButtonElement[]) : void {
            buttons.forEach(button => {
                switch (button.id) {
                    case 'upButton':
                        button.innerText = String(DefaultKeys.UP);
                        break;
                    case 'downButton':
                        button.innerText = String(DefaultKeys.DOWN);
                        break;
                    case 'leftButton':
                        button.innerText = String(DefaultKeys.LEFT);
                        break;
                    case 'rightButton':
                        button.innerText = String(DefaultKeys.RIGHT);
                        break;
                    case 'sprintButton':
                        button.innerText = String(DefaultKeys.SPRINT);
                        break;
                    case 'shootButton':
                        button.innerText = String(DefaultKeys.SHOOT);
                        break;
                    case 'interactButton':
                        button.innerText = String(DefaultKeys.INTERACT);
                        break;
                }
            });
        }

        private setKey(event : KeyboardEvent) : void {
            if(this.activeButton !== null){
                let activeButtonCurrentBinding : string = this.activeButton.innerText;
                if(!doomClone.ControlMenuManager.checkKeyBindings(event.code)){
                    this.activeButton.innerText = event.code;
                } else {
                    this.saveMessage.innerText = `key "${event.code}" already in use`;
                    this.activeButton.innerText = activeButtonCurrentBinding;
                }
                this.activeButton = null;
            }
        }

        private static checkKeyBindings(keyCode : string) : boolean {
            let keyAlreadyUsed : boolean = false;
            let buttonsArray = <HTMLButtonElement[]>Array.from(
                document.getElementsByTagName("table")[0].getElementsByTagName("button")
            );
            for(let i : number = 0; i < buttonsArray.length; i++){
                if(buttonsArray[i].innerText === keyCode){
                    keyAlreadyUsed = true;
                }
            }
            return keyAlreadyUsed;
        }

    }

}