"use strict";
var doomClone;
(function (doomClone) {
    var f = FudgeCore;
    class Obstacle extends f.Node {
        constructor(player, enemies, x, y, name, img) {
            super(name);
            this.playerCollisionRadius = 1;
            this.enemyCollisionRadius = 1;
            this.shotCollisionRadius = 1;
            this.player = player;
            this.img = img;
            this.enemies = enemies;
            this.init(x, y);
        }
        init(x, y) {
            let componentMesh = new f.ComponentMesh(new f.MeshCube());
            componentMesh.pivot.scaleZ(3);
            let textureImage = new f.TextureImage();
            textureImage.image = this.img;
            let coatTextured = new f.CoatTextured();
            coatTextured.texture = textureImage;
            let material = new f.Material("ObstacleMaterial", f.ShaderTexture, coatTextured);
            let componentMaterial = new f.ComponentMaterial(material);
            let componentTransform = new f.ComponentTransform(f.Matrix4x4.TRANSLATION(new f.Vector3(x, y, 0)));
            this.addComponent(componentTransform);
            this.addComponent(componentMesh);
            this.addComponent(componentMaterial);
            this.addEventListener("shotCollision", () => { this.checkShotCollision(); }, true);
            this.addEventListener("enemyShotCollision", () => { this.checkEnemyShotCollision(); }, true);
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
            Array.from(this.enemies).forEach(enemy => {
                let projectiles = enemy.getBullets();
                projectiles.forEach(bullet => {
                    if (bullet.getRange() > 0) {
                        if (this.calculateDistance(bullet) <= this.shotCollisionRadius) {
                            bullet.playExplosionAnimation();
                            enemy.deleteCertainBullet(bullet);
                        }
                    }
                    else {
                        bullet.playExplosionAnimation();
                        enemy.deleteCertainBullet(bullet);
                    }
                });
            });
        }
        calculateDistance(node) {
            let wallTranslationCopy = this.mtxLocal.translation.copy;
            let nodeTranslationCopy = node.mtxLocal.translation.copy;
            wallTranslationCopy.subtract(nodeTranslationCopy);
            return Math.sqrt(Math.pow(wallTranslationCopy.x, 2) + Math.pow(wallTranslationCopy.y, 2));
        }
    }
    doomClone.Obstacle = Obstacle;
})(doomClone || (doomClone = {}));
//# sourceMappingURL=Obstacle.js.map