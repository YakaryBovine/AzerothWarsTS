/** @noSelfInFile **/

import { Trigger } from "w3ts";
import { UnitEx } from "app/UnitEx";

export interface Spell {
  readonly name:string
  readonly objectId:number
  readonly magic?:boolean
  duration?:number

  onCast?:(caster:UnitEx, target?:UnitEx)=>void
  onTick?:(caster:UnitEx, tick:number)=>void
  onDamaged?:()=>void
  onDamage?:()=>void
  onOrder?:()=>void
  onLearn?:(caster:UnitEx)=>void
  onUnlearn?:(caster:UnitEx)=>void
}