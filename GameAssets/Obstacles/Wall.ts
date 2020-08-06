namespace doomClone {

    export class Wall extends Obstacle {

        constructor(player: Player, enemies : Enemy[], x: number, z: number) {
            super(player, enemies, x, z, "Wall", <HTMLImageElement>document.getElementById("wall"));
            this.addEventListener("playerCollision", () => { this.checkPlayerCollision() }, true);
            this.addEventListener("checkWallCollisionForEnemy", () => { this.checkEnemyCollision() }, true);
        }

        private checkPlayerCollision() : void {
            let player : Player = this.getPlayer();
            if(player.mtxLocal.translation.isInsideSphere(this.mtxLocal.translation, 1)){
                player.mtxLocal.translateZ(-player.getMoveAmount());
            }
        }

        private checkEnemyCollision() : void {
            Array.from(this.getEnemies()).forEach(enemy => {
                if(enemy.mtxLocal.translation.isInsideSphere(this.mtxLocal.translation, 1)) {
                    enemy.mtxLocal.translateZ(-enemy.getMoveAmount());
                    enemy.mtxLocal.rotateY(90);
                }
            });
        }

    }

}