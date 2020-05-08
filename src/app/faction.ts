import { MapPlayer } from "w3ts"

export class Team {
  
}

export class Faction {
  private static _factionedPlayers:WeakSet<MapPlayer>

  private _name: string
  private _color: playercolor
  private _prefix: string
  private _icon: string
  private _player: MapPlayer
  private _objectLimits: Map<number, number>
  private _objectLevels: Map<number, number>

  public set player(player:MapPlayer){
    Faction._factionedPlayers.delete(player)

    this._player = player
    assert(!Faction._factionedPlayers.has(player), "Attempted to set faction of a player that already has one.")
    Faction._factionedPlayers.add(player)
    this._player.color = this._color
    //Adjust object limits
    for (const [objectId, limit] of this._objectLimits) {
      this._player.setTechMaxAllowed(objectId, limit)
    }
    //Adjust object levels
    for (const [objectId, level] of this._objectLevels) {
      this._player.setTechResearched(objectId, level)
    }
  }

  public constructor(name: string, color:playercolor, prefix:string, icon:string, objectLimits:Map<number, number>, objectLevels:Map<number, number>){
    this._name = name
    this._color = color
    this._prefix = prefix
    this._icon = icon
    this._objectLimits = objectLimits
    this._objectLevels = objectLevels
  }
}