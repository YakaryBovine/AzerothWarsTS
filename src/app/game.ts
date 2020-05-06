/** @noSelfInFile **/

import { Timer, Unit } from "w3ts";
import { Players } from "w3ts/globals";
import { Spell } from "app/spell";
import { Barrier } from "abilities/barrier";

export class Game {
  constructor(){
    const testUnit = new Unit(Players[0], FourCC("hfoo"), 0, 0, 270);
    testUnit.name = "Yeetatronics";
    const barrier = new Barrier(testUnit);
  }
}