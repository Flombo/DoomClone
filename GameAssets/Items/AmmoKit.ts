namespace doomClone {

    import f = FudgeCore;

    export class AmmoKit extends Item {

        private ammoAmount : number = 10;

        constructor(player : Player, x : number, y : number) {
            super(player, "Ammo", x, y, <HTMLImageElement>document.getElementById("ammo"));
            f.Loop.addEventListener(f.EVENT.LOOP_FRAME, this.checkCollision);
        }

        private checkCollision = () => {
            if (this.isColliding) {
                this.player.setAmmo(this.ammoAmount);
                f.Loop.removeEventListener(f.EVENT.LOOP_FRAME, this.checkCollision);
                this.removeSelf();
            }
        }

    }

}