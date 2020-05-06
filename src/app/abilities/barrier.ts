/** @noSelfInFile **/

import { Spell } from "app/spell";
import { Trigger, Unit } from "w3ts";

export class Barrier extends Spell {
  _objectId = FourCC("AMdf")
  onCast = function(){
    BJDebugMsg("yeet")
  }
}