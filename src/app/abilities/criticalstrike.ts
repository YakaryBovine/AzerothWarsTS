import { Spell } from "app/spell";
import { Trigger, Unit } from "w3ts";

export class CriticalStrike implements Spell {
  readonly objectId:number = FourCC("Anhe")
  readonly name:string = "Critical Strike"
  private chance:number = 0.25
  private mult:number = 100

  onDamage(){
    if (GetRandomReal(0, 1) <= this.chance) {
      BlzSetEventDamage(GetEventDamage()*this.mult)
    }
  }
}