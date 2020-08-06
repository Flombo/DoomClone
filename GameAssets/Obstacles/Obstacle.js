"use strict";
var doomClone;
(function (doomClone) {
    var f = FudgeCore;
    class Obstacle extends f.Node {
        constructor(player, enemies, x, z, name, img) {
            super(name);
            this.player = player;
            this.img = img;
            this.enemies = enemies;
            this.init(x, z);
        }
        getPlayer() {
            return this.player;
        }
        getEnemies() {
            return this.enemies;
        }
        init(x, z) {
            let componentMesh = new f.ComponentMesh(new f.MeshCube());
            let textureImage = new f.TextureImage();
            textureImage.image = this.img;
            let coatTextured = new f.CoatTextured();
            coatTextured.texture = textureImage;
            let material = new f.Material("ObstacleMaterial", f.ShaderTexture, coatTextured);
            let componentMaterial = new f.ComponentMaterial(material);
            let componentTransform = new f.ComponentTransform(f.Matrix4x4.TRANSLATION(new f.Vector3(0, 0, 0)));
            this.addComponent(componentTransform);
            this.mtxLocal.rotateY(-90);
            this.mtxLocal.rotateZ(-90);
            this.mtxLocal.translateZ(z);
            this.mtxLocal.translateX(x);
            componentMesh.pivot.scaleY(3);
            this.addComponent(componentMesh);
            this.addComponent(componentMaterial);
            this.addEventListener("shotCollision", () => { this.checkShotCollision(); }, true);
            this.addEventListener("enemyShotCollision", () => { this.checkEnemyShotCollision(); }, true);
        }
        checkShotCollision() {
            let projectiles = this.player.getCurrentBullets();
            projectiles.forEach(bullet => {
                if (bullet.getRange() > 0) {
                    if (bullet.mtxLocal.translation.isInsideSphere(this.mtxLocal.translation, 1)) {
                        bullet.playExplosionAnimation();
                        this.player.deleteCertainBullet(bullet);
                    }
                }
                else {
                    bullet.playExplosionAnimation();
                    this.player.deleteCertainBullet(bullet);
                }
            });
        }
        checkEnemyShotCollision() {
            Array.from(this.enemies).forEach(enemy => {
                let projectiles = enemy.getBullets();
                projectiles.forEach(bullet => {
                    if (bullet.getRange() > 0) {
                        if (bullet.mtxLocal.translation.isInsideSphere(this.mtxLocal.translation, 1)) {
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
    }
    doomClone.Obstacle = Obstacle;
})(doomClone || (doomClone = {}));
//# sourceMappingURL=Obstacle.js.map