import { Unit, Trigger } from "w3ts"
import { Spell } from "app/spell"

export class UnitEx extends Unit {
  private _spells = new Set<Spell>()
  private _castTrigger:Trigger
  private _damagedTrigger:Trigger
  private _diesTrigger:Trigger

  public destroy(){
    RemoveUnit(this.handle);
    this._castTrigger.destroy()
    this._damagedTrigger.destroy()
    this._diesTrigger.destroy()
  }

  public addSpell(spell:Spell){
    if (this._spells.has(spell)){
      return
    }
    this._spells.add(spell)
    this.addAbility(spell.objectId)

    if ('onCast' in spell){
      this._castTrigger = new Trigger()
      this._castTrigger.registerUnitEvent(this, EVENT_UNIT_SPELL_EFFECT)
      this._castTrigger.addAction(function(){
        if (GetSpellAbilityId() == spell.objectId) {
          spell.onCast(Unit.fromHandle(GetTriggerUnit()))
        }
      })
    }

    if ('onDamaged' in spell){
      this._damagedTrigger = new Trigger()
      this._damagedTrigger.registerUnitEvent(this, EVENT_UNIT_DAMAGED)
      this._damagedTrigger.addAction(function(){
        spell.onDamaged()
      })
    }

    if ('onAcquire' in spell){
      spell.onAcquire(this)
    }
  }
}