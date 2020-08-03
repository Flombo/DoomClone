"use strict";
var doomClone;
(function (doomClone) {
    var f = FudgeCore;
    var fAid = FudgeAid;
    class Projectiles extends f.Node {
        constructor(name, startMatrix, speed, range, damage, shotCollisionEvent, z, y) {
            super(name);
            this.update = () => {
                let distanceToTravel = this.speed * f.Loop.timeFrameReal;
                this.mtxLocal.translateZ(distanceToTravel);
                this.getParent().broadcastEvent(this.shotCollisionEvent);
                this.range--;
            };
            this.range = range;
            this.speed = speed;
            this.damage = damage;
            this.shotCollisionEvent = shotCollisionEvent;
            this.initProjectile(startMatrix, z, y);
            this.initProjectileExplosion();
        }
        initProjectileExplosion() {
            let coat = new ƒ.CoatTextured();
            coat.texture = new ƒ.TextureImage();
            coat.texture.image = document.getElementById("projectileExplosion");
            let spriteSheetAnimation = new fAid.SpriteSheetAnimation("projectileExplosion", coat);
            let startRect = new f.Rectangle(0, 0, 16, 23, f.ORIGIN2D.TOPLEFT);
            spriteSheetAnimation.generateByGrid(startRect, 5, new f.Vector2(0, 0), 64, f.ORIGIN2D.CENTER);
            this.projectileExplosionSprites = new fAid.NodeSprite('enemyProjectileExplosion');
            this.projectileExplosionSprites.setAnimation(spriteSheetAnimation);
            this.projectileExplosionSprites.framerate = 5;
            this.projectileExplosionSprites.setFrameDirection(1);
        }
        initProjectile(startMatrix, z, y) {
            let coat = new ƒ.CoatTextured();
            coat.texture = new ƒ.TextureImage();
            coat.texture.image = document.getElementById("projectile");
            let spriteSheetAnimation = new fAid.SpriteSheetAnimation("projectile", coat);
            let startRect = new f.Rectangle(0, 0, 16, 23, f.ORIGIN2D.TOPLEFT);
            spriteSheetAnimation.generateByGrid(startRect, 2, new f.Vector2(0, 0), 64, f.ORIGIN2D.CENTER);
            this.projectileSprites = new fAid.NodeSprite('projectileSprite');
            this.projectileSprites.setAnimation(spriteSheetAnimation);
            this.projectileSprites.framerate = 1;
            this.projectileSprites.setFrameDirection(1);
            this.addComponent(new f.ComponentTransform(f.Matrix4x4.TRANSLATION(startMatrix.translation)));
            this.mtxLocal.rotation = startMatrix.rotation;
            this.mtxLocal.translateZ(z);
            this.mtxLocal.translateY(y);
            this.appendChild(this.projectileSprites);
            f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
        }
        playExplosionAnimation() {
            this.removeChild(this.projectileSprites);
            this.appendChild(this.projectileExplosionSprites);
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
    doomClone.Projectiles = Projectiles;
})(doomClone || (doomClone = {}));
//# sourceMappingURL=Projectiles.js.map