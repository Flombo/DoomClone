namespace doomClone {

    import f = FudgeCore;

    export class ArmorKit extends Item {

        private armorAmount: number = 10;

        constructor(player: Player, x: number, y: number) {
            super(player, "Armor", x, y, <HTMLImageElement>document.getElementById("armor"));
            f.Loop.addEventListener(f.EVENT.LOOP_FRAME, this.checkCollision);
        }

        private checkCollision = () => {
            if (this.isColliding) {
                this.player.setArmor(this.armorAmount);
                f.Loop.removeEventListener(f.EVENT.LOOP_FRAME, this.checkCollision);
                this.removeSelf();
            }
        }

    }

}