"use strict";
var doomClone;
(function (doomClone) {
    var f = FudgeCore;
    class Door extends doomClone.Obstacle {
        constructor(player, enemy, x, y) {
            super(player, enemy, x, y, "Door", document.getElementById("door"));
            this.playerInteractionRadius = 2.5;
            this.isClosed = true;
            this.initDoorSounds();
            this.addEventListener("playerInteraction", () => { this.checkPlayerInteraction(); }, true);
            this.addEventListener("playerCollision", () => { this.checkPlayerCollision(); }, true);
        }
        async initDoorSounds() {
            let doorClosingSound = await f.Audio.load("../../DoomClone/sounds/doorClosed.wav");
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
    }
    doomClone.Door = Door;
})(doomClone || (doomClone = {}));
//# sourceMappingURL=Door.js.map