namespace doomClone {

    import f = FudgeCore;
    import fAid = FudgeAid;

    export class Projectiles extends f.Node {

        private speed : number;
        private range : number;
        private damage : number;
        private projectileSprites : fAid.NodeSprite;
        private projectileExplosionSprites : fAid.NodeSprite;
        private readonly shotCollisionEvent : CustomEvent;

        constructor(
            name : string,
            startMatrix : f.Matrix4x4,
            speed : number,
            range : number,
            damage : number,
            shotCollisionEvent : CustomEvent,
            z : number,
            y : number
        ) {
            super(name);
            this.range = range;
            this.speed = speed;
            this.damage = damage;
            this.shotCollisionEvent = shotCollisionEvent;
            this.initProjectile(startMatrix, z, y);
            this.initProjectileExplosion();
        }

        private initProjectileExplosion() : void {
            let coat: ƒ.CoatTextured = new ƒ.CoatTextured();
            coat.texture = new ƒ.TextureImage();
            coat.texture.image = <HTMLImageElement>document.getElementById("projectileExplosion");
            let spriteSheetAnimation : fAid.SpriteSheetAnimation = new fAid.SpriteSheetAnimation("projectileExplosion", coat);
            let startRect : f.Rectangle = new f.Rectangle(0, 0, 16, 23, f.ORIGIN2D.TOPLEFT);
            spriteSheetAnimation.generateByGrid(startRect, 5, new f.Vector2(0,0), 64, f.ORIGIN2D.CENTER);
            this.projectileExplosionSprites = new fAid.NodeSprite('enemyProjectileExplosion');
            this.projectileExplosionSprites.setAnimation(spriteSheetAnimation);
            this.projectileExplosionSprites.framerate = 5;
            this.projectileExplosionSprites.setFrameDirection(1);
        }

        private initProjectile(startMatrix : f.Matrix4x4, z : number, y : number) : void {
            let coat: ƒ.CoatTextured = new ƒ.CoatTextured();
            coat.texture = new ƒ.TextureImage();
            coat.texture.image = <HTMLImageElement>document.getElementById("projectile");
            let spriteSheetAnimation : fAid.SpriteSheetAnimation = new fAid.SpriteSheetAnimation("projectile", coat);
            let startRect : f.Rectangle = new f.Rectangle(0, 0, 16, 23, f.ORIGIN2D.TOPLEFT);
            spriteSheetAnimation.generateByGrid(startRect, 2, new f.Vector2(0,0), 64, f.ORIGIN2D.CENTER);
            this.projectileSprites = new fAid.NodeSprite('projectileSprite');
            this.projectileSprites.setAnimation(spriteSheetAnimation);
            this.projectileSprites.framerate = 1;
            this.projectileSprites.setFrameDirection(1);
            this.addComponent(new f.ComponentTransform(f.Matrix4x4.TRANSLATION(startMatrix.translation)));
            this.mtxLocal.rotation = startMatrix.rotation;
            this.mtxLocal.translateZ(z);
            this.mtxLocal.translateY(y)
            this.appendChild(this.projectileSprites);
            f.Loop.addEventListener(f.EVENT.LOOP_FRAME, this.update);
        }

        public playExplosionAnimation() : void {
            this.removeChild(this.projectileSprites);
            this.appendChild(this.projectileExplosionSprites);
        }

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