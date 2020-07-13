namespace doomClone {

	import f = FudgeCore;

	window.addEventListener("load", (event) => {
		hndLoad(event);
	});

	function hndLoad(_event: Event): void {
		let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("game");
		let portraitCanvas : HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("portraitCanvas");

		let root : f.Node = new f.Node("root");

		let groundNode : Ground = new Ground();
		root.appendChild(groundNode);

		let roofNode : Roof = new Roof();
		root.appendChild(roofNode);

		let player : Player = new Player();
		root.appendChild(player);

		let enemies : Enemy[] = [];

		let enemy : Enemy = new Enemy(player, 9, 20);
		root.appendChild(enemy);
		enemies.push(enemy);

		let enemy1 : Enemy = new Enemy(player, -15, -25);
		root.appendChild(enemy1);
		enemies.push(enemy1);

		let wall : Wall = new Wall(player, enemies,2, 4);
		let wall1 : Wall = new Wall(player, enemies, 2, 1);
		root.appendChild(wall);
		root.appendChild(wall1);

		let healthKit : HealthKit = new HealthKit(player, -8, 4);
		root.appendChild(healthKit);

		let armorKit : ArmorKit = new ArmorKit(player, -4, -4);
		root.appendChild(armorKit);

		let ammoKit : AmmoKit = new AmmoKit(player, 4, 4);
		root.appendChild(ammoKit);

		let door : Door = new Door(player, enemies,2, 2.5);
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

		let gameMenuManager : GameMenuManager = new GameMenuManager(canvas);
		gameMenuManager.initGameMenuHandling();

		let viewport : f.Viewport = new f.Viewport();
		viewport.initialize("Game", root, player.getEgoCamera(), canvas);

		let viewportPortrait : f.Viewport = new f.Viewport();
		viewportPortrait.initialize("Portrait", player.getPortraitSprites(), player.getPortraitCamera(), portraitCanvas);

		f.AudioManager.default.listenTo(root);
		f.AudioManager.default.listen(player.getComponent(f.ComponentAudioListener));
		f.Loop.addEventListener("loopFrame", renderLoop);
		f.Loop.start(f.LOOP_MODE.TIME_GAME, 30);

		function renderLoop () {
			if(!gameMenuManager.getIsPaused()) {
				if(!player.getIsDead()) {
					f.AudioManager.default.update();
					viewportPortrait.draw();
					viewport.draw();
				} else {
					gameMenuManager.showDeadMenu();
				}
			}
		}

	}

}