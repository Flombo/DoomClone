namespace doomClone {

    import f = FudgeCore;

    export class GameMenuManager {

        private isPaused : boolean;
        private pausingBlocked : boolean;
        private gameCanvas : HTMLCanvasElement;
        private header : HTMLElement;
        private pausePrompt : HTMLElement;
        private startPrompt : HTMLElement;

        constructor(gameCanvas : HTMLCanvasElement) {
            this.isPaused = true;
            this.pausingBlocked = true;
            this.gameCanvas = gameCanvas;
            this.header = document.getElementsByTagName("header")[0];
            this.pausePrompt = <HTMLElement>document.getElementById("pausePrompt");
            this.startPrompt = <HTMLElement>document.getElementById("startPrompt");
        }

        public getIsPaused() : boolean {
            return this.isPaused;
        }

        public showDeadPrompt() : void {
            this.pausingBlocked = true;
            let deadPrompt : HTMLElement = <HTMLElement>document.getElementById("deadPrompt");
            deadPrompt.setAttribute("class", "visible");
            this.header.setAttribute("class", "invisible");
            this.gameCanvas.setAttribute("style", "opacity: 25%;");
        }

        public initGameMenuHandling() : void {
            window.addEventListener("keydown", (event) => {

                if(event.key === f.KEYBOARD_CODE.ESC && !this.pausingBlocked){
                    if(this.isPaused){
                        this.unpause();
                    } else {
                        this.pause();
                    }
                } else {
                    if(this.startPrompt !== null) this.startPrompt.remove();
                    this.pausingBlocked = false;
                    this.unpause();
                }
            });
        }

        private pause() : void {
            this.isPaused = true;
            this.pausePrompt.setAttribute("class", "visible");
            this.gameCanvas.setAttribute("style", "opacity: 25%;");
            this.header.setAttribute("class", "invisible");
        }

        private unpause() : void {
            this.isPaused = false;
            this.pausePrompt.setAttribute("class", "");
            this.header.setAttribute("class", "");
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