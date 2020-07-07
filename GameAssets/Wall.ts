namespace doomClone {

    import f = FudgeCore;

    export class Wall extends f.Node{

        private player : Player;
        private playerCollisionRadius : number = 0.9;
        private shotCollisionRadius : number = 0.9;
        private componentAudioExplosion : f.ComponentAudio;

        constructor(player : Player, x : number, y : number) {
            super("Wall");
            this.player = player;
            this.initWall(x, y);
            this.initSound();
        }

        private async initSound() : Promise<void> {
            let explosionSound : f.Audio = await f.Audio.load("../../DoomClone/sounds/barrelExploded.wav");
            this.componentAudioExplosion = new f.ComponentAudio(explosionSound);
        }

        private initWall(x : number, y : number) : void {
            let wallIMG: HTMLImageElement = <HTMLImageElement>document.getElementById("wall");
            let wallMeshComp: f.ComponentMesh = new f.ComponentMesh(new f.MeshCube());
            wallMeshComp.pivot.scaleZ(3);
            let wallTextureIMG: f.TextureImage = new f.TextureImage();
            wallTextureIMG.image = wallIMG;
            let wallTextureCoat: f.CoatTextured = new f.CoatTextured();
            wallTextureCoat.texture = wallTextureIMG;
            let wallMaterial: f.Material = new f.Material("Wall", f.ShaderTexture, wallTextureCoat);
            let wallComponentMat: f.ComponentMaterial = new f.ComponentMaterial(wallMaterial);
            let wallComponentTransform: f.ComponentTransform = new f.ComponentTransform(
                f.Matrix4x4.TRANSLATION(new f.Vector3(x, y, 0)))
            this.addComponent(wallComponentTransform);
            this.addComponent(wallMeshComp);
            this.addComponent(wallComponentMat);
            this.addEventListener("playerCollision", () => { this.checkPlayerCollision() }, true);
            this.addEventListener("shotCollision", () => { this.checkShotCollision() }, true);
        }

        private checkShotCollision() : void {
            let projectiles : Bullet[] = this.player.getCurrentBullets();
            projectiles.forEach(bullet => {
                if(bullet.getRange() > 0) {
                    if (this.calculateDistance(bullet) <=  this.shotCollisionRadius) {
                        this.player.deleteCertainBullet(bullet);
                        this.componentAudioExplosion.play(true)
                    }
                } else {
                    this.player.deleteCertainBullet(bullet);
                }
            });
        }

        private calculateDistance(node : f.Node) : number {
            let wallTranslationCopy = this.mtxLocal.translation.copy;
            let nodeTranslationCopy = node.mtxLocal.translation.copy;
            wallTranslationCopy.subtract(nodeTranslationCopy);
            return Math.sqrt(Math.pow(wallTranslationCopy.x, 2) + Math.pow(wallTranslationCopy.y, 2));
        }

        private checkPlayerCollision() : void {
            let distance = this.calculateDistance(this.player);
            if(distance <= this.playerCollisionRadius){
                this.player.setIsAllowedToMove(false);
            }
        }
    }



}