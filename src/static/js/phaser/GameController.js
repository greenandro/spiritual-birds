import Player from './Player';
import Enemies from './Enemies';
import config from './config.json';
import PowerUp from './PowerUP';
import Heal from './Heal';
import UIController from './UIController';
const GameController = {
  dropTypes: {
    Heal: 1,
    PowerUP: 2
  },
  create(scene, cursors) {
    const newObj = {
      Player: null,
      Enemies: null,
      PowerUps: [],
      Heals: [],
      scoreText: null,
      HPText: null,
      LifeBar: null,
      scene: null,
      dropTypes: this.dropTypes,
      construct(scene, cursors) {
        this.Player = Player.create(scene, cursors);
        this.Enemies = Enemies.create(scene, this.Player, this);
        this.UIController = UIController.create(scene, this.Player);
        this.scene = scene;
        return this;
      },
      drop(type, x, y) {
        if (type === this.dropTypes.Heal) {
          this.dropHeal(x, y);
        } else if (type === this.dropTypes.PowerUP) {
          this.dropPowerUP(x, y);
        }
      },
      dropHeal(x, y) {
        this.Heals.push(Heal.create(this.scene, this.Player, x, y, { x: -30, y: 0 }));
      },
      dropPowerUP(x, y) {
        this.PowerUps.push(PowerUp.create(this.scene, this.Player, x, y, { x: -30, y: 0 }));
      },
      updateEnemies() {
        // if (this.Enemies.Types.GrayBird.fleed < 20) {
        //   this.Enemies.Types.GrayBird.min = 2;
        // } else {
        //   this.Enemies.Types.GrayBird.min = Math.round(this.Enemies.Types.GrayBird.fleed / 10);
        // }
        this.Enemies.update(this.scene);
      },
      updatePowerUps() {
        this.PowerUps.forEach((element, index) => {
          if (element === null || !element.update()) {
            this.PowerUps.splice(index, 1);
          };
        });
      },
      updateHeals() {
        this.Heals.forEach((element, index) => {
          if (element === null || !element.update()) {
            this.Heals.splice(index, 1);
          };
        });
      },
      update(scene) {
        this.Player.update();
        this.updateEnemies();
        this.updatePowerUps();
        this.updateHeals();

        if (this.Enemies.Types.GrayBird.fleed === 1 && this.PowerUps.length === 0 && this.Player.getMaxBullets() === 0) {
          this.Enemies.Types.GrayBird.min = 0;
          this.PowerUps.push(PowerUp.create(scene, this.Player, config.width / 2, config.height / 2, { x: 0, y: 0 }));
        }
        if (this.Enemies.Types.GrayBird.fleed === 1 && this.Player.getMaxBullets() > 0) {
          this.Enemies.Types.GrayBird.min = 2;
        }

        this.UIController.update(scene);
      }
    };
    return newObj.construct(scene, cursors);
  }
};
export default GameController;
