namespace doomClone {

    import f = FudgeCore;

    export class GameMenuManager {

        private isPaused : boolean;
        private gameCanvas : HTMLCanvasElement;

        constructor(gameCanvas : HTMLCanvasElement) {
            this.isPaused = true;
            this.gameCanvas = gameCanvas;
        }

        public getIsPaused() : boolean {
            return this.isPaused;
        }

        public initGameMenuHandling() : void {
            window.addEventListener("keydown", (event) => {
                let pausePrompt : HTMLElement = <HTMLElement>document.getElementById("pausePrompt");
                let startPrompt : HTMLElement = <HTMLElement>document.getElementById("startPrompt");
                let header = document.getElementsByTagName("header")[0];

                if(event.key === f.KEYBOARD_CODE.ESC){
                    if(this.isPaused){
                        this.isPaused = false;
                        if(startPrompt !== null) startPrompt.remove();
                        pausePrompt.setAttribute("class", "");
                        header.setAttribute("class", "");
                        this.styleCanvas();
                    } else {
                        this.isPaused = true;
                        pausePrompt.setAttribute("class", "visible");
                        this.gameCanvas.setAttribute("style", "opacity: 25%;");
                        header.setAttribute("class", "invisible");
                    }
                }
            });
        }

        private styleCanvas() : void {
            this.gameCanvas.setAttribute(
                "style",
                "opacity: 100%; z-index: 90;  width:" + window.innerWidth + "px; height:" + window.innerHeight + "px;"
            );
        }

    }

}