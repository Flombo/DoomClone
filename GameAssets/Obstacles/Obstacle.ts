namespace doomClone {

    import f = FudgeCore;

    export class Obstacle extends f.Node {

        protected player : Player;
        protected enemies : Enemy[];
        protected playerCollisionRadius : number = 1;
        protected enemyCollisionRadius : number = 1;
        private shotCollisionRadius : number = 1;
        private img : HTMLImageElement;

        constructor(player : Player, enemies : Enemy[], x : number, y : number, name : string, img : HTMLImageElement) {
            super(name);
            this.player = player;
            this.img = img;
            this.enemies = enemies;
            this.init(x, y);
        }

        private init(x : number, y : number) : void {
            let componentMesh: f.ComponentMesh = new f.ComponentMesh(new f.MeshCube());
            componentMesh.pivot.scaleZ(3);
            let textureImage: f.TextureImage = new f.TextureImage();
            textureImage.image = this.img;
            let coatTextured: f.CoatTextured = new f.CoatTextured();
            coatTextured.texture = textureImage;
            let material: f.Material = new f.Material("ObstacleMaterial", f.ShaderTexture, coatTextured);
            let componentMaterial: f.ComponentMaterial = new f.ComponentMaterial(material);
            let componentTransform: f.ComponentTransform = new f.ComponentTransform(
                f.Matrix4x4.TRANSLATION(new f.Vector3(x, y, 0)))
            this.addComponent(componentTransform);
            this.addComponent(componentMesh);
            this.addComponent(componentMaterial);
            this.addEventListener("shotCollision", () => { this.checkShotCollision() }, true);
            this.addEventListener("enemyShotCollision", () => { this.checkEnemyShotCollision() }, true);
        }

        private checkShotCollision() : void {
            let projectiles : Bullet[] = this.player.getCurrentBullets();
            projectiles.forEach(bullet => {
                if(bullet.getRange() > 0) {
                    if (this.calculateDistance(bullet) <=  this.shotCollisionRadius) {
                        this.player.deleteCertainBullet(bullet);
                    }
                } else {
                    this.player.deleteCertainBullet(bullet);
                }
            });
        }

        private checkEnemyShotCollision() : void {
            Array.from(this.enemies).forEach(enemy =>  {
                let projectiles : EnemyBullet[] = enemy.getBullets();
                projectiles.forEach(bullet => {
                    if(bullet.getRange() > 0) {
                        if (this.calculateDistance(bullet) <=  this.shotCollisionRadius) {
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

        protected calculateDistance(node : f.Node) : number {
            let wallTranslationCopy = this.mtxLocal.translation.copy;
            let nodeTranslationCopy = node.mtxLocal.translation.copy;
            wallTranslationCopy.subtract(nodeTranslationCopy);
            return Math.sqrt(Math.pow(wallTranslationCopy.x, 2) + Math.pow(wallTranslationCopy.y, 2));
        }

    }

}