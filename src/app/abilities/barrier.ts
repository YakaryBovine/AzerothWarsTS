import { Spell } from "../spell";

export class Barrier extends Spell {
  _objectId = FourCC("AMdf")
  onCast = function(){
    BJDebugMsg("yeet")
  }
}