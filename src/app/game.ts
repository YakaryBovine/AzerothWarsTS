/** @noSelfInFile **/

import { Timer } from "w3ts";
import { UnitEx } from "app/unitEx";
import { Players } from "w3ts/globals";
import { Spell } from "app/spell";
import { CriticalStrike } from "app/abilities/criticalstrike";
import { Suicide } from "app/abilities/suicide";
import { ChainLightning } from "app/abilities/chainlightning";
import { CounterStrike } from "app/abilities/counterstrike";
import { PulseWave } from "app/abilities/pulsewave";
import { Projectile } from "./projectile";

export class Game {
  constructor(){
    const testUnit = new UnitEx(Players[0], FourCC("Ofar"), 0, 0, 270);
    testUnit.name = "Yeetatronics";
    testUnit.addSpell(new ChainLightning());
    testUnit.addSpell(new CounterStrike());
    testUnit.addSpell(new PulseWave());
    testUnit.setHeroLevel(10, true)
    testUnit.strength = 1000
    //testUnit.invulnerable = true;
    Projectile.onInit()
  }
}