"use strict";
var doomClone;
(function (doomClone) {
    class Wall extends doomClone.Obstacle {
        constructor(player, enemies, x, z) {
            super(player, enemies, x, z, "Wall", document.getElementById("wall"));
            this.addEventListener("playerCollision", () => { this.checkPlayerCollision(); }, true);
            this.addEventListener("checkWallCollisionForEnemy", () => { this.checkEnemyCollision(); }, true);
        }
        checkPlayerCollision() {
            let player = this.getPlayer();
            if (player.mtxLocal.translation.isInsideSphere(this.mtxLocal.translation, 1)) {
                player.mtxLocal.translateZ(-player.getMoveAmount());
            }
        }
        checkEnemyCollision() {
            Array.from(this.getEnemies()).forEach(enemy => {
                if (enemy.mtxLocal.translation.isInsideSphere(this.mtxLocal.translation, 1)) {
                    enemy.mtxLocal.translateZ(-enemy.getMoveAmount());
                    enemy.mtxLocal.rotateY(90);
                }
            });
        }
    }
    doomClone.Wall = Wall;
})(doomClone || (doomClone = {}));
//# sourceMappingURL=Wall.js.map