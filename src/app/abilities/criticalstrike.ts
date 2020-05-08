import { Spell } from "app/spell";
import { Trigger, Unit } from "w3ts";

export class CriticalStrike implements Spell {
  readonly objectId:number = FourCC("Anhe")
  private chance:number = 0.25
  private mult:number = 100

  onDamaged(){
    if (GetRandomReal(0, 1) <= this.chance) {
      BlzSetEventDamage(GetEventDamage()*this.mult)
    }
  }
}