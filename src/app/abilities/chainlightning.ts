import { Spell } from "app/spell";
import { Timer, Group, MapPlayer, Effect } from "w3ts";
import { Vector2 } from "lib/types/vector2";
import { UnitEx } from "app/unitEx";

const lightningDur:number = 0.4
const secondaryLightningDur:number = 0.3
const bounceDelay:number = 0.1

export class ChainLightning implements Spell {
  readonly objectId:number = FourCC("A000")
  readonly name:string = "Chain Lightning"
  private _damage:number = 100
  private _radius:number = 450
  private _maxBounces:number = 14

  private bolt(caster:UnitEx, previousTarget:UnitEx, target:UnitEx, bouncesRemaining:number, struckTargets:Set<UnitEx>){
    //Primary lightning effect
    const tempLightning:lightning = AddLightning("CLPB", false, previousTarget.x, previousTarget.y, target.x, target.y)
    const lightningTimer = new Timer()
    new Effect("Abilities\\Weapons\\Bolt\\BoltImpact.mdl", target.x, target.y).destroy()
    lightningTimer.start(lightningDur, false, function(){
      DestroyLightning(tempLightning)
      lightningTimer.destroy()
      //Secondary lightning effect
      const secondaryLightning:lightning = AddLightning("CLSB", false, previousTarget.x, previousTarget.y, target.x, target.y)
      const secondaryLightningTimer = new Timer()
      secondaryLightningTimer.start(secondaryLightningDur, false, function(){
        DestroyLightning(secondaryLightning)
        secondaryLightningTimer.destroy()
      })
    })
    
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

      let closestUnit:UnitEx
      let closestDist:number = 0
      eligibleTargets.for(function(){
        let enumUnit = UnitEx.fromHandle(GetEnumUnit())
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

  onCast(caster:UnitEx, target:UnitEx){
    this.bolt(caster, caster, target, this._maxBounces, new Set<UnitEx>())
  }
}