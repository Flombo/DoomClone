namespace doomClone {

    import f = FudgeCore;

    export class HealthKit extends f.Node{

        private readonly player : Player;
        private playerCollisionRadius : number = 0.9;
        private healthAmount : number = 10;
        private rotationSpeed : number = 50 / 1000;

        constructor(player : Player, x : number, y : number) {
            super("Health");
            this.player = player;
            this.initWall(x, y);
        }

        private initWall(x : number, y : number) : void {
            // let ammoIMG: HTMLImageElement = <HTMLImageElement>document.getElementById("ammo");
            let healthMeshComp: f.ComponentMesh = new f.ComponentMesh(new f.MeshCube());
            healthMeshComp.pivot.scaleZ(0.25);
            healthMeshComp.pivot.scaleX(0.25);
            healthMeshComp.pivot.scaleY(0.25);
            // let ammoTextureIMG: f.TextureImage = new f.TextureImage();
            // ammoTextureIMG.image = ammoIMG;
            // let ammoTextureCoat: f.CoatTextured = new f.CoatTextured();
            // ammoTextureCoat.texture = ammoTextureIMG;
            // ammoTextureCoat.repetition = true;
            // ammoTextureCoat.tilingX = 30;
            // ammoTextureCoat.tilingY = 30;
            let healthMaterial: f.Material = new f.Material("Health", f.ShaderUniColor, new f.CoatColored(f.Color.CSS('red')));
            let healthComponentMat: f.ComponentMaterial = new f.ComponentMaterial(healthMaterial);
            let healthComponentTransform: f.ComponentTransform = new f.ComponentTransform(
                f.Matrix4x4.TRANSLATION(new f.Vector3(x, y, 0)));
            this.addComponent(healthComponentTransform);
            this.addComponent(healthMeshComp);
            this.addComponent(healthComponentMat);
            this.mtxLocal.translateZ(-0.5);
            this.addEventListener("playerCollision", this.checkPlayerCollision.bind(this), true);
            f.Loop.addEventListener(f.EVENT.LOOP_FRAME, this.animateRotation.bind(this));
        }

        private animateRotation = () => {
            this.mtxLocal.rotateZ(this.rotationSpeed * f.Loop.timeFrameGame);
        }

        private calculateDistance(node : f.Node) : number {
            let healthTranslationCopy = this.mtxLocal.translation.copy;
            let nodeTranslationCopy = node.mtxLocal.translation.copy;
            healthTranslationCopy.subtract(nodeTranslationCopy);
            return Math.sqrt(Math.pow(healthTranslationCopy.x, 2) + Math.pow(healthTranslationCopy.y, 2));
        }

        private checkPlayerCollision = () => {
            let distance = this.calculateDistance(this.player);
            if(distance <= this.playerCollisionRadius){
                if(this.player.getHealth() - this.healthAmount < 90) {
                    this.player.setHealth(this.healthAmount);
                    this.removeSelf();
                }
            }
        }

        private removeSelf() : void {
            this.removeEventListener("playerCollision", this.checkPlayerCollision);
            this.removeEventListener(f.EVENT.LOOP_FRAME, this.animateRotation);
            this.getParent().removeChild(this);
        }

    }

}