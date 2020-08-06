namespace doomClone {

    import f = FudgeCore;

    export class Door extends Obstacle{

        private isClosed : boolean;
        private componentAudioDoorClosingAndOpening : f.ComponentAudio;
        private interactionPrompt : HTMLDivElement;

        constructor(player : Player, enemies : Enemy[], x : number, z : number) {
            super(player, enemies, x, z, "Door", <HTMLImageElement>document.getElementById("door"));
            this.interactionPrompt = <HTMLDivElement>document.getElementById("interactionPrompt");
            this.isClosed = true;
            this.mtxLocal.scaleZ(2);
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
            if(this.checkPlayerInteractionDistance()) {
                this.closeOrOpenDoor();
            }
        }

        private checkPlayerInteractionDistance() : boolean {
            let isPlayerInInteractionRadius : boolean =
                this.getPlayer().mtxLocal.translation.isInsideSphere(this.mtxLocal.translation, 3.5);
            if(isPlayerInInteractionRadius){
                this.interactionPrompt.innerText = `Press "${localStorage.getItem('INTERACT')}" to interact`;
                this.interactionPrompt.setAttribute("style", "opacity: 1");
            } else {
                this.interactionPrompt.setAttribute("style", "opacity: 0");
            }
            return isPlayerInInteractionRadius;
        }

        private closeOrOpenDoor() : void {
            if(this.isClosed) {
                this.isClosed = false;
                new f.Timer(f.Time.game, 100, 6, () => {
                    this.mtxLocal.translateY(0.5);
                });
            } else {
                this.isClosed = true;
                new f.Timer(f.Time.game, 100, 6, () => {
                    this.mtxLocal.translateY(-0.5);
                });
            }
            this.componentAudioDoorClosingAndOpening.play(true);
        }

        private checkPlayerCollision() : void {
            if(this.isClosed) {
                let player : Player = this.getPlayer();
                if (player.mtxLocal.translation.isInsideSphere(this.mtxLocal.translation, 1)) {
                    player.mtxLocal.translateZ(-player.getMoveAmount());
                }
            }
        }

        private checkEnemyCollision() : void {
            this.checkPlayerInteractionDistance();
            if(this.isClosed) {
                Array.from(this.getEnemies()).forEach(enemy => {
                    if(enemy.mtxLocal.translation.isInsideSphere(this.mtxLocal.translation, 1)) {
                        enemy.mtxLocal.translateZ(-enemy.getMoveAmount());
                        enemy.mtxLocal.rotateY(90);
                    }
                });
            }
        }

    }

}