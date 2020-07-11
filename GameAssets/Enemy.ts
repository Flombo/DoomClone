namespace doomClone {

    import f =  FudgeCore;
    import fAid = FudgeAid;

    export class Enemy extends f.Node{

        private aggroRadius : number = 20;
        private attackRadius : number = 15;
        private flightRadius : number = 10;
        private shotCollisionRadius : number = 1;
        private speed : number = 5 / 1000;
        private player : Player;
        private health : number = 20;
        private bullets : EnemyBullet[];
        private componentAudio : f.ComponentAudio;
        private idleSprites : fAid.NodeSprite;
        private hitSprites : fAid.NodeSprite;
        private shootSprites : fAid.NodeSprite;
        private deathSprites : fAid.NodeSprite;
        private attackSound : f.Audio;
        private dyingSound : f.Audio;
        private attackedSound : f.Audio;
        private aggroRadiusTimer : f.Timer;
        private checkWallCollisionForEnemyEvent : CustomEvent;
        private currentState : string;
        private attackTimer : f.Timer;

        constructor(player : Player, x : number, y : number) {
            super("Enemy");
            this.player = player;
            this.attackTimer = null;
            this.currentState = 'idle';
            this.bullets = [];
            this.checkWallCollisionForEnemyEvent = new CustomEvent<any>("checkWallCollisionForEnemy");
            this.initEnemy(x,y);
            this.initSounds();
        }

        public setCurrentState(state : string) : void {
            this.currentState = state;
        }

        public getBullets() : EnemyBullet[] {
            return this.bullets;
        }

        public deleteCertainBullet(bullet : EnemyBullet) : void {
            let index : number = this.bullets.indexOf(bullet);
            this.bullets.splice(index, 1);
            bullet.removeEventListener();
            this.getParent().removeChild(bullet);
        }

        private async initSounds() : Promise<void> {
            this.attackSound = await f.Audio.load("../../DoomClone/sounds/decademonAttack.wav");
            this.dyingSound = await f.Audio.load("../../DoomClone/sounds/decademonDead.wav");
            this.attackedSound = await f.Audio.load("../../DoomClone/sounds/decademonShot.wav");
            this.componentAudio = new f.ComponentAudio(this.attackedSound);
        }

        private initEnemy(x : number, y : number) : void {
            let enemyComponentTransform: f.ComponentTransform = new f.ComponentTransform(
                f.Matrix4x4.TRANSLATION(new f.Vector3(x, y, 0)));
            this.addComponent(enemyComponentTransform);
            this.initSprites();
            this.addEventListener("shotCollision", () => { this.checkShotCollision() }, true);
            f.Loop.addEventListener(f.EVENT.LOOP_FRAME, this.checkCurrentState);
            this.aggroRadiusTimer = new f.Timer(f.Time.game, 100, 0, () => {
                this.checkPlayerDistanceToAggroRadius();
            });
        }

        private initSprites() : void {
            this.initIdleSprites();
            this.initHitSprites();
            this.initShootSprites();
            this.initDeathSprites();
        }

        private initDeathSprites() : void {
            let img : HTMLImageElement = <HTMLImageElement>document.getElementById("cacodemonDeath");
            let spriteSheetAnimation : fAid.SpriteSheetAnimation = this.loadSprites(
                img,
                "cacodemonDeath",
                103.5,
                81,
                6
            );
            this.deathSprites = new fAid.NodeSprite('deathSprites');
            this.deathSprites.setAnimation(spriteSheetAnimation);
            this.deathSprites.framerate = 1;
            this.deathSprites.setFrameDirection(1);
        }

        private initShootSprites() : void {
            let img : HTMLImageElement = <HTMLImageElement>document.getElementById("cacodemonShoot");
            let spriteSheetAnimation : fAid.SpriteSheetAnimation = this.loadSprites(
                img,
                "cacodemonShoot",
                65.5,
                68,
                4
            );
            this.shootSprites = new fAid.NodeSprite('cacodemonShoot');
            this.shootSprites.setAnimation(spriteSheetAnimation);
            this.shootSprites.framerate = 5;
            this.shootSprites.setFrameDirection(1);
        }

        private initHitSprites() : void {
            let img : HTMLImageElement = <HTMLImageElement>document.getElementById("cacodemonHit");
            let spriteSheetAnimation : fAid.SpriteSheetAnimation = this.loadSprites(
                img,
                "cacodemonHit",
                63,
                87,
                2
            );
            this.hitSprites = new fAid.NodeSprite('cacodemonHit');
            this.hitSprites.setAnimation(spriteSheetAnimation);
            this.hitSprites.framerate = 1;
            this.hitSprites.setFrameDirection(1);
        }

        private initIdleSprites() : void {
            let img : HTMLImageElement = <HTMLImageElement>document.getElementById("cacodemonIdle");
            let spriteSheetAnimation : fAid.SpriteSheetAnimation = this.loadSprites(
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

        private loadSprites(
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
            console.log(this.currentState);
            switch (this.currentState) {
                case 'avoid':
                    this.avoid();
                    break;
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
                    this.addAndRemoveSprites(this.idleSprites);
                    this.mtxLocal.lookAt(this.player.mtxLocal.translation, f.Vector3.Z());
                    break;
            }
        }

        private avoid() : void {
            this.addAndRemoveSprites(this.idleSprites);
            this.mtxLocal.translateZ((-3) * this.speed * f.Loop.timeFrameGame);
            let diffX : number = this.mtxLocal.translation.x - this.player.mtxLocal.translation.x;
            let targetVector : f.Vector3 = new f.Vector3(diffX, this.mtxLocal.translation.y, this.mtxLocal.translation.z);
            this.mtxLocal.lookAt(targetVector, f.Vector3.Z());
            this.mtxLocal.translateZ(this.speed * f.Loop.timeFrameGame);
        }

        private hunt() : void {
            // if(this.getChildrenByName("cacodemonShoot") !== null){
            //     this.addAndRemoveSprites(this.idleSprites, this.shootSprites);
            // }
            this.checkAttackDistance();
            this.mtxLocal.lookAt(this.player.mtxLocal.translation, f.Vector3.Z());
            this.mtxLocal.translateZ(this.speed * f.Loop.timeFrameGame);
            this.idleSprites.showFrame(0);
            this.idleSprites.setFrameDirection(0);
        }

        private flee() : void {
            this.addAndRemoveSprites(this.idleSprites);
            this.idleSprites.showFrame(3);
            this.mtxLocal.lookAt(this.player.mtxLocal.translation, f.Vector3.Z());
            this.mtxLocal.translateZ(-(2 * this.speed) * f.Loop.timeFrameGame);
        }

        private attack() : void {
            if(this.attackTimer === null) {
                this.attackTimer = new f.Timer(f.Time.game, 700, 1, () => {
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
                this.componentAudio.audio = this.attackedSound;
                this.die();
            } else {
                this.componentAudio.audio = this.dyingSound;
                this.health -= damage;
            }
            this.componentAudio.play(true);
        }

        private die() : void {
            this.addAndRemoveSprites(this.deathSprites);
            f.Loop.removeEventListener(f.EVENT.LOOP_FRAME, this.checkCurrentState);
            this.removeEventListener("shotCollision", this.checkShotCollision);
            this.aggroRadiusTimer.clear();
            this.bullets.forEach(bullet => {
                this.deleteCertainBullet(bullet);
            });
            this.getParent().removeChild(this);
        }

        private checkPlayerDistanceToAggroRadius = () => {
            this.checkWallCollision();
            let distance = this.calculateDistance(this.player);
            if(distance <= this.aggroRadius) {
                this.currentState = 'hunt';
            } else {
                if(this.currentState !== 'avoid'){
                    this.idleSprites.setFrameDirection(1);
                    this.currentState = 'idle';
                }
            }
        }

        private checkShotCollision = () => {
            let projectiles : Bullet[] = this.player.getCurrentBullets();
            projectiles.forEach(bullet => {
                if(bullet.getRange() > 0) {
                    if (this.calculateDistance(bullet) <=  this.shotCollisionRadius) {
                        this.addAndRemoveSprites(this.hitSprites);
                        this.player.deleteCertainBullet(bullet);
                        this.setHealth(bullet.getDamage());
                    }
                } else {
                    this.player.deleteCertainBullet(bullet);
                }
            });
        }

        private calculateDistance(node : f.Node) : number {
            let enemyTranslationCopy = this.mtxLocal.translation.copy;
            let nodeTranslationCopy = node.mtxLocal.translation.copy;
            enemyTranslationCopy.subtract(nodeTranslationCopy);
            return Math.sqrt(Math.pow(enemyTranslationCopy.x, 2) + Math.pow(enemyTranslationCopy.y, 2));
        }

        private checkWallCollision = () => {
            this.getParent().broadcastEvent(this.checkWallCollisionForEnemyEvent);
        }

        private checkAttackDistance = () => {
            let distance = this.calculateDistance(this.player);
            if(this.currentState !== 'flight' && distance <= this.attackRadius){
                if(distance > this.flightRadius) {
                    this.currentState = 'attack';
                } else {
                    this.currentState = 'flight';
                }
            }
        }
    }

}