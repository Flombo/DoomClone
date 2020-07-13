namespace doomClone {

    import f = FudgeCore;

    enum MenuURLS{
        WINMENU = '/Menus/WinMenu.html', DEATHMENU = '/Menus/DeathMenu.html'
    }

    export class GameMenuManager {

        private isPaused : boolean;
        private gameCanvas : HTMLCanvasElement;
        private HUD : HTMLElement;
        private pausePrompt : HTMLElement;

        constructor(gameCanvas : HTMLCanvasElement) {
            this.isPaused = false;
            this.gameCanvas = gameCanvas;
            this.HUD = document.getElementsByTagName("header")[0];
            this.pausePrompt = <HTMLElement>document.getElementById("pausePrompt");
        }

        public initGameMenuHandling() : void {
            this.styleCanvas();
            window.addEventListener("resize", () => { this.styleCanvas(); });
            window.addEventListener("keydown", (event) => {
                if(event.key === f.KEYBOARD_CODE.ESC){
                    if(this.isPaused){
                        this.unpause();
                    } else {
                        this.pause();
                    }
                }
            });
        }

        public getIsPaused() : boolean {
            return this.isPaused;
        }

        public showWinMenu() : void {
            doomClone.GameMenuManager.setURLToMenuURL(doomClone.GameMenuManager.generateMenuURL(MenuURLS.WINMENU));
        }

        public showDeadMenu() : void {
            doomClone.GameMenuManager.setURLToMenuURL(doomClone.GameMenuManager.generateMenuURL(MenuURLS.DEATHMENU));
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
            this.pausePrompt.setAttribute("class", "visible");
            this.gameCanvas.setAttribute("style", "opacity: 25%;");
            this.HUD.setAttribute("class", "invisible");
        }

        private unpause() : void {
            this.isPaused = false;
            this.pausePrompt.setAttribute("class", "");
            this.HUD.setAttribute("class", "");
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