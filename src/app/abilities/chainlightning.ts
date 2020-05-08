import { Spell } from "app/spell";
import { Unit, Timer, Group, MapPlayer, Effect } from "w3ts";
import { Vector2 } from "lib/types/vector2";

const lightningDur:number = 0.4
const secondaryLightningDur:number = 0.3
const bounceDelay:number = 0.1

export class ChainLightning implements Spell {
  readonly objectId:number = FourCC("A000")
  private _damage:number = 100
  private _radius:number = 450
  private _maxBounces:number = 14

  private bolt(caster:Unit, previousTarget:Unit, target:Unit, bouncesRemaining:number, struckTargets:Set<Unit>){
    //Primary lightning effect
    const tempLightning:lightning = AddLightning("CLPB", false, previousTarget.x, previousTarget.y, target.x, target.y)
    const lightningTimer = new Timer()
    new Effect("Abilities\\Weapons\\Bolt\\BoltImpact.mdl", target.x, target.y).destroy()
    lightningTimer.start(lightningDur, false, function(){
      DestroyLightning(tempLightning)
      lightningTimer.destroy()
      const secondaryLightning:lightning = AddLightning("CLSB", false, previousTarget.x, previousTarget.y, target.x, target.y)
      const secondaryLightningTimer = new Timer()
      secondaryLightningTimer.start(secondaryLightningDur, false, function(){
        DestroyLightning(secondaryLightning)
        secondaryLightningTimer.destroy()
      })
    })
    //Secondary lightning effect
    
    //Damage
    struckTargets.add(target)
    caster.damageTarget(target.handle, this._damage, this._radius, false, true, ATTACK_TYPE_NORMAL, DAMAGE_TYPE_MAGIC, WEAPON_TYPE_WHOKNOWS)
    //Bounce to new target after a delay
    if (bouncesRemaining == 0) {
      return
    }
    const bounceTimer = new Timer()
    bounceTimer.start(bounceDelay, false, function(){
      const eligibleTargets = new Group()
      eligibleTargets.enumUnitsInRange(target.x, target.y, this._radius, null)

      let closestUnit:Unit
      let closestDist:number = 0
      eligibleTargets.for(function(){
        let enumUnit = Group.getEnumUnit()
        if (enumUnit != null  && enumUnit.isAlive() && enumUnit.isEnemy(caster.owner) && !struckTargets.has(enumUnit)){
          const dist = Vector2.fromUnit(target).distanceTo(Vector2.fromUnit(enumUnit))
          if (dist > closestDist) {
            closestDist = dist
            closestUnit = enumUnit
          }
        } 
      })

      this.bolt(caster, target, closestUnit, bouncesRemaining - 1, struckTargets)
      eligibleTargets.destroy()
      bounceTimer.destroy()
    })
  }

  onCast(){
    const caster:Unit = Unit.fromHandle(GetTriggerUnit())
    this.bolt(caster, caster, Unit.fromHandle(GetSpellTargetUnit()), this._maxBounces, new Set<Unit>())
  }
}