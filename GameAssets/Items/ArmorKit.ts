namespace doomClone {

    import f = FudgeCore;

    export class ArmorKit extends Item {

        private armorAmount: number = 10;

        constructor(player: Player, x: number, z: number) {
            super(player, "Armor", x, z, <HTMLImageElement>document.getElementById("armor"));
            f.Loop.addEventListener(f.EVENT.LOOP_FRAME, this.checkCollision);
        }

        private checkCollision = () => {
            if (this.getIsColliding()) {
                this.getPlayer().setArmor(this.armorAmount);
                f.Loop.removeEventListener(f.EVENT.LOOP_FRAME, this.checkCollision);
                this.removeSelf();
            }
        }

    }

}