namespace doomClone {

    export class Wall extends Obstacle {

        constructor(player: Player, enemies : Enemy[], x: number, y: number) {
            super(player, enemies, x, y, "Wall", <HTMLImageElement>document.getElementById("wall"));
            this.player = player;
            this.addEventListener("playerCollision", () => { this.checkPlayerCollision() }, true);
            this.addEventListener("checkWallCollisionForEnemy", () => { this.checkEnemyCollision() }, true);
        }

        private checkPlayerCollision() : void {
            let distance = this.calculateDistance(this.player);
            if(distance <= this.playerCollisionRadius){
                this.player.setIsAllowedToMove(false);
            }
        }

        private checkEnemyCollision() : void {
            Array.from(this.enemies).forEach(enemy => {
                let distance = this.calculateDistance(enemy);
                if(distance <= this.enemyCollisionRadius) {
                    enemy.setCurrentState('avoid');
                }
            });
        }

    }

}