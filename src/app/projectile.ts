import { Timer, Unit, Effect } from "w3ts";

const PROJ_PERIOD:number = 1/32

export abstract class Projectile {
  private static all:Set<Projectile> = new Set<Projectile>()
  private _effect:Effect
  private _x:number
  private _y:number
  private _face:number
  protected _vel:number
  protected _radius:number
  protected _zOffset:number

  onTick?:()=>void
  onHit?:(target:Unit)=>void

  protected set modelPath(modelPath:string){
    if (this._effect) {
      this._effect.destroy()
    }
    this._effect = new Effect(modelPath, this._x, this._y)
  }

  protected set face(face:number){
    if (this._effect){ 
      this._effect.setYaw(face)
    }
    this._face = face
  }

  protected set x(x:number){
    if (this._effect){ 
      this._effect.x = x
    }
    this._x = x
  }

  protected set y(y:number){
    if (this._effect){ 
      this._effect.y = y
    }
    this._y = y
  }

  private tick(){
    this.x = this._x + Cos(this._face * bj_DEGTORAD) * this._vel*PROJ_PERIOD
    this.y = this._y + Sin(this._face * bj_DEGTORAD) * this._vel*PROJ_PERIOD
    if ('onTick' in this){
      this.onTick()
    }
  }

  public static onInit(){
    const projPeriod = new Timer()
    projPeriod.start(PROJ_PERIOD, true, function(){
      for (let proj of Projectile.all) {
        proj.tick()
      }
    })
  }

  public constructor(attacker:Unit, x:number, y:number, face:number){
    this.x = x
    this.y = y
    this.face = face
    Projectile.all.add(this)
  }
}