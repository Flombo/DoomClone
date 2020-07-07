"use strict";
var doomClone;
(function (doomClone) {
    var f = FudgeCore;
    class Roof extends doomClone.Ground {
        constructor() {
            super();
            let roofIMG = document.getElementById("roof");
            let roofTextureIMG = new f.TextureImage();
            roofTextureIMG.image = roofIMG;
            let componentMaterial = this.getComponent(f.ComponentMaterial);
            let roofTextureCoat = new f.CoatTextured();
            roofTextureCoat.texture = roofTextureIMG;
            componentMaterial.material = new f.Material("ground", f.ShaderTexture, roofTextureCoat);
            componentMaterial.pivot.scale(new f.Vector2(2, 2));
            this.mtxLocal.translateZ(2);
            this.mtxLocal.rotateX(180);
        }
    }
    doomClone.Roof = Roof;
})(doomClone || (doomClone = {}));
//# sourceMappingURL=Roof.js.map