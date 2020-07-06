namespace doomClone {

    import f = FudgeCore;

    export class Ground extends f.Node{

        constructor() {
            super("Ground");
            this.initGround();
        }

        private initGround() : void {
            let groundMesh: f.MeshQuad = new f.MeshQuad();
            let groundMeshComp: f.ComponentMesh = new f.ComponentMesh(groundMesh);
            groundMeshComp.pivot.scaleY(30);
            groundMeshComp.pivot.scaleX(30);
            let groundIMG: HTMLImageElement = <HTMLImageElement>document.getElementById("ground");
            let groundTextureIMG: f.TextureImage = new f.TextureImage();
            groundTextureIMG.image = groundIMG;
            let groundTextureCoat: f.CoatTextured = new f.CoatTextured();
            groundTextureCoat.texture = groundTextureIMG;
            groundTextureCoat.repetition = true;
            groundTextureCoat.tilingX = 30;
            groundTextureCoat.tilingY = 30;
            let groundMaterial: f.Material = new f.Material("ground", f.ShaderTexture, groundTextureCoat);
            let groundComponentMat: f.ComponentMaterial = new f.ComponentMaterial(groundMaterial);

            let groundTransformComp: f.ComponentTransform = new f.ComponentTransform(
                f.Matrix4x4.TRANSLATION(new f.Vector3(0, 0, -1)))
            this.addComponent(groundTransformComp);
            this.addComponent(groundMeshComp);
            this.addComponent(groundComponentMat);
        }

    }


}