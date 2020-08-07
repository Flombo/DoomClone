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
        constructor(gameCanvas, enemies, player) {
            this.checkIfAllEnemiesAreDead = () => {
                if (this.enemies.length > 0) {
                    this.enemies.forEach(enemy => {
                        if (!enemy.getIsAlive()) {
                            this.enemiesKilled++;
                            let index = this.enemies.indexOf(enemy);
                            this.enemies.splice(index, 1);
                        }
                    });
                }
                else {
                    this.showWinMenu();
                }
            };
            this.startTime = Date.now();
            this.enemiesKilled = 0;
            this.isPaused = false;
            this.gameCanvas = gameCanvas;
            this.enemies = enemies;
            this.player = player;
            this.HUD = document.getElementsByTagName("header")[0];
            this.pauseMenu = document.getElementById("pauseMenu");
            this.resumeButton = document.getElementById("resumeGameButton");
        }
        getIsPaused() {
            return this.isPaused;
        }
        showWinMenu() {
            this.saveParameters();
            doomClone.GameMenuManager.setURLToMenuURL(doomClone.GameMenuManager.generateMenuURL(MenuURLS.WINMENU));
        }
        showDeadMenu() {
            this.saveParameters();
            doomClone.GameMenuManager.setURLToMenuURL(doomClone.GameMenuManager.generateMenuURL(MenuURLS.DEATHMENU));
        }
        initGameMenuHandling() {
            this.styleCanvas();
            window.addEventListener("resize", () => { this.styleCanvas(); });
            this.resumeButton.addEventListener("mousedown", () => {
                this.unpause();
            });
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
            f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.checkIfAllEnemiesAreDead);
        }
        saveParameters() {
            let timeTaken = Date.now() - this.startTime;
            localStorage.setItem('HEALTH', Math.floor(this.player.getHealth()).toString());
            localStorage.setItem('ENEMIES', this.enemiesKilled.toString());
            localStorage.setItem("TIME", (Math.floor(timeTaken / 1000)).toString());
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
            this.gameCanvas.setAttribute("style", "opacity: 25%;");
            this.HUD.setAttribute("class", "invisible");
            this.pauseMenu.setAttribute("style", "display: flex;");
            this.player.setIsGamePaused(true);
            this.enemies.forEach(enemy => {
                enemy.setIsGamePaused(true);
            });
        }
        unpause() {
            this.isPaused = false;
            this.HUD.setAttribute("class", "");
            this.pauseMenu.setAttribute("style", "display: none;");
            this.styleCanvas();
            this.player.setIsGamePaused(false);
            this.enemies.forEach(enemy => {
                enemy.setIsGamePaused(false);
            });
        }
        styleCanvas() {
            this.gameCanvas.setAttribute("style", "opacity: 100%; z-index: 90;  width:" + window.innerWidth + "px; height:" + window.innerHeight + "px;");
        }
    }
    doomClone.GameMenuManager = GameMenuManager;
})(doomClone || (doomClone = {}));
//# sourceMappingURL=GameMenuManager.js.map