import { Spell } from "app/spell";
import { Timer, Group, Effect } from "w3ts";
import { UnitEx } from "app/unitEx";

export class PermanentImmolation implements Spell {
  readonly objectId:number = FourCC("Aabr")
  readonly name:string = "Permanent Immolation"
  private _damage:number = 10 //Per second
  private _radius:number = 250
  private _period:number = 1
  private _tick:number = 0
  private _damageGroup:Group
  private _effect:Effect

  onTick(caster:UnitEx, tick:number){
    if (caster && caster.isAlive()){
      this._tick = this._tick + tick
      if (this._tick === this._period) {
        this._damageGroup.enumUnitsInRange(caster.x, caster.y, this._radius, null)
        this._damageGroup.for(function(){
          let enumUnit = UnitEx.fromHandle(GetEnumUnit())
          if (enumUnit.isEnemy(caster.owner)){
            caster.damageTarget(enumUnit.handle, this._damage, this._radius, false, false, ATTACK_TYPE_MAGIC, DAMAGE_TYPE_MAGIC, WEAPON_TYPE_WHOKNOWS)
            const burnEffect = new Effect("Abilities\\Spells\\Other\\ImmolationRed\\ImmolationRedDamage.mdl", enumUnit, "chest")
            const burnTimer = new Timer()
            burnTimer.start(this._tick, false, function(){
              burnEffect.destroy()
              burnTimer.destroy()
            })
          }
        })
        this._tick = 0
      }
    }
  }

  onLearn(caster:UnitEx){
    this._damageGroup = new Group()
    this._effect = new Effect("Abilities\\Spells\\Other\\ImmolationRed\\ImmolationRedTarget.mdl", caster, "chest")
  }

  onUnlearn(caster:UnitEx){
    this._damageGroup.destroy()
    this._effect.destroy()
  }

}