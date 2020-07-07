namespace doomClone {

    import f = FudgeCore;

    export class AmmoKit extends f.Node{

        private readonly player : Player;
        private playerCollisionRadius : number = 0.9;
        private ammoAmount : number = 10;
        private rotationSpeed : number = 50 / 1000;

        constructor(player : Player, x : number, y : number) {
            super("Ammo");
            this.player = player;
            this.initWall(x, y);
        }

        private initWall(x : number, y : number) : void {
            // let ammoIMG: HTMLImageElement = <HTMLImageElement>document.getElementById("ammo");
            let ammoMeshComp: f.ComponentMesh = new f.ComponentMesh(new f.MeshCube());
            ammoMeshComp.pivot.scaleZ(0.25);
            ammoMeshComp.pivot.scaleX(0.25);
            ammoMeshComp.pivot.scaleY(0.25);
            // let ammoTextureIMG: f.TextureImage = new f.TextureImage();
            // ammoTextureIMG.image = ammoIMG;
            // let ammoTextureCoat: f.CoatTextured = new f.CoatTextured();
            // ammoTextureCoat.texture = ammoTextureIMG;
            // ammoTextureCoat.repetition = true;
            // ammoTextureCoat.tilingX = 30;
            // ammoTextureCoat.tilingY = 30;
            let ammoMaterial: f.Material = new f.Material("Ammo", f.ShaderUniColor, new f.CoatColored(f.Color.CSS('yellow')));
            let ammoComponentMat: f.ComponentMaterial = new f.ComponentMaterial(ammoMaterial);
            let ammoComponentTransform: f.ComponentTransform = new f.ComponentTransform(
                f.Matrix4x4.TRANSLATION(new f.Vector3(x, y, 0)));
            this.addComponent(ammoComponentTransform);
            this.addComponent(ammoMeshComp);
            this.addComponent(ammoComponentMat);
            this.mtxLocal.translateZ(-0.5);
            this.addEventListener("playerCollision", this.checkPlayerCollision.bind(this), true);
            f.Loop.addEventListener(f.EVENT.LOOP_FRAME, this.animateRotation.bind(this));
        }

        private animateRotation = () => {
            this.mtxLocal.rotateZ(this.rotationSpeed * f.Loop.timeFrameGame);
        }

        private calculateDistance(node : f.Node) : number {
            let ammoTranslationCopy = this.mtxLocal.translation.copy;
            let nodeTranslationCopy = node.mtxLocal.translation.copy;
            ammoTranslationCopy.subtract(nodeTranslationCopy);
            return Math.sqrt(Math.pow(ammoTranslationCopy.x, 2) + Math.pow(ammoTranslationCopy.y, 2));
        }

        private checkPlayerCollision = () => {
            let distance = this.calculateDistance(this.player);
            if(distance <= this.playerCollisionRadius){
                this.player.setAmmo(this.ammoAmount);
                this.removeSelf();
            }
        }

        private removeSelf() : void {
            this.removeEventListener("playerCollision", this.checkPlayerCollision);
            this.removeEventListener(f.EVENT.LOOP_FRAME, this.animateRotation);
            this.getParent().removeChild(this);
        }

    }

}