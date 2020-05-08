import { Spell } from "app/spell";
import { Projectile } from "app/projectile";
import { Unit } from "w3ts";

const DAMAGE:number = 100
const VEL:number = 400
const RADIUS:number = 50

class MiniWave extends Projectile {
  
}

class BigWave extends Projectile {
  private _damage:number

  constructor(attacker:Unit, x:number, y:number, face:number, damage:number){
    super(attacker, x, y, face)
    this.modelPath = "Abilities\\Weapons\\GreenDragonMissile\\GreenDragonMissile.mdl"
    this._damage = damage
    this._vel = VEL
    this._radius = RADIUS
  }
}

export class PulseWave implements Spell {
  readonly objectId:number = FourCC("ACsh")

  onCast(caster:Unit){
    new BigWave(caster, caster.x, caster.y, caster.facing, 100)
  }
}