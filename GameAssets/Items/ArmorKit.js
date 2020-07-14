"use strict";
var doomClone;
(function (doomClone) {
    var f = FudgeCore;
    class ArmorKit extends doomClone.Item {
        constructor(player, x, y) {
            super(player, "Armor", x, y, document.getElementById("armor"));
            this.armorAmount = 10;
            this.checkCollision = () => {
                if (this.isColliding) {
                    this.player.setArmor(this.armorAmount);
                    f.Loop.removeEventListener("loopFrame" /* LOOP_FRAME */, this.checkCollision);
                    this.removeSelf();
                }
            };
            f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.checkCollision);
        }
    }
    doomClone.ArmorKit = ArmorKit;
})(doomClone || (doomClone = {}));
//# sourceMappingURL=ArmorKit.js.map