"use strict";
var doomClone;
(function (doomClone) {
    window.addEventListener("load", () => {
        new SuccessAndDeathMenuManager();
    });
    class SuccessAndDeathMenuManager {
        constructor() {
            this.init();
        }
        init() {
            let remainingHealth = Number(localStorage.getItem("HEALTH"));
            let killedEnemies = Number(localStorage.getItem("ENEMIES"));
            let timeTaken = Number(localStorage.getItem("TIME"));
            let score = Math.floor((remainingHealth * killedEnemies) / timeTaken);
            let healthPrompt = document.getElementById("health");
            let killedEnemiesPrompt = document.getElementById("killedEnemies");
            let timeTakenPrompt = document.getElementById("timeTaken");
            let scorePrompt = document.getElementById("score");
            doomClone.SuccessAndDeathMenuManager.createTDElement(remainingHealth.toString(), healthPrompt);
            doomClone.SuccessAndDeathMenuManager.createTDElement(killedEnemies.toString(), killedEnemiesPrompt);
            doomClone.SuccessAndDeathMenuManager.createTDElement(timeTaken.toString() + " seconds", timeTakenPrompt);
            doomClone.SuccessAndDeathMenuManager.createTDElement(score.toString(), scorePrompt);
        }
        static createTDElement(amount, prompt) {
            let tdElement = document.createElement("td");
            tdElement.innerText = amount;
            prompt.appendChild(tdElement);
        }
    }
    doomClone.SuccessAndDeathMenuManager = SuccessAndDeathMenuManager;
})(doomClone || (doomClone = {}));
//# sourceMappingURL=SuccessAndDeathMenuManager.js.map