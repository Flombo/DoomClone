"use strict";
var doomClone;
(function (doomClone) {
    var f = FudgeCore;
    var fAid = FudgeAid;
    class Enemy extends f.Node {
        constructor(player, x, z) {
            super("Enemy");
            this.aggroRadius = 10;
            this.attackRadius = 5;
            this.flightRadius = 2;
            this.speed = 5 / 1000;
            this.health = 20;
            this.checkCurrentState = () => {
                if (this.isAlive) {
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
            };
            this.checkShotCollision = () => {
                let projectiles = this.player.getCurrentBullets();
                projectiles.forEach(bullet => {
                    if (bullet.getRange() > 0) {
                        if (this.isObjectColliding(bullet.mtxLocal.translation, 1)) {
                            this.addAndRemoveSprites(this.hitSprites);
                            this.player.deleteCertainBullet(bullet);
                            this.setHealth(bullet.getDamage());
                        }
                    }
                    else {
                        this.player.deleteCertainBullet(bullet);
                    }
                });
            };
            this.checkWallCollision = () => {
                this.getParent().broadcastEvent(this.checkWallCollisionForEnemyEvent);
            };
            this.checkPlayerPositionRelativeToRadius = () => {
                this.checkWallCollision();
                let playerTranslation = this.player.mtxLocal.translation;
                if (this.isAlive) {
                    if (this.isObjectColliding(playerTranslation, this.flightRadius)) {
                        this.currentState = 'flight';
                    }
                    else if (this.isObjectColliding(playerTranslation, this.attackRadius)) {
                        this.currentState = 'attack';
                    }
                    else if (this.isObjectColliding(playerTranslation, this.aggroRadius)) {
                        this.currentState = 'hunt';
                    }
                    else {
                        this.currentState = 'idle';
                    }
                }
            };
            this.player = player;
            this.attackTimer = null;
            this.currentState = 'idle';
            this.isAlive = true;
            this.bullets = [];
            this.checkWallCollisionForEnemyEvent = new CustomEvent("checkWallCollisionForEnemy");
            this.initSounds();
            this.initEnemy(x, z);
        }
        getSpeed() {
            return this.speed;
        }
        getAhead() {
            let speedTimesSight = this.speed * this.aggroRadius;
            this.ahead = this.mtxLocal.translation.copy;
            this.ahead.add(new f.Vector3(0, 0, speedTimesSight));
            return this.ahead;
        }
        getBullets() {
            return this.bullets;
        }
        getIsAlive() {
            return this.isAlive;
        }
        deleteCertainBullet(bullet) {
            let index = this.bullets.indexOf(bullet);
            this.bullets.splice(index, 1);
            bullet.removeEventListener();
            new f.Timer(f.Time.game, 500, 1, () => {
                if (this.getParent() !== null) {
                    this.getParent().removeChild(bullet);
                }
            });
        }
        async initSounds() {
            this.attackSound = await f.Audio.load("../../sounds/decademonAttack.wav");
            this.dyingSound = await f.Audio.load("../../sounds/decademonDead.wav");
            this.attackedSound = await f.Audio.load("../../sounds/decademonShot.wav");
            this.componentAudio = new f.ComponentAudio(this.attackedSound);
            this.addComponent(this.componentAudio);
        }
        initEnemy(x, z) {
            let enemyComponentTransform = new f.ComponentTransform(f.Matrix4x4.TRANSLATION(new f.Vector3(0, 0, 0)));
            this.addComponent(enemyComponentTransform);
            this.mtxLocal.rotateY(-90);
            this.mtxLocal.rotateZ(-90);
            this.mtxLocal.translateZ(z);
            this.mtxLocal.translateX(x);
            this.initSprites();
            this.addEventListener("shotCollision", () => { this.checkShotCollision(); }, true);
            f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.checkCurrentState);
            f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.checkPlayerPositionRelativeToRadius);
        }
        initSprites() {
            this.initIdleSprites();
            this.initHitSprites();
            this.initShootSprites();
            this.initDeathSprites();
        }
        initDeathSprites() {
            let img = document.getElementById("cacodemonDeath");
            let spriteSheetAnimation = doomClone.Enemy.loadSprites(img, "cacodemonDeath", 103.5, 81, 6);
            this.deathSprites = new fAid.NodeSprite('deathSprites');
            this.deathSprites.setAnimation(spriteSheetAnimation);
            this.deathSprites.framerate = 6;
            this.deathSprites.setFrameDirection(1);
        }
        initShootSprites() {
            let img = document.getElementById("cacodemonShoot");
            let spriteSheetAnimation = doomClone.Enemy.loadSprites(img, "cacodemonShoot", 65.5, 68, 4);
            this.shootSprites = new fAid.NodeSprite('cacodemonShoot');
            this.shootSprites.setAnimation(spriteSheetAnimation);
            this.shootSprites.framerate = 4;
            this.shootSprites.setFrameDirection(1);
        }
        initHitSprites() {
            let img = document.getElementById("cacodemonHit");
            let spriteSheetAnimation = doomClone.Enemy.loadSprites(img, "cacodemonHit", 63, 87, 2);
            this.hitSprites = new fAid.NodeSprite('cacodemonHit');
            this.hitSprites.setAnimation(spriteSheetAnimation);
            this.hitSprites.framerate = 2;
            this.hitSprites.setFrameDirection(1);
        }
        initIdleSprites() {
            let img = document.getElementById("cacodemonIdle");
            let spriteSheetAnimation = doomClone.Enemy.loadSprites(img, "cacodemonIdle", 99, 68, 5);
            this.idleSprites = new fAid.NodeSprite('cacodemonIdle');
            this.idleSprites.setAnimation(spriteSheetAnimation);
            this.idleSprites.framerate = 1;
            this.idleSprites.setFrameDirection(1);
            this.appendChild(this.idleSprites);
        }
        static loadSprites(img, spriteName, width, height, frameAmount) {
            let coat = new ƒ.CoatTextured();
            coat.texture = new ƒ.TextureImage();
            coat.texture.image = img;
            let spriteSheetAnimation = new fAid.SpriteSheetAnimation(spriteName, coat);
            let startRect = new f.Rectangle(0, 0, width, height, f.ORIGIN2D.TOPLEFT);
            spriteSheetAnimation.generateByGrid(startRect, frameAmount, new f.Vector2(0, 0), 64, f.ORIGIN2D.CENTER);
            return spriteSheetAnimation;
        }
        idle() {
            this.addAndRemoveSprites(this.idleSprites);
            this.idleSprites.setFrameDirection(1);
            this.mtxLocal.lookAt(this.player.mtxLocal.translation, f.Vector3.Z());
        }
        hunt() {
            this.mtxLocal.lookAt(this.player.mtxLocal.translation, f.Vector3.Z());
            this.mtxLocal.translateZ(this.speed * f.Loop.timeFrameReal);
            this.idleSprites.showFrame(0);
            this.idleSprites.setFrameDirection(0);
        }
        flee() {
            this.addAndRemoveSprites(this.idleSprites);
            this.idleSprites.showFrame(3);
            // this.mtxLocal.lookAt(this.player.mtxLocal.translation, f.Vector3.Z());
            this.mtxLocal.translateZ(-this.speed * f.Loop.timeFrameReal);
        }
        attack() {
            if (!this.player.getIsDead() && this.isAlive && this.attackTimer === null) {
                this.mtxLocal.lookAt(this.player.mtxLocal.translation, f.Vector3.Z());
                this.attackTimer = new f.Timer(f.Time.game, 1000, 1, () => {
                    this.addAndRemoveSprites(this.shootSprites);
                    this.componentAudio.audio = this.attackSound;
                    this.componentAudio.play(true);
                    if (this.getParent() !== null) {
                        let enemyBullet = new doomClone.EnemyBullet(this.mtxLocal);
                        this.bullets.push(enemyBullet);
                        this.getParent().appendChild(enemyBullet);
                    }
                    this.attackTimer = null;
                });
            }
        }
        addAndRemoveSprites(addSprite) {
            let children = this.getChildren();
            let isAddSpriteChild = false;
            children.forEach(child => {
                if (child instanceof fAid.NodeSprite) {
                    if (child.name !== addSprite.name) {
                        this.removeChild(child);
                    }
                    else {
                        isAddSpriteChild = true;
                    }
                }
            });
            if (!isAddSpriteChild) {
                this.appendChild(addSprite);
            }
        }
        setHealth(damage) {
            if (this.health - damage <= 0) {
                this.attackTimer = null;
                this.isAlive = false;
                this.componentAudio.audio = this.attackedSound;
                this.die();
            }
            else {
                this.componentAudio.audio = this.dyingSound;
                this.health -= damage;
            }
            this.componentAudio.play(true);
        }
        die() {
            this.mtxLocal.translateY(-0.25);
            this.removeEventListener("shotCollision", this.checkShotCollision);
            f.Loop.removeEventListener("loopFrame" /* LOOP_FRAME */, this.checkPlayerPositionRelativeToRadius);
            f.Loop.removeEventListener("loopFrame" /* LOOP_FRAME */, this.checkCurrentState);
            this.addAndRemoveSprites(this.deathSprites);
            this.bullets.forEach(bullet => {
                this.deleteCertainBullet(bullet);
            });
            new f.Timer(f.Time.game, 1000, 1, () => {
                if (this.getParent() !== null) {
                    this.getParent().removeChild(this);
                }
            });
        }
        isObjectColliding(objectTranslation, radius) {
            return objectTranslation.isInsideSphere(this.mtxLocal.translation, radius);
        }
    }
    doomClone.Enemy = Enemy;
})(doomClone || (doomClone = {}));
//# sourceMappingURL=Enemy.js.map