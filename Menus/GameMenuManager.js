"use strict";
var doomClone;
(function (doomClone) {
    var f = FudgeCore;
    class GameMenuManager {
        constructor(gameCanvas) {
            this.isPaused = true;
            this.pausingBlocked = true;
            this.gameCanvas = gameCanvas;
            this.header = document.getElementsByTagName("header")[0];
            this.pausePrompt = document.getElementById("pausePrompt");
            this.startPrompt = document.getElementById("startPrompt");
        }
        getIsPaused() {
            return this.isPaused;
        }
        showDeadPrompt() {
            this.pausingBlocked = true;
            let deadPrompt = document.getElementById("deadPrompt");
            deadPrompt.setAttribute("class", "visible");
            this.header.setAttribute("class", "invisible");
            this.gameCanvas.setAttribute("style", "opacity: 25%;");
        }
        initGameMenuHandling() {
            window.addEventListener("keydown", (event) => {
                if (event.key === f.KEYBOARD_CODE.ESC && !this.pausingBlocked) {
                    if (this.isPaused) {
                        this.unpause();
                    }
                    else {
                        this.pause();
                    }
                }
                else {
                    if (this.startPrompt !== null)
                        this.startPrompt.remove();
                    this.pausingBlocked = false;
                    this.unpause();
                }
            });
        }
        pause() {
            this.isPaused = true;
            this.pausePrompt.setAttribute("class", "visible");
            this.gameCanvas.setAttribute("style", "opacity: 25%;");
            this.header.setAttribute("class", "invisible");
        }
        unpause() {
            this.isPaused = false;
            this.pausePrompt.setAttribute("class", "");
            this.header.setAttribute("class", "");
            this.styleCanvas();
        }
        styleCanvas() {
            this.gameCanvas.setAttribute("style", "opacity: 100%; z-index: 90;  width:" + window.innerWidth + "px; height:" + window.innerHeight + "px;");
        }
    }
    doomClone.GameMenuManager = GameMenuManager;
})(doomClone || (doomClone = {}));
//# sourceMappingURL=GameMenuManager.js.map