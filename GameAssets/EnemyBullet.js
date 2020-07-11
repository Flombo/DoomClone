"use strict";
var doomClone;
(function (doomClone) {
    var f = FudgeCore;
    var fAid = FudgeAid;
    class EnemyBullet extends f.Node {
        constructor(startMatrix) {
            super("Ammo");
            this.speed = 50 / 1000;
            //
            // public playExplosionAnimation(startMatrix : f.Matrix4x4) : void {
            //     let coat: ƒ.CoatTextured = new ƒ.CoatTextured();
            //     coat.texture = new ƒ.TextureImage();
            //     coat.texture.image = <HTMLImageElement>document.getElementById("enemyProjectileExplosion");
            //     let spriteSheetAnimation : fAid.SpriteSheetAnimation = new fAid.SpriteSheetAnimation("enemyProjectileExplosion", coat);
            //     let startRect : f.Rectangle = new f.Rectangle(0, 0, 16, 23, f.ORIGIN2D.TOPLEFT);
            //     spriteSheetAnimation.generateByGrid(startRect, 5, new f.Vector2(0,0), 64, f.ORIGIN2D.CENTER);
            //     this.projectileExplosionSprite = new fAid.NodeSprite('enemyProjectileExplosion');
            //     this.projectileExplosionSprite.setAnimation(spriteSheetAnimation);
            //     this.projectileExplosionSprite.framerate = 1;
            //     this.projectileExplosionSprite.setFrameDirection(1);
            //     this.addComponent(new f.ComponentTransform(f.Matrix4x4.TRANSLATION(startMatrix.translation)));
            //     this.appendChild(this.projectileExplosionSprite);
            //     this.mtxLocal.translateZ(-0.15);
            //     this.mtxLocal.rotation = startMatrix.rotation;
            // }
            this.update = () => {
                let distanceToTravel = this.speed * f.Loop.timeFrameGame;
                this.mtxLocal.translateZ(distanceToTravel);
                this.getParent().broadcastEvent(this.shotCollisionEvent);
                this.range--;
            };
            this.range = 30;
            this.damage = 5;
            this.shotCollisionEvent = new CustomEvent("enemyShotCollision");
            this.initBullet(startMatrix);
        }
        initBullet(startMatrix) {
            let coat = new ƒ.CoatTextured();
            coat.texture = new ƒ.TextureImage();
            coat.texture.image = document.getElementById("enemyProjectile");
            let spriteSheetAnimation = new fAid.SpriteSheetAnimation("enemyProjectile", coat);
            let startRect = new f.Rectangle(0, 0, 16, 23, f.ORIGIN2D.TOPLEFT);
            spriteSheetAnimation.generateByGrid(startRect, 2, new f.Vector2(0, 0), 64, f.ORIGIN2D.CENTER);
            this.projectileSprite = new fAid.NodeSprite('projectileSprite');
            this.projectileSprite.setAnimation(spriteSheetAnimation);
            this.projectileSprite.framerate = 1;
            this.projectileSprite.setFrameDirection(1);
            this.addComponent(new f.ComponentTransform(f.Matrix4x4.TRANSLATION(startMatrix.translation)));
            this.appendChild(this.projectileSprite);
            this.mtxLocal.translateZ(-0.15);
            this.mtxLocal.rotation = startMatrix.rotation;
            f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
        }
        getRange() {
            return this.range;
        }
        getDamage() {
            return this.damage;
        }
        removeEventListener() {
            f.Loop.removeEventListener("loopFrame" /* LOOP_FRAME */, this.update);
        }
    }
    doomClone.EnemyBullet = EnemyBullet;
})(doomClone || (doomClone = {}));
//# sourceMappingURL=EnemyBullet.js.map