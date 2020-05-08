/** @noSelfInFile **/

import { Trigger, Unit } from "w3ts";

export interface Spell {
  readonly objectId: number
  onCast?:(caster:Unit)=>void
  onDamaged?:()=>void
  onDamage?:()=>void
  onOrder?:()=>void
  onAcquire?:(caster:Unit)=>void
  onUnacquire?:(caster:Unit)=>void
}