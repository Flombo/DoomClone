"use strict";
var doomClone;
(function (doomClone) {
    var f = FudgeCore;
    class Item extends f.Node {
        constructor(player, name, x, y, img) {
            super(name);
            this.playerCollisionRadius = 0.9;
            this.rotationSpeed = 50 / 1000;
            this.animateRotation = () => {
                this.mtxLocal.rotateZ(this.rotationSpeed * f.Loop.timeFrameGame);
            };
            this.checkPlayerCollision = () => {
                let distance = this.calculateDistance(this.player);
                this.isColliding = distance <= this.playerCollisionRadius;
            };
            this.player = player;
            this.init(x, y, img);
        }
        init(x, y, img) {
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
            let componentTransform = new f.ComponentTransform(f.Matrix4x4.TRANSLATION(new f.Vector3(x, y, 0)));
            this.addComponent(componentTransform);
            this.addComponent(componentMesh);
            this.addComponent(componentMaterial);
            this.mtxLocal.translateZ(-0.5);
            this.addEventListener("playerCollision", () => { this.checkPlayerCollision(); }, true);
            f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.animateRotation);
        }
        calculateDistance(node) {
            let healthTranslationCopy = this.mtxLocal.translation.copy;
            let nodeTranslationCopy = node.mtxLocal.translation.copy;
            healthTranslationCopy.subtract(nodeTranslationCopy);
            return Math.sqrt(Math.pow(healthTranslationCopy.x, 2) + Math.pow(healthTranslationCopy.y, 2));
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