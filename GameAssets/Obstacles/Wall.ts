namespace doomClone {

    import f = FudgeCore;

    export class Wall extends Obstacle {

        constructor(player: Player, enemies : Enemy[], x: number, z: number) {
            super(player, enemies, x, z, "Wall", <HTMLImageElement>document.getElementById("wall"));
            this.player = player;
            this.addEventListener("playerCollision", () => { this.checkPlayerCollision() }, true);
            this.addEventListener("checkWallCollisionForEnemy", () => { this.checkEnemyCollision() }, true);
        }

        private checkPlayerCollision() : void {
            if(this.player.mtxLocal.translation.isInsideSphere(this.mtxLocal.translation, 1)){
                this.player.mtxLocal.translateZ(-this.player.moveAmount);
            }
        }

        private checkEnemyCollision() : void {
            Array.from(this.enemies).forEach(enemy => {
                if(enemy.getAhead().isInsideSphere(this.mtxLocal.translation, 1)) {
                    let avoidanceForce : f.Vector3 = enemy.getAhead().copy;
                    avoidanceForce.subtract(this.mtxLocal.translation.copy);
                    enemy.mtxLocal.translateZ((enemy.getSpeed()) + avoidanceForce.z);
                    enemy.mtxLocal.translateX((enemy.getSpeed()) + avoidanceForce.x);
                }
            });
        }

    }

}