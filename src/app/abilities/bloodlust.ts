import { Spell } from "app/spell";
import { Projectile } from "app/projectile";
import { UnitEx } from "app/UnitEx";
import { Effect} from "w3ts"

const SCALING_FADEIN:number = 0.5
const SCALING_FADEOUT:number = 0.5

class BloodlustBuff implements Spell {
  readonly objectId:number = FourCC("A002")
  readonly name:string = "Bloodlust"
  private _effectLeft:Effect
  private _effectRight:Effect
  private _attackSpeed:number
  private _movementSpeed:number
  private _maxScaling:number    //How much scaling this buff can give at maximum value
  private _scaling:number = 0       //How much scaling this buff is actually giving
  private _lifetime:number = 0
  private _maxDuration:number
  duration:number = 0

  private setScaling(caster:UnitEx, val:number){
    caster.modScalingBonus(val - this._scaling)
    this._scaling = val
  }

  onTick(caster:UnitEx, tick:number){
    this._lifetime = this._lifetime + tick
    if (this.duration > SCALING_FADEOUT && this._scaling < this._maxScaling){
      this.setScaling(caster, this._scaling + tick*this._maxScaling/SCALING_FADEIN)
    }
    if (this.duration < SCALING_FADEOUT && this._scaling > 0){
      this.setScaling(caster, this._scaling - tick*this._maxScaling/SCALING_FADEOUT)
    }
  }

  onLearn(caster:UnitEx){
    this._effectLeft = new Effect("Abilities\\Spells\\Orc\\Bloodlust\\BloodlustTarget.mdl", caster, "hand,left")
    this._effectRight = new Effect("Abilities\\Spells\\Orc\\Bloodlust\\BloodlustTarget.mdl", caster, "hand,right")
    caster.modAttackSpeedBonus(this._attackSpeed)
    caster.modMoveSpeedBonus(this._movementSpeed)
  }

  onUnlearn(caster:UnitEx){
    this._effectLeft.destroy()
    this._effectRight.destroy()
    caster.modAttackSpeedBonus(-this._attackSpeed)
    caster.modMoveSpeedBonus(-this._movementSpeed)
    caster.modScalingBonus(-this._scaling)
  }

  constructor(attackSpeed: number, movementSpeed:number, scaling:number, duration:number){
    this._attackSpeed = attackSpeed
    this._movementSpeed = movementSpeed
    this._maxScaling = scaling
    this._maxDuration = duration
    this.duration = duration
  }
}

export class Bloodlust implements Spell {
  readonly objectId:number = FourCC("A001")
  readonly name:string = "Bloodlust"
  readonly _attackSpeed:number = 0.4
  readonly _movementSpeed:number = 100
  readonly _maxScaling:number = 0.3
  readonly _maxDuration:number = 7

  onCast(caster:UnitEx, target:UnitEx){
    try {
      const newBuff = new BloodlustBuff(this._attackSpeed, this._movementSpeed, this._maxScaling, this._maxDuration)
      const existingBuff = target.getSpell(newBuff.objectId)
      if (existingBuff){
        existingBuff.duration = newBuff.duration
      } else {
        target.addSpell(newBuff)
      }
    } catch (e) {
      print(e)
    }
    
  }
}