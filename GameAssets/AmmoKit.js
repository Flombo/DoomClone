"use strict";
var doomClone;
(function (doomClone) {
    var f = FudgeCore;
    class AmmoKit extends f.Node {
        constructor(player, x, y) {
            super("Ammo");
            this.playerCollisionRadius = 0.9;
            this.ammoAmount = 10;
            this.rotationSpeed = 50 / 1000;
            this.animateRotation = () => {
                this.mtxLocal.rotateZ(this.rotationSpeed * f.Loop.timeFrameGame);
            };
            this.checkPlayerCollision = () => {
                let distance = this.calculateDistance(this.player);
                if (distance <= this.playerCollisionRadius) {
                    this.player.setAmmo(this.ammoAmount);
                    this.removeSelf();
                }
            };
            this.player = player;
            this.initWall(x, y);
        }
        initWall(x, y) {
            // let ammoIMG: HTMLImageElement = <HTMLImageElement>document.getElementById("ammo");
            let ammoMeshComp = new f.ComponentMesh(new f.MeshCube());
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
            let ammoMaterial = new f.Material("Ammo", f.ShaderUniColor, new f.CoatColored(f.Color.CSS('yellow')));
            let ammoComponentMat = new f.ComponentMaterial(ammoMaterial);
            let ammoComponentTransform = new f.ComponentTransform(f.Matrix4x4.TRANSLATION(new f.Vector3(x, y, 0)));
            this.addComponent(ammoComponentTransform);
            this.addComponent(ammoMeshComp);
            this.addComponent(ammoComponentMat);
            this.mtxLocal.translateZ(-0.5);
            this.addEventListener("playerCollision", this.checkPlayerCollision.bind(this), true);
            f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.animateRotation.bind(this));
        }
        calculateDistance(node) {
            let ammoTranslationCopy = this.mtxLocal.translation.copy;
            let nodeTranslationCopy = node.mtxLocal.translation.copy;
            ammoTranslationCopy.subtract(nodeTranslationCopy);
            return Math.sqrt(Math.pow(ammoTranslationCopy.x, 2) + Math.pow(ammoTranslationCopy.y, 2));
        }
        removeSelf() {
            this.removeEventListener("playerCollision", this.checkPlayerCollision);
            this.removeEventListener("loopFrame" /* LOOP_FRAME */, this.animateRotation);
            this.getParent().removeChild(this);
        }
    }
    doomClone.AmmoKit = AmmoKit;
})(doomClone || (doomClone = {}));
//# sourceMappingURL=AmmoKit.js.map