"use strict";
var doomClone;
(function (doomClone) {
    var f = FudgeCore;
    class Door extends doomClone.Obstacle {
        constructor(player, enemies, x, y) {
            super(player, enemies, x, y, "Door", document.getElementById("door"));
            this.playerInteractionRadius = 2.5;
            this.isClosed = true;
            this.mtxLocal.scaleY(2);
            this.initDoorSounds();
            this.addEventListener("playerInteraction", () => { this.checkPlayerInteraction(); }, true);
            this.addEventListener("playerCollision", () => { this.checkPlayerCollision(); }, true);
            this.addEventListener("checkWallCollisionForEnemy", () => { this.checkEnemyCollision(); }, true);
        }
        async initDoorSounds() {
            let doorClosingSound = await f.Audio.load("../../sounds/doorClosed.wav");
            this.componentAudioDoorClosingAndOpening = new f.ComponentAudio(doorClosingSound);
            this.addComponent(this.componentAudioDoorClosingAndOpening);
        }
        checkPlayerInteraction() {
            let distance = this.calculateDistance(this.player);
            if (distance <= this.playerInteractionRadius) {
                this.closeOrOpenDoor();
            }
        }
        closeOrOpenDoor() {
            if (this.isClosed) {
                this.isClosed = false;
                new f.Timer(f.Time.game, 100, 6, () => {
                    this.mtxLocal.translateZ(0.5);
                });
            }
            else {
                this.isClosed = true;
                new f.Timer(f.Time.game, 100, 6, () => {
                    this.mtxLocal.translateZ(-0.5);
                });
            }
            this.componentAudioDoorClosingAndOpening.play(true);
        }
        checkPlayerCollision() {
            if (this.isClosed) {
                let distance = this.calculateDistance(this.player);
                if (distance <= this.playerCollisionRadius) {
                    this.player.setIsAllowedToMove(false);
                }
            }
        }
        checkEnemyCollision() {
            if (this.isClosed) {
                Array.from(this.enemies).forEach(enemy => {
                    let distance = this.calculateDistance(enemy);
                    if (distance <= this.enemyCollisionRadius) {
                        enemy.setCurrentState('avoid');
                    }
                });
            }
        }
    }
    doomClone.Door = Door;
})(doomClone || (doomClone = {}));
//# sourceMappingURL=Door.js.map