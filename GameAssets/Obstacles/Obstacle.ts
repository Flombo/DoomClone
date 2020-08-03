namespace doomClone {

    import f = FudgeCore;

    export class Obstacle extends f.Node {

        protected player : Player;
        protected enemies : Enemy[];
        private img : HTMLImageElement;

        constructor(player : Player, enemies : Enemy[], x : number, z : number, name : string, img : HTMLImageElement) {
            super(name);
            this.player = player;
            this.img = img;
            this.enemies = enemies;
            this.init(x, z);
        }

        private init(x : number, z: number) : void {
            let componentMesh: f.ComponentMesh = new f.ComponentMesh(new f.MeshCube());
            let textureImage: f.TextureImage = new f.TextureImage();
            textureImage.image = this.img;
            let coatTextured: f.CoatTextured = new f.CoatTextured();
            coatTextured.texture = textureImage;
            let material: f.Material = new f.Material("ObstacleMaterial", f.ShaderTexture, coatTextured);
            let componentMaterial: f.ComponentMaterial = new f.ComponentMaterial(material);
            let componentTransform: f.ComponentTransform = new f.ComponentTransform(
                f.Matrix4x4.TRANSLATION(new f.Vector3(0, 0, 0)));
            this.addComponent(componentTransform);
            this.mtxLocal.rotateY(-90);
            this.mtxLocal.rotateZ(-90);
            this.mtxLocal.translateZ(z);
            this.mtxLocal.translateX(x);
            componentMesh.pivot.scaleY(3);
            this.addComponent(componentMesh);
            this.addComponent(componentMaterial);
            this.addEventListener("shotCollision", () => { this.checkShotCollision() }, true);
            this.addEventListener("enemyShotCollision", () => { this.checkEnemyShotCollision() }, true);
        }

        private checkShotCollision() : void {
            let projectiles : PlayerBullet[] = this.player.getCurrentBullets();
            projectiles.forEach(bullet => {
                if(bullet.getRange() > 0) {
                    if (bullet.mtxLocal.translation.isInsideSphere(this.mtxLocal.translation, 1)) {
                        bullet.playExplosionAnimation();
                        this.player.deleteCertainBullet(bullet);
                    }
                } else {
                    bullet.playExplosionAnimation();
                    this.player.deleteCertainBullet(bullet);
                }
            });
        }

        private checkEnemyShotCollision() : void {
            Array.from(this.enemies).forEach(enemy =>  {
                let projectiles : EnemyBullet[] = enemy.getBullets();
                projectiles.forEach(bullet => {
                    if(bullet.getRange() > 0) {
                        if (bullet.mtxLocal.translation.isInsideSphere(this.mtxLocal.translation, 1)) {
                            bullet.playExplosionAnimation();
                            enemy.deleteCertainBullet(bullet);
                        }
                    } else {
                        bullet.playExplosionAnimation();
                        enemy.deleteCertainBullet(bullet);
                    }
                });
            });
        }

    }

}