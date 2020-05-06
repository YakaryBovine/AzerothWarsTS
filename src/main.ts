import { Timer, Unit, Trigger } from "w3ts";
import { Players } from "w3ts/globals";
import { addScriptHook, W3TS_HOOK } from "w3ts/hooks";
import { Game } from "app/game";

const BUILD_DATE = compiletime(() => new Date().toUTCString());
const TS_VERSION = compiletime(() => require("typescript").version);
const TSTL_VERSION = compiletime(() => require("typescript-to-lua").version);

function tsMain() {
  try {
    const newGame = new Game();
  }
  catch (e){
    BJDebugMsg(e);
  }
}

addScriptHook(W3TS_HOOK.MAIN_AFTER, tsMain);