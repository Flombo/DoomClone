"use strict";
var doomClone;
(function (doomClone) {
    var f = FudgeCore;
    let MenuURLS;
    (function (MenuURLS) {
        MenuURLS["WINMENU"] = "/Menus/WinMenu.html";
        MenuURLS["DEATHMENU"] = "/Menus/DeathMenu.html";
    })(MenuURLS || (MenuURLS = {}));
    class GameMenuManager {
        constructor(gameCanvas) {
            this.isPaused = false;
            this.gameCanvas = gameCanvas;
            this.HUD = document.getElementsByTagName("header")[0];
            this.pausePrompt = document.getElementById("pausePrompt");
        }
        initGameMenuHandling() {
            this.styleCanvas();
            window.addEventListener("resize", () => { this.styleCanvas(); });
            window.addEventListener("keydown", (event) => {
                if (event.key === f.KEYBOARD_CODE.ESC) {
                    if (this.isPaused) {
                        this.unpause();
                    }
                    else {
                        this.pause();
                    }
                }
            });
        }
        getIsPaused() {
            return this.isPaused;
        }
        showWinMenu() {
            doomClone.GameMenuManager.setURLToMenuURL(doomClone.GameMenuManager.generateMenuURL(MenuURLS.WINMENU));
        }
        showDeadMenu() {
            doomClone.GameMenuManager.setURLToMenuURL(doomClone.GameMenuManager.generateMenuURL(MenuURLS.DEATHMENU));
        }
        static setURLToMenuURL(newURL) {
            if (newURL !== null) {
                window.location.href = newURL;
            }
        }
        static generateMenuURL(url) {
            let currentURL = window.location.href;
            let newURL = null;
            let slashCount = 0;
            for (let i = 0; i < currentURL.length; i++) {
                if (currentURL.charAt(i) === '/') {
                    slashCount++;
                    if (slashCount == 5) {
                        newURL = currentURL.substring(0, i);
                        console.log(newURL);
                        newURL += url;
                        break;
                    }
                }
            }
            return newURL;
        }
        pause() {
            this.isPaused = true;
            this.pausePrompt.setAttribute("class", "visible");
            this.gameCanvas.setAttribute("style", "opacity: 25%;");
            this.HUD.setAttribute("class", "invisible");
        }
        unpause() {
            this.isPaused = false;
            this.pausePrompt.setAttribute("class", "");
            this.HUD.setAttribute("class", "");
            this.styleCanvas();
        }
        styleCanvas() {
            this.gameCanvas.setAttribute("style", "opacity: 100%; z-index: 90;  width:" + window.innerWidth + "px; height:" + window.innerHeight + "px;");
        }
    }
    doomClone.GameMenuManager = GameMenuManager;
})(doomClone || (doomClone = {}));
//# sourceMappingURL=GameMenuManager.js.map