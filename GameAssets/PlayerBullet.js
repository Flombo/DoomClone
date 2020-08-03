"use strict";
var doomClone;
(function (doomClone) {
    class PlayerBullet extends doomClone.Projectiles {
        constructor(startMatrix) {
            super("PlayerBullet", startMatrix, 100 / 1000, 30, 5, new CustomEvent("shotCollision"), 1.75, -0.25);
        }
    }
    doomClone.PlayerBullet = PlayerBullet;
})(doomClone || (doomClone = {}));
//# sourceMappingURL=PlayerBullet.js.map