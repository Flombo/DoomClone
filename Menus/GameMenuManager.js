"use strict";
var doomClone;
(function (doomClone) {
    var f = FudgeCore;
    class GameMenuManager {
        constructor(gameCanvas) {
            this.isPaused = true;
            this.gameCanvas = gameCanvas;
        }
        getIsPaused() {
            return this.isPaused;
        }
        initGameMenuHandling() {
            window.addEventListener("keydown", (event) => {
                let pausePrompt = document.getElementById("pausePrompt");
                let startPrompt = document.getElementById("startPrompt");
                let header = document.getElementsByTagName("header")[0];
                if (event.key === f.KEYBOARD_CODE.ESC) {
                    if (this.isPaused) {
                        this.isPaused = false;
                        if (startPrompt !== null)
                            startPrompt.remove();
                        pausePrompt.setAttribute("class", "");
                        header.setAttribute("class", "");
                        this.styleCanvas();
                    }
                    else {
                        this.isPaused = true;
                        pausePrompt.setAttribute("class", "visible");
                        this.gameCanvas.setAttribute("style", "opacity: 25%;");
                        header.setAttribute("class", "invisible");
                    }
                }
            });
        }
        styleCanvas() {
            this.gameCanvas.setAttribute("style", "opacity: 100%; z-index: 90;  width:" + window.innerWidth + "px; height:" + window.innerHeight + "px;");
        }
    }
    doomClone.GameMenuManager = GameMenuManager;
})(doomClone || (doomClone = {}));
//# sourceMappingURL=GameMenuManager.js.map