import { Spell } from "app/spell";
import { Trigger, Unit } from "w3ts";

export class Suicide implements Spell {
  readonly objectId:number = FourCC("Acht")

  onCast(){
    KillUnit(GetTriggerUnit())
  }
}