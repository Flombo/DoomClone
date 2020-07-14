"use strict";
var doomClone;
(function (doomClone) {
    var f = FudgeCore;
    class AmmoKit extends doomClone.Item {
        constructor(player, x, y) {
            super(player, "Ammo", x, y, document.getElementById("ammo"));
            this.ammoAmount = 10;
            this.checkCollision = () => {
                if (this.isColliding) {
                    this.player.setAmmo(this.ammoAmount);
                    f.Loop.removeEventListener("loopFrame" /* LOOP_FRAME */, this.checkCollision);
                    this.removeSelf();
                }
            };
            f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.checkCollision);
        }
    }
    doomClone.AmmoKit = AmmoKit;
})(doomClone || (doomClone = {}));
//# sourceMappingURL=AmmoKit.js.map