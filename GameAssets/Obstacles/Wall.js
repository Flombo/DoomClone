"use strict";
var doomClone;
(function (doomClone) {
    class Wall extends doomClone.Obstacle {
        constructor(player, enemies, x, z) {
            super(player, enemies, x, z, "Wall", document.getElementById("wall"));
            this.player = player;
            this.addEventListener("playerCollision", () => { this.checkPlayerCollision(); }, true);
            this.addEventListener("checkWallCollisionForEnemy", () => { this.checkEnemyCollision(); }, true);
        }
        checkPlayerCollision() {
            if (this.player.mtxLocal.translation.isInsideSphere(this.mtxLocal.translation, 1)) {
                this.player.mtxLocal.translateZ(-this.player.moveAmount);
            }
        }
        checkEnemyCollision() {
            Array.from(this.enemies).forEach(enemy => {
                if (enemy.getAhead().isInsideSphere(this.mtxLocal.translation, 1)) {
                    let avoidanceForce = enemy.getAhead().copy;
                    avoidanceForce.subtract(this.mtxLocal.translation.copy);
                    enemy.mtxLocal.translateZ((enemy.getSpeed()) + avoidanceForce.z);
                    enemy.mtxLocal.translateX((enemy.getSpeed()) + avoidanceForce.x);
                }
            });
        }
    }
    doomClone.Wall = Wall;
})(doomClone || (doomClone = {}));
//# sourceMappingURL=Wall.js.map