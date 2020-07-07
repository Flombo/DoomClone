namespace doomClone {

    import f = FudgeCore;

    export class Roof extends Ground{

        constructor() {
            super();
            let roofIMG: HTMLImageElement = <HTMLImageElement>document.getElementById("roof");
            let roofTextureIMG: f.TextureImage = new f.TextureImage();
            roofTextureIMG.image = roofIMG;
            let componentMaterial : f.ComponentMaterial = this.getComponent(f.ComponentMaterial);
            let roofTextureCoat: f.CoatTextured = new f.CoatTextured();
            roofTextureCoat.texture = roofTextureIMG;
            componentMaterial.material = new f.Material("ground", f.ShaderTexture, roofTextureCoat);
            componentMaterial.pivot.scale(new f.Vector2(2, 2));
            this.mtxLocal.translateZ(2);
            this.mtxLocal.rotateX(180);
        }

    }


}