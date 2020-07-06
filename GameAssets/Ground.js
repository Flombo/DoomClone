"use strict";
var doomClone;
(function (doomClone) {
    var f = FudgeCore;
    class Ground extends f.Node {
        constructor() {
            super("Ground");
            this.initGround();
        }
        initGround() {
            let groundMesh = new f.MeshQuad();
            let groundMeshComp = new f.ComponentMesh(groundMesh);
            groundMeshComp.pivot.scaleY(30);
            groundMeshComp.pivot.scaleX(30);
            let groundIMG = document.getElementById("ground");
            let groundTextureIMG = new f.TextureImage();
            groundTextureIMG.image = groundIMG;
            let groundTextureCoat = new f.CoatTextured();
            groundTextureCoat.texture = groundTextureIMG;
            groundTextureCoat.repetition = true;
            groundTextureCoat.tilingX = 30;
            groundTextureCoat.tilingY = 30;
            let groundMaterial = new f.Material("ground", f.ShaderTexture, groundTextureCoat);
            let groundComponentMat = new f.ComponentMaterial(groundMaterial);
            let groundTransformComp = new f.ComponentTransform(f.Matrix4x4.TRANSLATION(new f.Vector3(0, 0, -1)));
            this.addComponent(groundTransformComp);
            this.addComponent(groundMeshComp);
            this.addComponent(groundComponentMat);
        }
    }
    doomClone.Ground = Ground;
})(doomClone || (doomClone = {}));
//# sourceMappingURL=Ground.js.map