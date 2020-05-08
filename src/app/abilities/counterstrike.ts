import { Spell } from "app/spell";
import { Trigger, Unit, Group, Effect } from "w3ts";

export class CounterStrike implements Spell {
  readonly objectId:number = FourCC("Aabs")
  private _chance:number = 0.7
  private _damage:number = 40
  private _radius:number = 200

  onDamaged(){
    const caster:Unit = Unit.fromHandle(GetTriggerUnit())
    if (GetRandomReal(0, 1) <= this._chance) {
      new Effect("Abilities\\Spells\\Human\\Thunderclap\\ThunderClapCaster.mdl", caster.x, caster.y).destroy()
      const eligibleTargets = new Group()
      eligibleTargets.enumUnitsInRange(caster.x, caster.y, this._radius, null)
      eligibleTargets.for(function(){
        let enumUnit = Group.getEnumUnit()
        if (enumUnit != null  && enumUnit.isAlive() && enumUnit.isEnemy(caster.owner)){
          caster.damageTarget(enumUnit.handle, this._damage, this._radius, false, true, ATTACK_TYPE_NORMAL, DAMAGE_TYPE_MAGIC, WEAPON_TYPE_WHOKNOWS)
        } 
      })
      eligibleTargets.destroy()
    }
  }
}