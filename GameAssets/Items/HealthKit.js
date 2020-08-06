"use strict";
var doomClone;
(function (doomClone) {
    var f = FudgeCore;
    class HealthKit extends doomClone.Item {
        constructor(player, x, z) {
            super(player, "Health", x, z, document.getElementById("health"));
            this.healthAmount = 10;
            this.checkCollision = () => {
                if (this.getIsColliding()) {
                    if (this.getPlayer().getHealth() - this.healthAmount < 90) {
                        this.getPlayer().setHealth(this.healthAmount);
                        f.Loop.removeEventListener("loopFrame" /* LOOP_FRAME */, this.checkCollision);
                        this.removeSelf();
                    }
                }
            };
            f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.checkCollision);
        }
    }
    doomClone.HealthKit = HealthKit;
})(doomClone || (doomClone = {}));
//# sourceMappingURL=HealthKit.js.map