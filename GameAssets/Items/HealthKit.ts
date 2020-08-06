namespace doomClone {

    import f = FudgeCore;

    export class HealthKit extends Item{

        private healthAmount : number = 10;

        constructor(player: Player, x: number, z: number) {
            super(player, "Health", x, z, <HTMLImageElement>document.getElementById("health"));
            f.Loop.addEventListener(f.EVENT.LOOP_FRAME, this.checkCollision);
        }

        private checkCollision = () => {
            if (this.getIsColliding()) {
                if(this.getPlayer().getHealth() - this.healthAmount < 90) {
                    this.getPlayer().setHealth(this.healthAmount);
                    f.Loop.removeEventListener(f.EVENT.LOOP_FRAME, this.checkCollision);
                    this.removeSelf();
                }
            }
        }

    }

}