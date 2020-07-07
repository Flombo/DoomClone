"use strict";
var doomClone;
(function (doomClone) {
    var f = FudgeCore;
    class HealthKit extends f.Node {
        constructor(player, x, y) {
            super("Health");
            this.playerCollisionRadius = 0.9;
            this.healthAmount = 10;
            this.rotationSpeed = 50 / 1000;
            this.animateRotation = () => {
                this.mtxLocal.rotateZ(this.rotationSpeed * f.Loop.timeFrameGame);
            };
            this.checkPlayerCollision = () => {
                let distance = this.calculateDistance(this.player);
                if (distance <= this.playerCollisionRadius) {
                    if (this.player.getHealth() - this.healthAmount < 90) {
                        this.player.setHealth(this.healthAmount);
                        this.removeSelf();
                    }
                }
            };
            this.player = player;
            this.initWall(x, y);
        }
        initWall(x, y) {
            // let ammoIMG: HTMLImageElement = <HTMLImageElement>document.getElementById("ammo");
            let healthMeshComp = new f.ComponentMesh(new f.MeshCube());
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
            let healthMaterial = new f.Material("Health", f.ShaderUniColor, new f.CoatColored(f.Color.CSS('red')));
            let healthComponentMat = new f.ComponentMaterial(healthMaterial);
            let healthComponentTransform = new f.ComponentTransform(f.Matrix4x4.TRANSLATION(new f.Vector3(x, y, 0)));
            this.addComponent(healthComponentTransform);
            this.addComponent(healthMeshComp);
            this.addComponent(healthComponentMat);
            this.mtxLocal.translateZ(-0.5);
            this.addEventListener("playerCollision", this.checkPlayerCollision.bind(this), true);
            f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.animateRotation.bind(this));
        }
        calculateDistance(node) {
            let healthTranslationCopy = this.mtxLocal.translation.copy;
            let nodeTranslationCopy = node.mtxLocal.translation.copy;
            healthTranslationCopy.subtract(nodeTranslationCopy);
            return Math.sqrt(Math.pow(healthTranslationCopy.x, 2) + Math.pow(healthTranslationCopy.y, 2));
        }
        removeSelf() {
            this.removeEventListener("playerCollision", this.checkPlayerCollision);
            this.removeEventListener("loopFrame" /* LOOP_FRAME */, this.animateRotation);
            this.getParent().removeChild(this);
        }
    }
    doomClone.HealthKit = HealthKit;
})(doomClone || (doomClone = {}));
//# sourceMappingURL=HealthKit.js.map