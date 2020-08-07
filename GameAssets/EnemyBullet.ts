namespace doomClone {

    import f = FudgeCore;

    export class EnemyBullet extends Projectiles{

        constructor(startMatrix : f.Matrix4x4) {
            super(
                "EnemyBullet",
                startMatrix,
                10,
                2,
                new CustomEvent<any>("enemyShotCollision"),
                0,
                -0.15
            );
        }

    }

}