"use strict";
var doomClone;
(function (doomClone) {
    var f = FudgeCore;
    let defaultKeys;
    (function (defaultKeys) {
        defaultKeys["UP"] = "ArrowUp";
        defaultKeys["DOWN"] = "ArrowDown";
        defaultKeys["LEFT"] = "ArrowLeft";
        defaultKeys["RIGHT"] = "ArrowRight";
        defaultKeys["SHOOT"] = "ControlLeft";
        defaultKeys["SPRINT"] = "ShiftLeft";
        defaultKeys["INTERACT"] = "Space";
    })(defaultKeys || (defaultKeys = {}));
    window.addEventListener("load", () => {
        new ControlMenuManager();
    });
    class ControlMenuManager {
        constructor() {
            this.activeButton = null;
            this.defaultButton = document.getElementById("defaultButton");
            this.saveButton = document.getElementById("saveControlsButton");
            this.loadControlConfig();
            this.initHandling();
        }
        loadControlConfig() {
            let upValue = localStorage.getItem('UP');
            let downValue = localStorage.getItem('DOWN');
            let rightValue = localStorage.getItem('RIGHT');
            let leftValue = localStorage.getItem('LEFT');
            let shootValue = localStorage.getItem('SHOOT');
            let sprintValue = localStorage.getItem('SPRINT');
            let interactValue = localStorage.getItem('INTERACT');
            let buttons = document.getElementsByTagName("table")[0].getElementsByTagName("button");
            if (upValue !== null) {
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
            }
        }
        initHandling() {
            let buttons = document.getElementsByTagName("table")[0].getElementsByTagName("button");
            let buttonArray = Array.from(buttons);
            buttonArray.forEach(button => {
                button.addEventListener("mousedown", () => {
                    this.activeButton = button;
                });
            });
            window.addEventListener("keydown", (event) => {
                this.setKey(event);
            });
            this.defaultButton.addEventListener("mousedown", () => {
                this.resetButtonLayout(buttonArray);
            });
            this.saveButton.addEventListener("mousedown", () => {
                this.saveButtonLayout(buttonArray);
            });
        }
        saveButtonLayout(buttons) {
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
        static saveKey(keyString, valueString) {
            localStorage.setItem(keyString, valueString);
        }
        resetButtonLayout(buttons) {
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
        setKey(event) {
            if (this.activeButton !== null) {
                this.activeButton.innerText = event.code;
            }
        }
    }
    doomClone.ControlMenuManager = ControlMenuManager;
})(doomClone || (doomClone = {}));
//# sourceMappingURL=ControlMenuManager.js.map