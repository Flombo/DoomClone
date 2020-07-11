namespace doomClone {

    import f = FudgeCore;
    import fAid = FudgeAid;

    export class EnemyBullet extends f.Node{

        private speed : number = 50 / 1000;
        private range : number;
        private damage : number;
        private projectileSprite : fAid.NodeSprite;
        private projectileExplosionSprite : fAid.NodeSprite;
        private readonly shotCollisionEvent : CustomEvent;

        constructor(startMatrix : f.Matrix4x4) {
            super("Ammo");
            this.range = 30;
            this.damage = 5;
            this.shotCollisionEvent = new CustomEvent<any>("enemyShotCollision")
            this.initBullet(startMatrix);
        }

        private initBullet(startMatrix : f.Matrix4x4) : void {
            let coat: ƒ.CoatTextured = new ƒ.CoatTextured();
            coat.texture = new ƒ.TextureImage();
            coat.texture.image = <HTMLImageElement>document.getElementById("enemyProjectile");
            let spriteSheetAnimation : fAid.SpriteSheetAnimation = new fAid.SpriteSheetAnimation("enemyProjectile", coat);
            let startRect : f.Rectangle = new f.Rectangle(0, 0, 16, 23, f.ORIGIN2D.TOPLEFT);
            spriteSheetAnimation.generateByGrid(startRect, 2, new f.Vector2(0,0), 64, f.ORIGIN2D.CENTER);
            this.projectileSprite = new fAid.NodeSprite('projectileSprite');
            this.projectileSprite.setAnimation(spriteSheetAnimation);
            this.projectileSprite.framerate = 1;
            this.projectileSprite.setFrameDirection(1);
            this.addComponent(new f.ComponentTransform(f.Matrix4x4.TRANSLATION(startMatrix.translation)));
            this.appendChild(this.projectileSprite);
            this.mtxLocal.translateZ(-0.15);
            this.mtxLocal.rotation = startMatrix.rotation;
            f.Loop.addEventListener(f.EVENT.LOOP_FRAME, this.update);
        }
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

        private update = () =>  {
            let distanceToTravel: number = this.speed * f.Loop.timeFrameGame;
            this.mtxLocal.translateZ(distanceToTravel);
            this.getParent().broadcastEvent(this.shotCollisionEvent);
            this.range--;
        }

        public getRange() : number {
            return this.range;
        }

        public getDamage() : number {
            return this.damage;
        }

        public removeEventListener() : void {
            f.Loop.removeEventListener(f.EVENT.LOOP_FRAME, this.update);
        }

    }

}