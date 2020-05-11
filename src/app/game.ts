/** @noSelfInFile **/

import { Timer } from "w3ts";
import { UnitEx } from "app/unitEx";
import { Players } from "w3ts/globals";
import { Spell } from "app/spell";
import { CriticalStrike } from "app/abilities/criticalstrike";
import { Suicide } from "app/abilities/suicide";
import { PermanentImmolation } from "app/abilities/permanentimmolation";
import { ChainLightning } from "app/abilities/chainlightning";
import { CounterStrike } from "app/abilities/counterstrike";
import { PulseWave } from "app/abilities/pulsewave";
import { SoulEater } from "app/abilities/souleater";
import { Bloodlust } from "app/abilities/bloodlust";
import { Projectile } from "./projectile";

export class Game {
  constructor(){
    try {
      const testUnit = new UnitEx(Players[0], FourCC("Ofar"), 0, 0, 270);
      testUnit.name = "Yeetatronics";
      testUnit.addSpell(new ChainLightning());
      testUnit.addSpell(new Bloodlust());
      testUnit.addSpell(new PermanentImmolation());
      testUnit.setHeroLevel(10, true)
      testUnit.invulnerable = true
      Projectile.onInit()
      UnitEx.onInit()
    } catch (e) {
      print(e)
    }   
  }
}