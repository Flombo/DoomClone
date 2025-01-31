namespace doomClone {

    import f =  FudgeCore;
    import fAid = FudgeAid;

    enum EnemyRadius {
        AGGRO = 10, ATTACK = EnemyRadius.AGGRO / 2, FLIGHT = EnemyRadius.ATTACK / 2
    }

    export class Enemy extends f.Node{

        private speed : number = 5 / 1000;
        private readonly player : Player;
        private health : number = 20;
        private readonly bullets : EnemyBullet[];
        private componentAudio : f.ComponentAudio;
        private idleSprites : fAid.NodeSprite;
        private hitSprites : fAid.NodeSprite;
        private shootSprites : fAid.NodeSprite;
        private deathSprites : fAid.NodeSprite;
        private attackSound : f.Audio;
        private dyingSound : f.Audio;
        private attackedSound : f.Audio;
        private readonly checkWallCollisionForEnemyEvent : CustomEvent;
        private currentState : string;
        private attackTimer : f.Timer
        private isAlive : boolean;
        private moveAmount : number;
        private isGamePaused : boolean;

        constructor(player : Player, x : number, z : number) {
            super("Enemy");
            this.player = player;
            this.attackTimer = null;
            this.currentState = 'idle';
            this.isAlive = true;
            this.isGamePaused = false;
            this.bullets = [];
            this.checkWallCollisionForEnemyEvent = new CustomEvent<any>("checkWallCollisionForEnemy");
            this.initSounds();
            this.initEnemy(x,z);
        }

        public setIsGamePaused(isGamePaused : boolean) : void {
            this.isGamePaused = isGamePaused;
        }

        public getMoveAmount() : number {
            return this.moveAmount;
        }

        public getBullets() : EnemyBullet[] {
            return this.bullets;
        }

        public getIsAlive() : boolean {
            return this.isAlive;
        }

        public deleteCertainBullet(bullet : EnemyBullet) : void {
            let index : number = this.bullets.indexOf(bullet);
            this.bullets.splice(index, 1);
            bullet.removeEventListener();
            new f.Timer(f.Time.game, 500, 1, () => {
                if(this.getParent() !== null) {
                    this.getParent().removeChild(bullet);
                }
            });
        }

        public initEnemy(x : number, z : number) : void {
            let enemyComponentTransform: f.ComponentTransform = new f.ComponentTransform(
                f.Matrix4x4.TRANSLATION(new f.Vector3(0, 0, 0)));
            this.addComponent(enemyComponentTransform);
            this.mtxLocal.rotateY(-90);
            this.mtxLocal.rotateZ(-90);
            this.mtxLocal.translateZ(z);
            this.mtxLocal.translateX(x);
            this.initSprites();
            this.addEventListener("shotCollision", () => { this.checkShotCollision() }, true);
            f.Loop.addEventListener(f.EVENT.LOOP_FRAME, this.checkCurrentState);
            f.Loop.addEventListener(f.EVENT.LOOP_FRAME, this.checkPlayerPositionRelativeToRadius);
        }

        private async initSounds() : Promise<void> {
            this.attackSound = await f.Audio.load("../../sounds/decademonAttack.wav");
            this.dyingSound = await f.Audio.load("../../sounds/decademonDead.wav");
            this.attackedSound = await f.Audio.load("../../sounds/decademonShot.wav");
            this.componentAudio = new f.ComponentAudio(this.attackedSound);
            this.addComponent(this.componentAudio);
        }

        private initSprites() : void {
            this.initIdleSprites();
            this.initHitSprites();
            this.initShootSprites();
            this.initDeathSprites();
        }

        private initDeathSprites() : void {
            let img : HTMLImageElement = <HTMLImageElement>document.getElementById("cacodemonDeath");
            let spriteSheetAnimation : fAid.SpriteSheetAnimation = doomClone.Enemy.loadSprites(
                img,
                "cacodemonDeath",
                103.5,
                81,
                6
            );
            this.deathSprites = new fAid.NodeSprite('deathSprites');
            this.deathSprites.setAnimation(spriteSheetAnimation);
            this.deathSprites.framerate = 6;
            this.deathSprites.setFrameDirection(1);
        }

        private initShootSprites() : void {
            let img : HTMLImageElement = <HTMLImageElement>document.getElementById("cacodemonShoot");
            let spriteSheetAnimation : fAid.SpriteSheetAnimation = doomClone.Enemy.loadSprites(
                img,
                "cacodemonShoot",
                65.5,
                68,
                4
            );
            this.shootSprites = new fAid.NodeSprite('cacodemonShoot');
            this.shootSprites.setAnimation(spriteSheetAnimation);
            this.shootSprites.framerate = 4;
            this.shootSprites.setFrameDirection(1);
        }

        private initHitSprites() : void {
            let img : HTMLImageElement = <HTMLImageElement>document.getElementById("cacodemonHit");
            let spriteSheetAnimation : fAid.SpriteSheetAnimation = doomClone.Enemy.loadSprites(
                img,
                "cacodemonHit",
                63,
                87,
                2
            );
            this.hitSprites = new fAid.NodeSprite('cacodemonHit');
            this.hitSprites.setAnimation(spriteSheetAnimation);
            this.hitSprites.framerate = 2;
            this.hitSprites.setFrameDirection(1);
        }

        private initIdleSprites() : void {
            let img : HTMLImageElement = <HTMLImageElement>document.getElementById("cacodemonIdle");
            let spriteSheetAnimation : fAid.SpriteSheetAnimation = doomClone.Enemy.loadSprites(
                img,
                "cacodemonIdle",
                99,
                68,
                5
            );
            this.idleSprites = new fAid.NodeSprite('cacodemonIdle');
            this.idleSprites.setAnimation(spriteSheetAnimation);
            this.idleSprites.framerate = 1;
            this.idleSprites.setFrameDirection(1);
            this.appendChild(this.idleSprites);
        }

        private static loadSprites(
            img : HTMLImageElement,
            spriteName : string,
            width : number,
            height : number,
            frameAmount : number,
        ) : fAid.SpriteSheetAnimation {
            let coat: ƒ.CoatTextured = new ƒ.CoatTextured();
            coat.texture = new ƒ.TextureImage();
            coat.texture.image = img;
            let spriteSheetAnimation : fAid.SpriteSheetAnimation = new fAid.SpriteSheetAnimation(spriteName, coat);
            let startRect : f.Rectangle = new f.Rectangle(0, 0, width, height, f.ORIGIN2D.TOPLEFT);
            spriteSheetAnimation.generateByGrid(startRect, frameAmount, new f.Vector2(0,0), 64, f.ORIGIN2D.CENTER);
            return spriteSheetAnimation;
        }

        private checkCurrentState = () => {
            if(!this.isGamePaused && this.isAlive) {
                switch (this.currentState) {
                    case 'hunt':
                        this.hunt();
                        break;
                    case 'attack':
                        this.attack();
                        break;
                    case 'flight':
                        this.flee();
                        break;
                    case 'idle':
                        this.idle();
                        break;
                }
            }
        }

        private idle() : void {
            this.addAndRemoveSprites(this.idleSprites);
            this.idleSprites.setFrameDirection(1);
        }

        private hunt() : void {
            this.moveAmount = this.speed * f.Loop.timeFrameGame;
            this.mtxLocal.translateZ(this.moveAmount);
            this.idleSprites.showFrame(0);
            this.idleSprites.setFrameDirection(0);
        }

        private flee() : void {
            this.addAndRemoveSprites(this.idleSprites);
            this.idleSprites.showFrame(3);
            this.moveAmount = -this.speed * f.Loop.timeFrameGame;
            this.mtxLocal.translateZ(this.moveAmount);
        }

        private attack() : void {
            if(!this.player.getIsDead() && this.isAlive && this.attackTimer === null) {
                this.attackTimer = new f.Timer(f.Time.game, 1000, 1, () => {
                    this.addAndRemoveSprites(this.shootSprites);
                    this.componentAudio.audio = this.attackSound;
                    this.componentAudio.play(true);
                    if(this.getParent() !== null){
                        let enemyBullet: EnemyBullet = new EnemyBullet(this.mtxLocal);
                        this.bullets.push(enemyBullet);
                        this.getParent().appendChild(enemyBullet);
                    }
                    this.attackTimer = null;
                });
            }
        }

        private addAndRemoveSprites(addSprite : fAid.NodeSprite) : void {
            let children : f.Node[] = this.getChildren();
            let isAddSpriteChild : boolean = false;
            children.forEach(child => {
               if(child instanceof fAid.NodeSprite){
                   if(child.name !== addSprite.name){
                       this.removeChild(child);
                   } else {
                       isAddSpriteChild = true;
                   }
               }
            });
            if(!isAddSpriteChild){
                this.appendChild(addSprite);
            }
        }

        private setHealth(damage : number) : void {
            if(this.health - damage <= 0) {
                this.attackTimer = null;
                this.isAlive = false;
                this.componentAudio.audio = this.attackedSound;
                this.die();
            } else {
                this.componentAudio.audio = this.dyingSound;
                this.health -= damage;
            }
            this.componentAudio.play(true);
        }

        private die() : void {
            this.mtxLocal.translateY(-0.25);
            this.removeEventListener("shotCollision", this.checkShotCollision);
            f.Loop.removeEventListener(f.EVENT.LOOP_FRAME, this.checkPlayerPositionRelativeToRadius);
            f.Loop.removeEventListener(f.EVENT.LOOP_FRAME, this.checkCurrentState);
            this.addAndRemoveSprites(this.deathSprites);
            this.bullets.forEach(bullet => {
               this.deleteCertainBullet(bullet);
            });
            new f.Timer(f.Time.game, 1000, 1, () => {
                if(this.getParent() !== null) {
                    this.getParent().removeChild(this);
                }
            });
        }

        private checkShotCollision = () => {
            if(!this.isGamePaused) {
                let projectiles: PlayerBullet[] = this.player.getCurrentBullets();
                projectiles.forEach(bullet => {
                    if (bullet.getRange() > 0) {
                        if (this.isObjectColliding(bullet.mtxLocal.translation, 1)) {
                            this.addAndRemoveSprites(this.hitSprites);
                            bullet.playExplosionAnimation();
                            this.player.deleteCertainBullet(bullet);
                            this.setHealth(bullet.getDamage());
                        }
                    } else {
                        bullet.playExplosionAnimation();
                        this.player.deleteCertainBullet(bullet);
                    }
                });
            }
        }

        private checkWallCollision = () => {
            this.getParent().broadcastEvent(this.checkWallCollisionForEnemyEvent);
        }

        private checkPlayerPositionRelativeToRadius = () => {
            this.checkWallCollision();
            let playerTranslation : f.Vector3 = this.player.mtxLocal.translation;
            this.mtxLocal.lookAt(playerTranslation, f.Vector3.Z(), true);
            if(!this.isGamePaused && this.isAlive) {
                if (this.isObjectColliding(playerTranslation, EnemyRadius.FLIGHT)
                ) {
                    this.currentState = 'flight';
                } else if (this.isObjectColliding(playerTranslation, EnemyRadius.ATTACK)
                ) {
                    this.currentState = 'attack';
                } else if (this.isObjectColliding(playerTranslation, EnemyRadius.AGGRO)) {
                    this.currentState = 'hunt';
                } else {
                    this.currentState = 'idle';
                }
            }
        }

        private isObjectColliding(objectTranslation : f.Vector3, radius : number) : boolean {
            return objectTranslation.isInsideSphere(this.mtxLocal.translation, radius);
        }

    }

}