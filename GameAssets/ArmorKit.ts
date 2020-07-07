namespace doomClone {

    import f = FudgeCore;

    export class ArmorKit extends f.Node{

        private readonly player : Player;
        private playerCollisionRadius : number = 0.9;
        private armorAmount : number = 10;
        private rotationSpeed : number = 50 / 1000;

        constructor(player : Player, x : number, y : number) {
            super("Amor");
            this.player = player;
            this.initWall(x, y);
        }

        private initWall(x : number, y : number) : void {
            // let ammoIMG: HTMLImageElement = <HTMLImageElement>document.getElementById("ammo");
            let armorMeshComp: f.ComponentMesh = new f.ComponentMesh(new f.MeshCube());
            armorMeshComp.pivot.scaleZ(0.25);
            armorMeshComp.pivot.scaleX(0.25);
            armorMeshComp.pivot.scaleY(0.25);
            // let ammoTextureIMG: f.TextureImage = new f.TextureImage();
            // ammoTextureIMG.image = ammoIMG;
            // let ammoTextureCoat: f.CoatTextured = new f.CoatTextured();
            // ammoTextureCoat.texture = ammoTextureIMG;
            // ammoTextureCoat.repetition = true;
            // ammoTextureCoat.tilingX = 30;
            // ammoTextureCoat.tilingY = 30;
            let armorMaterial: f.Material = new f.Material("Armor", f.ShaderUniColor, new f.CoatColored(f.Color.CSS('green')));
            let armorComponentMat: f.ComponentMaterial = new f.ComponentMaterial(armorMaterial);
            let armorComponentTransform: f.ComponentTransform = new f.ComponentTransform(
                f.Matrix4x4.TRANSLATION(new f.Vector3(x, y, 0)));
            this.addComponent(armorComponentTransform);
            this.addComponent(armorMeshComp);
            this.addComponent(armorComponentMat);
            this.mtxLocal.translateZ(-0.5);
            this.addEventListener("playerCollision", this.checkPlayerCollision.bind(this), true);
            f.Loop.addEventListener(f.EVENT.LOOP_FRAME, this.animateRotation.bind(this));
        }

        private animateRotation = () => {
            this.mtxLocal.rotateZ(this.rotationSpeed * f.Loop.timeFrameGame);
        }

        private calculateDistance(node : f.Node) : number {
            let armorTranslationCopy = this.mtxLocal.translation.copy;
            let nodeTranslationCopy = node.mtxLocal.translation.copy;
            armorTranslationCopy.subtract(nodeTranslationCopy);
            return Math.sqrt(Math.pow(armorTranslationCopy.x, 2) + Math.pow(armorTranslationCopy.y, 2));
        }

        private checkPlayerCollision = () => {
            let distance = this.calculateDistance(this.player);
            if(distance <= this.playerCollisionRadius){
                this.player.setArmor(this.armorAmount);
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