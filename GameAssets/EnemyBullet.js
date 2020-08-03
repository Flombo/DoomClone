"use strict";
var doomClone;
(function (doomClone) {
    class EnemyBullet extends doomClone.Projectiles {
        constructor(startMatrix) {
            super("EnemyBullet", startMatrix, 50 / 1000, 10, 2, new CustomEvent("enemyShotCollision"), 0, -0.15);
        }
    }
    doomClone.EnemyBullet = EnemyBullet;
})(doomClone || (doomClone = {}));
//# sourceMappingURL=EnemyBullet.js.map