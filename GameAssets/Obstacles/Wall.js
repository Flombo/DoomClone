"use strict";
var doomClone;
(function (doomClone) {
    class Wall extends doomClone.Obstacle {
        constructor(player, enemy, x, y) {
            super(player, enemy, x, y, "Wall", document.getElementById("wall"));
            this.player = player;
            this.addEventListener("playerCollision", () => { this.checkPlayerCollision(); }, true);
            // this.initSound();
        }
        //
        // private async initSound(): Promise<void> {
        //     let explosionSound: f.Audio = await f.Audio.load("../../DoomClone/sounds/barrelExploded.wav");
        //     this.componentAudioExplosion = new f.ComponentAudio(explosionSound);
        // }
        checkPlayerCollision() {
            let distance = this.calculateDistance(this.player);
            if (distance <= this.playerCollisionRadius) {
                this.player.setIsAllowedToMove(false);
            }
        }
    }
    doomClone.Wall = Wall;
})(doomClone || (doomClone = {}));
//# sourceMappingURL=Wall.js.map