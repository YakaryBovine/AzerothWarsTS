import { Spell } from "app/spell";
import { UnitEx } from "app/UnitEx";

export class SoulEater implements Spell {
  readonly objectId:number = FourCC("AEev")
  readonly name:string = "Soul Eater"
  private lifesteal:number = 0.25

  onLearn(caster:UnitEx){
    caster.modLifestealBonus(this.lifesteal)
  }

  onUnlearn(caster:UnitEx){
    caster.modLifestealBonus(-this.lifesteal)
  }
}