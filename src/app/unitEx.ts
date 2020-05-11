import { Unit, Trigger, Timer, MapPlayer } from "w3ts"
import { Spell } from "app/spell"

const BUFF_TICK_PERIOD:number = 1/32

export class UnitEx extends Unit {
  private static _tickTimer:Timer
  private static _withLimitedSpells:Set<UnitEx> = new Set<UnitEx>()
  private static _withTickSpells:Set<UnitEx> = new Set<UnitEx>()
  private static _withAttackSpells:Set<UnitEx> = new Set<UnitEx>()

  private _spells:Map<number,Spell> = new Map<number,Spell>()
  private _spellsLimited = new Set<Spell>()
  private _spellsTick = new Set<Spell>()
  private _spellsAttack = new Set<Spell>()
  private _castTrigger:Trigger
  private _damagedTrigger:Trigger
  private _diesTrigger:Trigger

  private _lifestealBonus:number = 0
  private _attackSpeedBonus:number = 0
  private _movementSpeedBonus:number = 0
  private _scalingBonus:number = 0

  public modAttackSpeedBonus(mod:number){
    const abilId:number = FourCC("AIsx")
    this._attackSpeedBonus = this._attackSpeedBonus + mod
    this.addAbility(abilId)
    BlzSetAbilityIntegerField(this.getAbility(abilId), ABILITY_IF_LEVELS, 2)
    BlzSetAbilityRealLevelField(this.getAbility(abilId), ABILITY_RLF_ATTACK_SPEED_INCREASE_ISX1, 0, this._attackSpeedBonus)
    this.setAbilityLevel(abilId, 2)
    this.setAbilityLevel(abilId, 1)
  }

  public get attackSpeedBonus(){
    return this._attackSpeedBonus
  }

  public modMoveSpeedBonus(mod:number){
    const abilId:number = FourCC("AIms")
    this._movementSpeedBonus = this._movementSpeedBonus + mod
    this.addAbility(abilId)
    BlzSetAbilityIntegerField(this.getAbility(abilId), ABILITY_IF_LEVELS, 2)
    BlzSetAbilityIntegerLevelField(this.getAbility(abilId), ABILITY_ILF_MOVEMENT_SPEED_BONUS, 0, this._movementSpeedBonus)
    this.setAbilityLevel(abilId, 2)
    this.setAbilityLevel(abilId, 1)
  }

  public get moveSpeedBonus(){
    return this._movementSpeedBonus
  }

  public modScalingBonus(mod:number){
    this._scalingBonus = this._scalingBonus + mod
    this.setScale(1 + this._scalingBonus, 1 + this._scalingBonus, 1 + this._scalingBonus)
  }

  public get scalingBonus(){
    return this._scalingBonus
  }

  public modLifestealBonus(mod:number){
    this._lifestealBonus = this._lifestealBonus + mod
    this.addAbility(FourCC("AIva"))
    BlzSetAbilityRealLevelField(this.getAbility(FourCC("AIva")), ABILITY_RLF_LIFE_STEAL_AMOUNT, 1, this._lifestealBonus)
  }

  public get lifestealBonus(){
    return this._lifestealBonus
  }

  public destroy(){
    RemoveUnit(this.handle);
    this._castTrigger.destroy()
    this._damagedTrigger.destroy()
    this._diesTrigger.destroy()
  }

  private updateDurations(tick:number){
    for (var spell of this._spellsLimited){
      spell.duration = spell.duration - tick
      if (spell.duration <= 0){
        this.removeSpell(spell)
      }
    }
  }

  private tick(tick:number){
    for (var spell of this._spellsTick){
      spell.onTick(this, tick)
    }
  }

  public hasSpell(objectId:number){
    return this._spells.has(objectId)
  }

  public getSpell(objectId:number){
    return this._spells.get(objectId)
  }

  public removeSpell(spell:Spell | number){
    if (typeof spell === "number"){
      if (this.hasSpell(spell)){
        this.removeSpell(this._spells.get(spell))
      }
      return
    }

    if (this._spells.has(spell.objectId)){
      spell.onUnlearn(this)
      this.removeAbility(spell.objectId)
      this._spells.delete(spell.objectId)
      this.deleteFromSpellSet(spell, this._spellsLimited, UnitEx._withLimitedSpells)
      this.deleteFromSpellSet(spell, this._spellsTick, UnitEx._withTickSpells)
    } 
  }

  private addToSpellSet(spell:Spell, spellSet:Set<Spell>, unitsWith:Set<UnitEx>){
    spellSet.add(spell)
    unitsWith.add(this)
  }

  private deleteFromSpellSet(spell:Spell, spellSet:Set<Spell>, unitsWith:Set<UnitEx>){
    spellSet.delete(spell)
    if (spellSet.size === 0){
      unitsWith.delete(this)
    }
  }

  public addSpell(spell:Spell){
    if (this._spells.has(spell.objectId)){
      return
    }

    this._spells.set(spell.objectId, spell)
    this.addAbility(spell.objectId)

    if ('onCast' in spell){
      this._castTrigger = new Trigger()
      this._castTrigger.registerUnitEvent(this, EVENT_UNIT_SPELL_EFFECT)
      this._castTrigger.addAction(function(){
        if (GetSpellAbilityId() == spell.objectId) {
          spell.onCast(UnitEx.fromHandle(GetTriggerUnit()), UnitEx.fromHandle(GetSpellTargetUnit()))
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

    if ('duration' in spell){
      this.addToSpellSet(spell, this._spellsLimited, UnitEx._withLimitedSpells)
    }

    if ('onTick' in spell){
      this.addToSpellSet(spell, this._spellsTick, UnitEx._withTickSpells)
    }

    if ('onLearn' in spell){
      spell.onLearn(this)
    }
  }

  constructor(owner: MapPlayer | number, unitId: number, x: number, y: number, face: number, skinId?: number) {
    super(owner, unitId, x, y, face, skinId)
  }

  public static fromHandle(handle: unit): UnitEx {
    return this.getObject(handle);
  }

  public static onInit(){
    UnitEx._tickTimer = new Timer()
    UnitEx._tickTimer.start(BUFF_TICK_PERIOD, true, function(){
      UnitEx._withTickSpells.forEach((unitEx:UnitEx)=>{
        unitEx.tick(BUFF_TICK_PERIOD)
      })
      UnitEx._withLimitedSpells.forEach((unitEx:UnitEx)=>{
        unitEx.updateDurations(BUFF_TICK_PERIOD)
      })
    })
  }
}