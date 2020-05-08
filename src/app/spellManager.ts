import { Trigger, Unit } from "w3ts";
import { Spell } from "app/spell"

export class SpellManager {
  private _DamagedTrigger:Trigger
  private _SpellsWithDamageComponents:Set<Spell>

  private OnInit(){
    this._DamagedTrigger = new Trigger()
    this._DamagedTrigger.registerAnyUnitEvent(EVENT_PLAYER_UNIT_DAMAGED)
    this._DamagedTrigger.addAction(function(){
      //Go through every spell that has an OnDamage method and run OnDamage
    })
  }
}