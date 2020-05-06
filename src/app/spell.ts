/** @noSelfInFile **/

import { Trigger, Unit } from "w3ts";

export abstract class Spell {
  private static _objectId: number
  private _unit: Unit

  private _castTrigger:Trigger
  private _attackTrigger:Trigger

  private static onPointCast?:() => void;
  private static onUnitCast?:()  => void;
  private static onCast?:() => void;
  private static onAttack?:() => void;
  private static onAttacked?:() => void;

  public set unit(whichUnit: Unit){
    whichUnit.removeAbility(Spell._objectId)
    this._unit = whichUnit
    whichUnit.addAbility(Spell._objectId)
  }

  public constructor(whichUnit: Unit) {
    this.unit = whichUnit

    if (Spell.onCast) {
      this._castTrigger = new Trigger()
      this._castTrigger.registerUnitEvent(this._unit, EVENT_UNIT_SPELL_CAST)
    }

    if (Spell.onAttack) {
      this._attackTrigger = new Trigger()
      this._attackTrigger.registerAnyUnitEvent(EVENT_PLAYER_UNIT_DAMAGED)
    }
  }

}