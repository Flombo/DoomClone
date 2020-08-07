namespace doomClone {

    import f = FudgeCore;

    export class PlayerBullet extends Projectiles{

        constructor(startMatrix : f.Matrix4x4) {
            super(
                "PlayerBullet",
                startMatrix,
                30,
                5,
                new CustomEvent<any>("shotCollision"),
                1.75,
                -0.25
            );
        }

    }

}