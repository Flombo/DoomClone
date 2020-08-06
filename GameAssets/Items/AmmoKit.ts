namespace doomClone {

    import f = FudgeCore;

    export class AmmoKit extends Item {

        private ammoAmount : number = 10;

        constructor(player : Player, x : number, z : number) {
            super(player, "Ammo", x, z, <HTMLImageElement>document.getElementById("ammo"));
            f.Loop.addEventListener(f.EVENT.LOOP_FRAME, this.checkCollision);
        }

        private checkCollision = () => {
            if (this.getIsColliding()) {
                this.getPlayer().setAmmo(this.ammoAmount);
                f.Loop.removeEventListener(f.EVENT.LOOP_FRAME, this.checkCollision);
                this.removeSelf();
            }
        }

    }

}