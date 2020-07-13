namespace doomClone {

    import f = FudgeCore;

    export class Door extends Obstacle{

        private isClosed : boolean;
        private playerInteractionRadius : number = 2.5;
        private componentAudioDoorClosingAndOpening : f.ComponentAudio;

        constructor(player : Player, enemies : Enemy[], x : number, y : number) {
            super(player, enemies, x, y, "Door", <HTMLImageElement>document.getElementById("door"));
            this.isClosed = true;
            this.mtxLocal.scaleY(2);
            this.initDoorSounds();
            this.addEventListener("playerInteraction", () => { this.checkPlayerInteraction() }, true);
            this.addEventListener("playerCollision", () => { this.checkPlayerCollision() }, true);
            this.addEventListener("checkWallCollisionForEnemy", () => { this.checkEnemyCollision() }, true);
        }

        private async initDoorSounds() : Promise<void> {
            let doorClosingSound : f.Audio = await f.Audio.load("../../sounds/doorClosed.wav");
            this.componentAudioDoorClosingAndOpening = new f.ComponentAudio(doorClosingSound);
            this.addComponent(this.componentAudioDoorClosingAndOpening);
        }

        private checkPlayerInteraction() : void {
            let distance = this.calculateDistance(this.player);
            if(distance <= this.playerInteractionRadius){
                this.closeOrOpenDoor();
            }
        }

        private closeOrOpenDoor() : void {
            if(this.isClosed) {
                this.isClosed = false;
                new f.Timer(f.Time.game, 100, 6, () => {
                    this.mtxLocal.translateZ(0.5);
                });
            } else {
                this.isClosed = true;
                new f.Timer(f.Time.game, 100, 6, () => {
                    this.mtxLocal.translateZ(-0.5);
                });
            }
            this.componentAudioDoorClosingAndOpening.play(true);
        }

        private checkPlayerCollision() : void {
            if(this.isClosed) {
                let distance = this.calculateDistance(this.player);
                if (distance <= this.playerCollisionRadius) {
                    this.player.setIsAllowedToMove(false);
                }
            }
        }

        private checkEnemyCollision() : void {
            if(this.isClosed) {
                Array.from(this.enemies).forEach(enemy => {
                    let distance = this.calculateDistance(enemy);
                    if(distance <= this.enemyCollisionRadius) {
                        enemy.setCurrentState('avoid');
                    }
                });
            }
        }

    }

}