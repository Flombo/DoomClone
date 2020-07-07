"use strict";
var doomClone;
(function (doomClone) {
    var f = FudgeCore;
    class Enemy extends f.Node {
        constructor(player, x, y) {
            super("Enemy");
            this.aggroRadius = 10;
            this.shotCollisionRadius = 0.9;
            this.playerColisionRadius = 0.9;
            this.speed = 15 / 1000;
            this.health = 20;
            this.damage = 5;
            this.checkPlayerDistanceToAggroRadius = () => {
                let distance = this.calculateDistance(this.player);
                if (distance <= this.aggroRadius) {
                    this.mtxLocal.lookAtRotate(this.player.mtxLocal.translation, f.Vector3.X());
                    this.mtxLocal.translateZ(this.speed * f.Loop.timeFrameGame);
                }
            };
            this.checkShotCollision = () => {
                let projectiles = this.player.getCurrentBullets();
                projectiles.forEach(bullet => {
                    if (bullet.getRange() > 0) {
                        if (this.calculateDistance(bullet) <= this.shotCollisionRadius) {
                            this.player.deleteCertainBullet(bullet);
                            this.setHealth(bullet.getDamage());
                        }
                    }
                    else {
                        this.player.deleteCertainBullet(bullet);
                    }
                });
            };
            this.checkPlayerCollision = () => {
                this.checkPlayerDistanceToAggroRadius();
                let distance = this.calculateDistance(this.player);
                if (distance <= this.playerColisionRadius) {
                    this.mtxLocal.translateZ(-(this.speed * 5) * f.Loop.timeFrameGame);
                    this.componentAudioAttack.play(true);
                    this.player.playPlayerAttackedSound();
                    this.player.setHealth(-this.damage);
                }
            };
            this.player = player;
            this.initEnemy(x, y);
            this.initSounds();
        }
        async initSounds() {
            let attackSound = await f.Audio.load("../../DoomClone/sounds/decademonAttack.wav");
            let deadSound = await f.Audio.load("../../DoomClone/sounds/decademonDead.wav");
            let shotSound = await f.Audio.load("../../DoomClone/sounds/decademonShot.wav");
            this.componentAudioAttack = new f.ComponentAudio(attackSound);
            this.componentAudioDead = new f.ComponentAudio(deadSound);
            this.componentAudioShot = new f.ComponentAudio(shotSound);
        }
        initEnemy(x, y) {
            let enemyMeshComp = new f.ComponentMesh(new f.MeshSphere());
            let enemyMaterial = new f.Material("Wall", f.ShaderUniColor, new f.CoatColored(f.Color.CSS('red')));
            let enemyComponentMat = new f.ComponentMaterial(enemyMaterial);
            let enemyComponentTransform = new f.ComponentTransform(f.Matrix4x4.TRANSLATION(new f.Vector3(x, y, 0)));
            this.addComponent(enemyComponentTransform);
            this.addComponent(enemyMeshComp);
            this.addComponent(enemyComponentMat);
            this.addEventListener("playerCollision", () => { this.checkPlayerCollision(); }, true);
            this.addEventListener("shotCollision", () => { this.checkShotCollision(); }, true);
        }
        setHealth(damage) {
            if (this.health - damage <= 0) {
                this.componentAudioDead.play(true);
                this.die();
            }
            else {
                this.componentAudioShot.play(true);
                this.health -= damage;
            }
        }
        die() {
            this.removeEventListener("playerCollision", this.checkPlayerCollision);
            this.removeEventListener("shotCollision", this.checkShotCollision);
            // f.Loop.removeEventListener(f.EVENT.LOOP_FRAME, this.checkPlayerDistanceToAggroRadius);
            this.getParent().removeChild(this);
        }
        calculateDistance(node) {
            let enemyTranslationCopy = this.mtxLocal.translation.copy;
            let nodeTranslationCopy = node.mtxLocal.translation.copy;
            enemyTranslationCopy.subtract(nodeTranslationCopy);
            return Math.sqrt(Math.pow(enemyTranslationCopy.x, 2) + Math.pow(enemyTranslationCopy.y, 2));
        }
    }
    doomClone.Enemy = Enemy;
})(doomClone || (doomClone = {}));
//# sourceMappingURL=Enemy.js.map