"use strict";
var doomClone;
(function (doomClone) {
    class Wall extends doomClone.Obstacle {
        constructor(player, enemies, x, y) {
            super(player, enemies, x, y, "Wall", document.getElementById("wall"));
            this.player = player;
            this.addEventListener("playerCollision", () => { this.checkPlayerCollision(); }, true);
            this.addEventListener("checkWallCollisionForEnemy", () => { this.checkEnemyCollision(); }, true);
        }
        checkPlayerCollision() {
            let distance = this.calculateDistance(this.player);
            if (distance <= this.playerCollisionRadius) {
                this.player.setIsAllowedToMove(false);
            }
        }
        checkEnemyCollision() {
            Array.from(this.enemies).forEach(enemy => {
                let distance = this.calculateDistance(enemy);
                if (distance <= this.enemyCollisionRadius) {
                    enemy.setCurrentState('avoid');
                }
            });
        }
    }
    doomClone.Wall = Wall;
})(doomClone || (doomClone = {}));
//# sourceMappingURL=Wall.js.map