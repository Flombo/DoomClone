namespace doomClone {

    export class Wall extends Obstacle {

        constructor(player: Player, enemy: Enemy, x: number, y: number) {
            super(player, enemy, x, y, "Wall", <HTMLImageElement>document.getElementById("wall"));
            this.player = player;
            this.addEventListener("playerCollision", () => { this.checkPlayerCollision() }, true);
            // this.initSound();
        }
        //
        // private async initSound(): Promise<void> {
        //     let explosionSound: f.Audio = await f.Audio.load("../../DoomClone/sounds/barrelExploded.wav");
        //     this.componentAudioExplosion = new f.ComponentAudio(explosionSound);
        // }

        private checkPlayerCollision() : void {
            let distance = this.calculateDistance(this.player);
            if(distance <= this.playerCollisionRadius){
                this.player.setIsAllowedToMove(false);
            }
        }
    }

}