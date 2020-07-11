namespace doomClone {

    import f = FudgeCore;

    export class AmmoKit extends Item {

        private ammoAmount : number = 10;

        constructor(player : Player, x : number, y : number) {
            super(player, x, y, "Ammo", "yellow");
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