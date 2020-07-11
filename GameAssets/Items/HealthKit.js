"use strict";
var doomClone;
(function (doomClone) {
    var f = FudgeCore;
    class HealthKit extends doomClone.Item {
        constructor(player, x, y) {
            super(player, x, y, "Health", "red");
            this.healthAmount = 10;
            this.checkCollision = () => {
                if (this.isColliding) {
                    if (this.player.getHealth() - this.healthAmount < 90) {
                        this.player.setHealth(this.healthAmount);
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