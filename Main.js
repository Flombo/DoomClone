"use strict";
var doomClone;
(function (doomClone) {
    var f = FudgeCore;
    window.addEventListener("load", (event) => {
        hndLoad(event);
    });
    async function hndLoad(_event) {
        let canvas = document.getElementById("game");
        let portraitCanvas = document.getElementById("portraitCanvas");
        let pistolCanvas = document.getElementById("playerPistolCanvas");
        // let miniMapCanvas : HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("minimap");
        let root = new f.Node("root");
        let groundNode = new doomClone.Ground();
        root.appendChild(groundNode);
        let roofNode = new doomClone.Roof();
        root.appendChild(roofNode);
        let player = new doomClone.Player();
        root.appendChild(player);
        let enemies = [];
        let enemy = new doomClone.Enemy(player, -3, -3);
        root.appendChild(enemy);
        enemies.push(enemy);
        let enemy1 = new doomClone.Enemy(player, 10, 10);
        root.appendChild(enemy1);
        enemies.push(enemy1);
        let wall = new doomClone.Wall(player, enemies, 2, 4);
        let wall1 = new doomClone.Wall(player, enemies, 2, 1);
        let wall2 = new doomClone.Wall(player, enemies, 3, 1);
        let wall3 = new doomClone.Wall(player, enemies, 4, 1);
        let wall4 = new doomClone.Wall(player, enemies, 5, 1);
        let wall5 = new doomClone.Wall(player, enemies, 6, 1);
        let wall6 = new doomClone.Wall(player, enemies, 3, 4);
        let wall7 = new doomClone.Wall(player, enemies, 4, 4);
        let wall8 = new doomClone.Wall(player, enemies, 5, 4);
        let wall9 = new doomClone.Wall(player, enemies, 6, 4);
        let wall10 = new doomClone.Wall(player, enemies, 6, 3);
        let wall11 = new doomClone.Wall(player, enemies, 6, 2);
        root.appendChild(wall);
        root.appendChild(wall1);
        root.appendChild(wall2);
        root.appendChild(wall3);
        root.appendChild(wall4);
        root.appendChild(wall5);
        root.appendChild(wall6);
        root.appendChild(wall7);
        root.appendChild(wall8);
        root.appendChild(wall9);
        root.appendChild(wall10);
        root.appendChild(wall11);
        for (let z = 16; z >= 16; z--) {
            for (let x = 17; x > -17; x--) {
                let wallLeft = new doomClone.Wall(player, enemies, x, z);
                root.appendChild(wallLeft);
            }
        }
        for (let z = -16; z <= -16; z++) {
            for (let x = 17; x > -17; x--) {
                let wallRight = new doomClone.Wall(player, enemies, x, z);
                root.appendChild(wallRight);
            }
        }
        for (let x = 17; x >= 17; x--) {
            for (let z = 16; z > -16; z--) {
                let wallTop = new doomClone.Wall(player, enemies, x, z);
                root.appendChild(wallTop);
            }
        }
        for (let x = -13; x <= -13; x++) {
            for (let z = 16; z > -16; z--) {
                let wallBottom = new doomClone.Wall(player, enemies, x, z);
                root.appendChild(wallBottom);
            }
        }
        let healthKit = new doomClone.HealthKit(player, -8, 4);
        root.appendChild(healthKit);
        let armorKit = new doomClone.ArmorKit(player, -4, -4);
        root.appendChild(armorKit);
        let ammoKit = new doomClone.AmmoKit(player, 4, 2);
        root.appendChild(ammoKit);
        let door = new doomClone.Door(player, enemies, 2, 2.5);
        root.appendChild(door);
        let gameMenuManager = new doomClone.GameMenuManager(canvas, enemies, player);
        gameMenuManager.initGameMenuHandling();
        let viewport = new f.Viewport();
        viewport.initialize("Game", root, player.getEgoCamera(), canvas);
        let viewportPortrait = new f.Viewport();
        viewportPortrait.initialize("Portrait", player.getPortraitSprites(), player.getPortraitCamera(), portraitCanvas);
        let viewportPistol = new f.Viewport();
        viewportPistol.initialize("Pistol", player.getPistolSprites(), player.getPistolCamera(), pistolCanvas);
        // let viewportMiniMap : f.Viewport = new f.Viewport();
        // let miniMapCam : f.ComponentCamera = new f.ComponentCamera();
        // miniMapCam.pivot.rotateY(180);
        // miniMapCam.pivot.translateZ(-35);
        // viewportMiniMap.initialize("Minimap", root, miniMapCam, miniMapCanvas);
        f.AudioManager.default.listenTo(root);
        f.AudioManager.default.listen(player.getComponent(f.ComponentAudioListener));
        f.Loop.addEventListener("loopFrame", renderLoop);
        f.Loop.start(f.LOOP_MODE.TIME_REAL, 60);
        let audio = await f.Audio.load("../../sounds/doomTheme.mp3");
        let componentAudio = new f.ComponentAudio();
        componentAudio.audio = audio;
        root.addComponent(componentAudio);
        componentAudio.volume = 0.25;
        componentAudio.play(true);
        function renderLoop() {
            if (!gameMenuManager.getIsPaused()) {
                if (!player.getIsDead()) {
                    f.AudioManager.default.update();
                    viewportPortrait.draw();
                    viewportPistol.draw();
                    console.log(f.Loop.getFpsRealAverage(), "fps");
                    // viewportMiniMap.draw();
                    viewport.draw();
                }
                else {
                    gameMenuManager.showDeadMenu();
                }
            }
        }
    }
})(doomClone || (doomClone = {}));
//# sourceMappingURL=Main.js.map