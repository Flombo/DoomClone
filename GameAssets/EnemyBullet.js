"use strict";
var doomClone;
(function (doomClone) {
    var f = FudgeCore;
    var fAid = FudgeAid;
    class EnemyBullet extends f.Node {
        constructor(startMatrix) {
            super("Ammo");
            this.speed = 50 / 1000;
            this.update = () => {
                let distanceToTravel = this.speed * f.Loop.timeFrameGame;
                this.mtxLocal.translateZ(distanceToTravel);
                this.getParent().broadcastEvent(this.shotCollisionEvent);
                this.range--;
            };
            this.range = 10;
            this.damage = 2;
            this.shotCollisionEvent = new CustomEvent("enemyShotCollision");
            this.initBullet(startMatrix);
            this.initExplosionSprite();
            this.initSound();
        }
        async initSound() {
            let explosionSound = await f.Audio.load("../../sounds/barrelExploded.wav");
            this.componentAudioExplosion = new f.ComponentAudio(explosionSound);
        }
        initExplosionSprite() {
            let coat = new ƒ.CoatTextured();
            coat.texture = new ƒ.TextureImage();
            coat.texture.image = document.getElementById("enemyProjectileExplosion");
            let spriteSheetAnimation = new fAid.SpriteSheetAnimation("enemyProjectileExplosion", coat);
            let startRect = new f.Rectangle(0, 0, 16, 23, f.ORIGIN2D.TOPLEFT);
            spriteSheetAnimation.generateByGrid(startRect, 5, new f.Vector2(0, 0), 64, f.ORIGIN2D.CENTER);
            this.projectileExplosionSprite = new fAid.NodeSprite('enemyProjectileExplosion');
            this.projectileExplosionSprite.setAnimation(spriteSheetAnimation);
            this.projectileExplosionSprite.framerate = 5;
            this.projectileExplosionSprite.setFrameDirection(1);
        }
        initBullet(startMatrix) {
            let coat = new ƒ.CoatTextured();
            coat.texture = new ƒ.TextureImage();
            coat.texture.image = document.getElementById("projectile");
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
        playExplosionAnimation() {
            this.componentAudioExplosion.play(true);
            this.removeChild(this.projectileSprite);
            this.appendChild(this.projectileExplosionSprite);
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