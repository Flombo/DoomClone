namespace doomClone {

    import f = FudgeCore;

    export class Item extends f.Node{

        private readonly player : Player;
        private rotationSpeed : number = 50 / 1000;
        protected isColliding : boolean;

        constructor(player : Player, name : string, x : number, z : number, img : HTMLImageElement) {
            super(name);
            this.player = player;
            this.init(x, z, img);
        }

        public getPlayer() : Player {
            return this.player;
        }

        public getIsColliding() : boolean {
            return this.isColliding;
        }

        private init(x : number, z : number, img : HTMLImageElement) : void {
            let componentMesh: f.ComponentMesh = new f.ComponentMesh(new f.MeshCube());
            componentMesh.pivot.scaleZ(0.25);
            componentMesh.pivot.scaleX(0.25);
            componentMesh.pivot.scaleY(0.25);
            let textureImage: f.TextureImage = new f.TextureImage();
            textureImage.image = img;
            let coatTextured: f.CoatTextured = new f.CoatTextured();
            coatTextured.texture = textureImage;
            let material: f.Material = new f.Material("Health", f.ShaderTexture, coatTextured);
            let componentMaterial: f.ComponentMaterial = new f.ComponentMaterial(material);
            let componentTransform: f.ComponentTransform = new f.ComponentTransform(
                f.Matrix4x4.TRANSLATION(new f.Vector3(0, 0, 0)));
            this.addComponent(componentTransform);
            this.mtxLocal.rotateY(-90);
            this.mtxLocal.rotateZ(-90);
            this.addComponent(componentMesh);
            this.addComponent(componentMaterial);
            this.mtxLocal.translateY(-0.5);
            this.mtxLocal.translateX(x);
            this.mtxLocal.translateZ(z);
            this.addEventListener("playerCollision", () => { this.checkPlayerCollision() }, true);
            f.Loop.addEventListener(f.EVENT.LOOP_FRAME, this.animateRotation);
        }

        protected removeSelf() : void {
            this.removeEventListener("playerCollision", this.checkPlayerCollision);
            f.Loop.removeEventListener(f.EVENT.LOOP_FRAME, this.animateRotation);
            if(this.getParent() !== null){
                this.getParent().removeChild(this);
            }
        }

        private animateRotation = () => {
            this.mtxLocal.rotateY(this.rotationSpeed * f.Loop.timeFrameGame);
        }

        private checkPlayerCollision = () => {
            this.isColliding = this.player.mtxLocal.translation.isInsideSphere(this.mtxLocal.translation, 1);
        }

    }

}