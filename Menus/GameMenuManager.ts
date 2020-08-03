namespace doomClone {

    import f = FudgeCore;

    enum MenuURLS{
        WINMENU = '/Menus/WinMenu.html', DEATHMENU = '/Menus/DeathMenu.html'
    }

    export class GameMenuManager {

        private isPaused : boolean;
        private gameCanvas : HTMLCanvasElement;
        private HUD : HTMLElement;
        private pauseMenu : HTMLDivElement;
        private resumeButton : HTMLButtonElement;
        private enemies : Enemy[];
        private startTime : number;
        private enemiesKilled : number;
        private player : Player;

        constructor(gameCanvas : HTMLCanvasElement, enemies : Enemy[], player : Player) {
            this.startTime = Date.now();
            this.enemiesKilled = 0;
            this.isPaused = false;
            this.gameCanvas = gameCanvas;
            this.enemies = enemies;
            this.player = player;
            this.HUD = document.getElementsByTagName("header")[0];
            this.pauseMenu = <HTMLDivElement>document.getElementById("pauseMenu");
            this.resumeButton = <HTMLButtonElement>document.getElementById("resumeGameButton");
        }

        public initGameMenuHandling() : void {
            this.styleCanvas();

            window.addEventListener("resize", () => { this.styleCanvas(); });

            this.resumeButton.addEventListener("mousedown", () => {
                this.unpause();
            });

            window.addEventListener("keydown", (event) => {
                if(event.key === f.KEYBOARD_CODE.ESC){
                    if(this.isPaused){
                        this.unpause();
                    } else {
                        this.pause();
                    }
                }
            });

            f.Loop.addEventListener(f.EVENT.LOOP_FRAME, this.checkIfAllEnemiesAreDead);
        }

        private checkIfAllEnemiesAreDead = () => {
            if(this.enemies.length > 0) {
                this.enemies.forEach(enemy => {
                    if (!enemy.getIsAlive()) {
                        this.enemiesKilled++;
                        let index: number = this.enemies.indexOf(enemy);
                        this.enemies.splice(index, 1);
                    }
                });
            } else {
                this.showWinMenu();
            }
        }

        public getIsPaused() : boolean {
            return this.isPaused;
        }

        public showWinMenu() : void {
            this.saveParameters();
            doomClone.GameMenuManager.setURLToMenuURL(doomClone.GameMenuManager.generateMenuURL(MenuURLS.WINMENU));
        }

        public showDeadMenu() : void {
            this.saveParameters();
            doomClone.GameMenuManager.setURLToMenuURL(doomClone.GameMenuManager.generateMenuURL(MenuURLS.DEATHMENU));
        }

        private saveParameters() : void {
            let timeTaken : number = Date.now() - this.startTime;
            localStorage.setItem('HEALTH', this.player.getHealth().toString());
            localStorage.setItem('ENEMIES', this.enemiesKilled.toString());
            localStorage.setItem("TIME", (Math.floor(timeTaken / 1000)).toString());
        }

        private static setURLToMenuURL(newURL : string) : void {
            if(newURL !== null) {
                window.location.href = newURL;
            }
        }

        private static generateMenuURL(url : string) : string {
            let currentURL : string = window.location.href;
            let newURL : string = null;
            let slashCount : number = 0;
            for(let i : number = 0; i < currentURL.length; i++) {
                if(currentURL.charAt(i) === '/') {
                    slashCount++;
                    if(slashCount == 5) {
                        newURL = currentURL.substring(0, i);
                        console.log(newURL);
                        newURL += url;
                        break;
                    }
                }
            }
            return newURL;
        }

        private pause() : void {
            this.isPaused = true;
            this.gameCanvas.setAttribute("style", "opacity: 25%;");
            this.HUD.setAttribute("class", "invisible");
            this.pauseMenu.setAttribute("style", "display: flex;");
        }

        private unpause() : void {
            this.isPaused = false;
            this.HUD.setAttribute("class", "");
            this.pauseMenu.setAttribute("style", "display: none;");
            this.styleCanvas();
        }

        private styleCanvas() : void {
            this.gameCanvas.setAttribute(
                "style",
                "opacity: 100%; z-index: 90;  width:" + window.innerWidth + "px; height:" + window.innerHeight + "px;"
            );
        }

    }

}