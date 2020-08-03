"use strict";
var doomClone;
(function (doomClone) {
    var f = FudgeCore;
    class Item extends f.Node {
        constructor(player, name, x, z, img) {
            super(name);
            this.rotationSpeed = 50 / 1000;
            this.animateRotation = () => {
                this.mtxLocal.rotateY(this.rotationSpeed * f.Loop.timeFrameGame);
            };
            this.checkPlayerCollision = () => {
                this.isColliding = this.player.mtxLocal.translation.isInsideSphere(this.mtxLocal.translation, 1);
            };
            this.player = player;
            this.init(x, z, img);
        }
        init(x, z, img) {
            let componentMesh = new f.ComponentMesh(new f.MeshCube());
            componentMesh.pivot.scaleZ(0.25);
            componentMesh.pivot.scaleX(0.25);
            componentMesh.pivot.scaleY(0.25);
            let textureImage = new f.TextureImage();
            textureImage.image = img;
            let coatTextured = new f.CoatTextured();
            coatTextured.texture = textureImage;
            let material = new f.Material("Health", f.ShaderTexture, coatTextured);
            let componentMaterial = new f.ComponentMaterial(material);
            let componentTransform = new f.ComponentTransform(f.Matrix4x4.TRANSLATION(new f.Vector3(0, 0, 0)));
            this.addComponent(componentTransform);
            this.mtxLocal.rotateY(-90);
            this.mtxLocal.rotateZ(-90);
            this.addComponent(componentMesh);
            this.addComponent(componentMaterial);
            this.mtxLocal.translateY(-0.5);
            this.mtxLocal.translateX(x);
            this.mtxLocal.translateZ(z);
            this.addEventListener("playerCollision", () => { this.checkPlayerCollision(); }, true);
            f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.animateRotation);
        }
        removeSelf() {
            this.removeEventListener("playerCollision", this.checkPlayerCollision);
            f.Loop.removeEventListener("loopFrame" /* LOOP_FRAME */, this.animateRotation);
            if (this.getParent() !== null) {
                this.getParent().removeChild(this);
            }
        }
    }
    doomClone.Item = Item;
})(doomClone || (doomClone = {}));
//# sourceMappingURL=Item.js.map