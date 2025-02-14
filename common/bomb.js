import * as constants from "./constants.js";
import { GridEntity } from "./grid-entity.js";
import { Fire } from "./fire.js";
import * as world from "./world.js";
import { Character } from "./character.js";

export class Bomb extends GridEntity {

	fuseTime = constants.BOMB_FUSE_TIME;
	power = 1;

	/** @param {number} power the number of tiles the flames will span in each direction */
	constructor(power, row, column) {
		super(row, column);
		this.power = power;
		world.getEntitiesInArea(this.getBoundingBox()).forEach(
			entity => {
				if (entity instanceof Character) {
					entity.overlapingBombs.push(this);
				}
			}
		);
		this.startAnimation("idle");
	}

	/** @returns {string} the type of entity */
	getType() { return "bomb"; }

	update(dt) {
		super.update(dt);
		this.fuseTime -= dt;
		if (this.fuseTime <= 0) {
			this.explode();
		}
	}

	explode() {
		this.destroy();
		// create central fire
		new Fire("center", this.row, this.column)
		// go out from the center and create the flames
		let directions = {
			Up: { blocked: false, dx: 0, dy: -1 },
			Down: { blocked: false, dx: 0, dy: 1 },
			Left: { blocked: false, dx: -1, dy: 0 },
			Right: { blocked: false, dx: 1, dy: 0 },
		};
		for (let i=0; i<this.power; i++) {
			for (let dirKey in directions) {
				const dir = directions[dirKey];
				if (dir.blocked) {
					continue;
				}
				const fRow = this.row + dir.dy * (i+1);
				const fColumn = this.column + dir.dx * (i+1);
				const cellType = world.getMapCell(fRow, fColumn);
				if ([-1, 2].includes(cellType)) {
					// we got outside of map or hit an indestructible brick
					dir.blocked = true;
					continue;
				}
				// if we hit a regular brick, we stop here and destroy the brick
				if (cellType === 1) {
					dir.blocked = true;
					world.destroyBrick(fRow, fColumn);
				} else {
					// spawn the right type of fire
					const isCap = i === this.power-1 || cellType === 1;
					const fireType = isCap ? `cap${dirKey}` : (
						["Up", "Down"].includes(dirKey) ? "middleV" : "middleH"
					);
					new Fire(fireType, fRow, fColumn);
				}
			}
		}
	}

	/** @override we've been fried by another explosion, so chain-reaction! */
	fry() {
		this.explode();
	}
}
