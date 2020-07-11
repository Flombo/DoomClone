"use strict";
var doomClone;
(function (doomClone) {
    var f = FudgeCore;
    window.addEventListener("load", (event) => {
        hndLoad(event);
    });
    function hndLoad(_event) {
        let canvas = document.getElementById("game");
        let portraitCanvas = document.getElementById("portraitCanvas");
        let root = new f.Node("root");
        let groundNode = new doomClone.Ground();
        root.appendChild(groundNode);
        let roofNode = new doomClone.Roof();
        root.appendChild(roofNode);
        let player = new doomClone.Player();
        root.appendChild(player);
        let enemy = new doomClone.Enemy(player, 9, 20);
        root.appendChild(enemy);
        let wall = new doomClone.Wall(player, enemy, 2, 4);
        let wall1 = new doomClone.Wall(player, enemy, 2, 2);
        root.appendChild(wall);
        root.appendChild(wall1);
        let healthKit = new doomClone.HealthKit(player, -8, 4);
        root.appendChild(healthKit);
        let armorKit = new doomClone.ArmorKit(player, -4, -4);
        root.appendChild(armorKit);
        let ammoKit = new doomClone.AmmoKit(player, 4, 4);
        root.appendChild(ammoKit);
        let door = new doomClone.Door(player, enemy, 2, 3);
        root.appendChild(door);
        // let light : f.LightAmbient = new f.LightAmbient(new f.Color(1, 1, 0.5, 0.1));
        // let directionalLight : f.LightDirectional = new f.LightDirectional(f.Color.CSS('white'));
        // let directionalLightComp : f.ComponentLight = new f.ComponentLight(directionalLight);
        // directionalLightComp.pivot.translateZ(10);
        // directionalLightComp.pivot.lookAt(player.mtxLocal.translation);
        // let lightComponent : f.ComponentLight = new f.ComponentLight(light);
        // let lightNode : f.Node = new f.Node("light");
        // lightNode.addComponent(lightComponent);
        // lightNode.addComponent(directionalLightComp);
        // root.appendChild(lightNode);
        let gameMenuManager = new doomClone.GameMenuManager(canvas);
        gameMenuManager.initGameMenuHandling();
        let viewport = new f.Viewport();
        viewport.initialize("Game", root, player.getEgoCamera(), canvas);
        let viewportPortrait = new f.Viewport();
        viewportPortrait.initialize("Portrait", player.getPortraitSprites(), player.getPortraitCamera(), portraitCanvas);
        f.AudioManager.default.listenTo(root);
        f.AudioManager.default.listen(player.getComponent(f.ComponentAudioListener));
        f.Loop.addEventListener("loopFrame", renderLoop);
        f.Loop.start(f.LOOP_MODE.TIME_GAME, 30);
        function renderLoop() {
            if (!gameMenuManager.getIsPaused()) {
                if (!player.getIsDead()) {
                    f.AudioManager.default.update();
                    viewportPortrait.draw();
                    viewport.draw();
                }
                else {
                    gameMenuManager.showDeadPrompt();
                }
            }
        }
    }
})(doomClone || (doomClone = {}));
//# sourceMappingURL=Main.js.map