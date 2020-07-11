"use strict";
var doomClone;
(function (doomClone) {
    var f = FudgeCore;
    class Obstacle extends f.Node {
        constructor(player, enemy, x, y, name, img) {
            super(name);
            this.playerCollisionRadius = 0.9;
            this.enemyCollisionRadius = 1.4;
            this.shotCollisionRadius = 0.9;
            this.player = player;
            this.img = img;
            this.enemy = enemy;
            this.init(x, y);
        }
        init(x, y) {
            let wallMeshComp = new f.ComponentMesh(new f.MeshCube());
            wallMeshComp.pivot.scaleZ(3);
            let wallTextureIMG = new f.TextureImage();
            wallTextureIMG.image = this.img;
            let wallTextureCoat = new f.CoatTextured();
            wallTextureCoat.texture = wallTextureIMG;
            let wallMaterial = new f.Material("Wall", f.ShaderTexture, wallTextureCoat);
            let wallComponentMat = new f.ComponentMaterial(wallMaterial);
            let wallComponentTransform = new f.ComponentTransform(f.Matrix4x4.TRANSLATION(new f.Vector3(x, y, 0)));
            this.addComponent(wallComponentTransform);
            this.addComponent(wallMeshComp);
            this.addComponent(wallComponentMat);
            this.addEventListener("shotCollision", () => { this.checkShotCollision(); }, true);
            this.addEventListener("enemyShotCollision", () => { this.checkEnemyShotCollision(); }, true);
            this.addEventListener("checkWallCollisionForEnemy", () => { this.checkEnemyCollision(); }, true);
        }
        checkShotCollision() {
            let projectiles = this.player.getCurrentBullets();
            projectiles.forEach(bullet => {
                if (bullet.getRange() > 0) {
                    if (this.calculateDistance(bullet) <= this.shotCollisionRadius) {
                        this.player.deleteCertainBullet(bullet);
                    }
                }
                else {
                    this.player.deleteCertainBullet(bullet);
                }
            });
        }
        checkEnemyShotCollision() {
            let projectiles = this.enemy.getBullets();
            projectiles.forEach(bullet => {
                if (bullet.getRange() > 0) {
                    if (this.calculateDistance(bullet) <= this.shotCollisionRadius) {
                        // bullet.playExplosionAnimation(this.enemy.mtxLocal);
                        this.enemy.deleteCertainBullet(bullet);
                    }
                }
                else {
                    this.enemy.deleteCertainBullet(bullet);
                }
            });
        }
        calculateDistance(node) {
            let wallTranslationCopy = this.mtxLocal.translation.copy;
            let nodeTranslationCopy = node.mtxLocal.translation.copy;
            wallTranslationCopy.subtract(nodeTranslationCopy);
            return Math.sqrt(Math.pow(wallTranslationCopy.x, 2) + Math.pow(wallTranslationCopy.y, 2));
        }
        checkEnemyCollision() {
            let distance = this.calculateDistance(this.enemy);
            if (distance <= this.enemyCollisionRadius) {
                this.enemy.setCurrentState('avoid');
            }
            else {
                this.enemy.setCurrentState('idle');
            }
        }
    }
    doomClone.Obstacle = Obstacle;
})(doomClone || (doomClone = {}));
//# sourceMappingURL=Obstacle.js.map