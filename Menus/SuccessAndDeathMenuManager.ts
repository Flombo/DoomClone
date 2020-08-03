namespace doomClone {

    window.addEventListener("load", () => {
        new SuccessAndDeathMenuManager();
    });

    export class SuccessAndDeathMenuManager {

        constructor() {
            this.init();
        }

        private init() : void {
            let remainingHealth : number = Number(localStorage.getItem("HEALTH"));
            let killedEnemies : number = Number(localStorage.getItem("ENEMIES"));
            let timeTaken : number = Number(localStorage.getItem("TIME"));
            let score : number = Math.floor((remainingHealth * killedEnemies) / timeTaken);
            let healthPrompt : HTMLTableRowElement = <HTMLTableRowElement>document.getElementById("health");
            let killedEnemiesPrompt : HTMLTableRowElement = <HTMLTableRowElement>document.getElementById("killedEnemies");
            let timeTakenPrompt : HTMLTableRowElement = <HTMLTableRowElement>document.getElementById("timeTaken");
            let scorePrompt : HTMLTableRowElement = <HTMLTableRowElement>document.getElementById("score");
            doomClone.SuccessAndDeathMenuManager.createTDElement(remainingHealth.toString(), healthPrompt);
            doomClone.SuccessAndDeathMenuManager.createTDElement(killedEnemies.toString(), killedEnemiesPrompt);
            doomClone.SuccessAndDeathMenuManager.createTDElement(timeTaken.toString() + " seconds", timeTakenPrompt);
            doomClone.SuccessAndDeathMenuManager.createTDElement(score.toString(), scorePrompt);
        }

        private static createTDElement(amount : string, prompt : HTMLTableRowElement) : void {
            let tdElement : HTMLTableDataCellElement = document.createElement("td");
            tdElement.innerText = amount;
            prompt.appendChild(tdElement);
        }

    }

}