namespace doomClone {

    import f = FudgeCore;

    export class Item extends f.Node{

        protected readonly player : Player;
        private playerCollisionRadius : number = 0.9;
        private rotationSpeed : number = 50 / 1000;
        protected isColliding : boolean;

        constructor(player : Player, x : number, y : number, name : string, color : string) {
            super(name);
            this.player = player;
            this.init(x, y, color);
        }

        private init(x : number, y : number, color : string) : void {
            // let ammoIMG: HTMLImageElement = <HTMLImageElement>document.getElementById("ammo");
            let componentMesh: f.ComponentMesh = new f.ComponentMesh(new f.MeshCube());
            componentMesh.pivot.scaleZ(0.25);
            componentMesh.pivot.scaleX(0.25);
            componentMesh.pivot.scaleY(0.25);
            // let ammoTextureIMG: f.TextureImage = new f.TextureImage();
            // ammoTextureIMG.image = ammoIMG;
            // let ammoTextureCoat: f.CoatTextured = new f.CoatTextured();
            // ammoTextureCoat.texture = ammoTextureIMG;
            // ammoTextureCoat.repetition = true;
            // ammoTextureCoat.tilingX = 30;
            // ammoTextureCoat.tilingY = 30;
            let material: f.Material = new f.Material("Health", f.ShaderUniColor, new f.CoatColored(f.Color.CSS(color)));
            let componentMaterial: f.ComponentMaterial = new f.ComponentMaterial(material);
            let componentTransform: f.ComponentTransform = new f.ComponentTransform(
                f.Matrix4x4.TRANSLATION(new f.Vector3(x, y, 0)));
            this.addComponent(componentTransform);
            this.addComponent(componentMesh);
            this.addComponent(componentMaterial);
            this.mtxLocal.translateZ(-0.5);
            this.addEventListener("playerCollision", () => { this.checkPlayerCollision() }, true);
            f.Loop.addEventListener(f.EVENT.LOOP_FRAME, this.animateRotation);
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
            this.isColliding = distance <= this.playerCollisionRadius;
        }

        protected removeSelf() : void {
            console.log("removeSelf", this.name)
            this.removeEventListener("playerCollision", this.checkPlayerCollision);
            f.Loop.removeEventListener(f.EVENT.LOOP_FRAME, this.animateRotation);
            if(this.getParent() !== null){
                this.getParent().removeChild(this);
            }
        }

    }

}