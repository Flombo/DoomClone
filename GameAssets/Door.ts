namespace doomClone {

    import f = FudgeCore;

    export class Door extends f.Node{

        private player : Player;
        private playerCollisionRadius : number = 0.9;
        private playerInteractionRadius : number = 1.1;
        private shotCollisionRadius : number = 0.5;
        private isClosed : boolean;
        private componentAudioOpening : f.ComponentAudio;
        private componentAudioClosing : f.ComponentAudio;

        constructor(player : Player, x : number, y : number) {
            super("Door");
            this.isClosed = true;
            this.player = player;
            this.initDoor(x, y);
            this.initDoorSounds();
        }

        private async initDoorSounds() : Promise<void> {
            let doorOpeningSound : f.Audio = await f.Audio.load("../../DoomClone/sounds/doorOpened.wav");
            let doorClosingSound : f.Audio = await f.Audio.load("../../DoomClone/sounds/doorClosed.wav");
            this.componentAudioOpening = new f.ComponentAudio(doorOpeningSound);
            this.componentAudioClosing = new f.ComponentAudio(doorClosingSound);
            this.addComponent(this.componentAudioClosing);
            this.addComponent(this.componentAudioOpening);
        }

        private initDoor(x : number, y : number) : void {
            let doorIMG: HTMLImageElement = <HTMLImageElement>document.getElementById("door");
            let doorMeshComp: f.ComponentMesh = new f.ComponentMesh(new f.MeshCube());
            doorMeshComp.pivot.scaleZ(3);
            let doorTextureIMG: f.TextureImage = new f.TextureImage();
            doorTextureIMG.image = doorIMG;
            let doorTextureCoat: f.CoatTextured = new f.CoatTextured();
            doorTextureCoat.texture = doorTextureIMG;
            let doorMaterial: f.Material = new f.Material("Door", f.ShaderTexture, doorTextureCoat);
            let doorComponentMat: f.ComponentMaterial = new f.ComponentMaterial(doorMaterial);
            let doorComponentTransform: f.ComponentTransform = new f.ComponentTransform(
                f.Matrix4x4.TRANSLATION(new f.Vector3(x, y, 0)));
            this.addComponent(doorComponentTransform);
            this.addComponent(doorMeshComp);
            this.addComponent(doorComponentMat);
            this.addEventListener("playerCollision", () => { this.checkPlayerCollision() }, true);
            this.addEventListener("shotCollision", () => { this.checkShotCollision() }, true);
            this.addEventListener("playerInteraction", () => { this.checkPlayerInteraction() }, true);
        }

        private checkShotCollision() : void {
            let projectiles : Bullet[] = this.player.getCurrentBullets();
            projectiles.forEach(bullet => {
                if(bullet.getRange() > 0) {
                    if (this.isClosed && this.calculateDistance(bullet) <=  this.shotCollisionRadius) {
                        this.player.deleteCertainBullet(bullet);
                    }
                } else {
                    this.player.deleteCertainBullet(bullet);
                }
            });
        }

        private calculateDistance(node : f.Node) : number {
            let doorTranslationCopy = this.mtxLocal.translation.copy;
            let nodeTranslationCopy = node.mtxLocal.translation.copy;
            doorTranslationCopy.subtract(nodeTranslationCopy);
            return Math.sqrt(Math.pow(doorTranslationCopy.x, 2) + Math.pow(doorTranslationCopy.y, 2));
        }

        private checkPlayerInteraction() : void {
            let distance = this.calculateDistance(this.player);
            if(distance <= this.playerInteractionRadius){
                this.closeOrOpenDoor();
            }
        }

        private closeOrOpenDoor() : void {
            if(this.isClosed) {
                this.isClosed = false;
                new f.Timer(f.Time.game, 100, 6, () => {
                    this.mtxLocal.translateZ(0.5);
                });
                this.componentAudioOpening.play(true);
            } else {
                this.isClosed = true;
                new f.Timer(f.Time.game, 100, 6, () => {
                    this.mtxLocal.translateZ(-0.5);
                });
                this.componentAudioClosing.play(true);
            }
        }

        private checkPlayerCollision() : void {
            if(this.isClosed) {
                if (this.calculateDistance(this.player) <= this.playerCollisionRadius) {
                    this.player.setIsAllowedToMove(false);
                }
            }
        }

    }

}