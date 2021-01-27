let tinkerDefence: ScriptDescription = {};

namespace TinkerDefence {
    export let HERO_INDEX = 'npc_dota_hero_tinker'
    export let gameStart: boolean = false
    export let myHero: Hero
    export let myPlayer: Player
    export let TinkerMenuStatus: boolean = false
    export let statusBind: boolean = false
    export let T3MidVector: Vector
    export let T3TopVector: Vector
    export let T3BotVector: Vector
    export let ThroneVector: Vector
    export let font = Renderer.LoadFont('Arial', 15, Enum.FontWeight.BOLD, Enum.FontFlags.OUTLINE)
    export const sides = ['None', 'T3 - Mid', 'T3 - Top', 'T3 - Bot']

    let TinkerDefenceMenu = Menu.AddToggle(['More', 'Heroes', 'Intelligence', 'Tinker', 'BaseDef'], 'Статус', false)
    export let keybindHandle = Menu.AddKeyBind(['More', 'Heroes', 'Intelligence', 'Tinker', 'BaseDef'], 'Кнопка активации', Enum.ButtonCode.KEY_NONE)
    export let TinkerDefenceBox = Menu.AddComboBox(['More', 'Heroes', 'Intelligence', 'Tinker', 'BaseDef'], 'Сторона для защиты', sides, 0)
    .OnChange(state => (TinkerDefenceBox = state.newValue))
    .GetValue();

    TinkerDefenceMenu.SetTip('Использует скиллы для защиты вашей базы')

    TinkerDefenceMenu.OnChange(state => {
        TinkerMenuStatus = state.newValue;
    })
    TinkerDefenceMenu.GetValue();

    Menu.SetImage(['More', 'Heroes'], "~/menu/40x40/heroes.png")
    Menu.SetImage(['More', 'Heroes', 'Intelligence'], "~/menu/40x40/intelligence.png")
    Menu.SetImage(['More', 'Heroes', 'Intelligence', 'Tinker'], "panorama/images/heroes/icons/npc_dota_hero_tinker_png.vtex_c")

    export namespace Load {
        export function Init(): void {
            if (GameRules.IsActiveGame()) {
                gameStart = true;
                    myHero = EntitySystem.GetLocalHero()
                        myPlayer = EntitySystem.GetLocalPlayer()
                        setTimeout(() => {
                            if (myHero.GetTeamNum() === 2) {
                                T3MidVector = new Vector(-4951, -4434, 384)
                                T3TopVector = new Vector(-6595, -3844, 384)
                                T3BotVector = new Vector(-4386, -6086, 384)
                                ThroneVector = new Vector(-5845, 5367, 384)
                            } else {
                                T3MidVector = new Vector(4547, 4103, 384)
                                T3TopVector = new Vector(3990, 5790, 384)
                                T3BotVector = new Vector(6323, 3468, 384)
                                ThroneVector = new Vector(5529, 4992, 384)
                            }
                        }, 500)
            }
            if (!myHero || !myHero.IsExist() || myHero.GetUnitName() !== HERO_INDEX) {
                gameStart = false;
                return;
            }
        }
    }

    export namespace GetAll {
        export function IsTalant(self, num) {
            return (self.GetTalentsMask() & num) == num;
        }

        export function NeedVector(i, item_blink, item_lens, mind){
            if(item_blink.GetCooldown() === 0.0){
                if(mind.Distance(i.myHero.GetAbsOrigin()) < item_lens && mind.Distance(i.myHero.GetAbsOrigin()) > 750){
                    item_blink.CastPosition(mind)
                }
            }
        }
    }
}

tinkerDefence.OnDraw = () => {
    if(TinkerDefence.TinkerMenuStatus && TinkerDefence.gameStart && TinkerDefence.statusBind && TinkerDefence.sides[TinkerDefence.TinkerDefenceBox] !== 'None') {
        let [x, y, isOnScreen] = Renderer.WorldToScreen(TinkerDefence.myHero.GetAbsOrigin().add(new Vector(0, 0, TinkerDefence.myHero.GetHealthBarOffset())))
    
        if(!isOnScreen) {
            return;
        }

        Renderer.SetDrawColor(255, 255, 255, 255);
        Renderer.DrawTextCentered(TinkerDefence.font, x, y-70, `[Defence base] ${TinkerDefence.sides[TinkerDefence.TinkerDefenceBox]}`);
    }
}

tinkerDefence.OnUpdate = () => {
    let i = TinkerDefence
        if(i.gameStart && i.TinkerMenuStatus){
            if(Menu.IsKeyDownOnce(i.keybindHandle)){
                if(i.statusBind){
                    i.statusBind = false
                }
                else i.statusBind = true
            }
        if(!i.myHero.IsAlive())
            i.statusBind = false;

    let box = TinkerDefence.sides[TinkerDefence.TinkerDefenceBox]
    let mind = new Vector(3791, 4923, 384)
    let rocket = i.myHero.GetAbilityByIndex(1)
    let march = i.myHero.GetAbilityByIndex(2)
    let rearm = i.myHero.GetAbilityByIndex(5)
    let item_blink = i.myHero.GetItem("item_blink", true);
    let item_lens: Item = i.myHero.GetItem("item_aether_lens", true)
        if(i.statusBind && i.myHero.GetAbilityByIndex(5).GetLevel() > 1){
            if(i.myHero.IsAlive() && item_blink){
                if(item_blink.GetCooldown() === 0){
                    item_blink.CastPosition(Input.GetWorldCursorPos())
                }
                else if(!rearm.IsChannelling()){
                        rearm.CastNoTarget()
                }
            }
        }
    }
}

tinkerDefence.OnGameEnd = () => {
    TinkerDefence.gameStart = false;
};

tinkerDefence.OnScriptLoad = tinkerDefence.OnGameStart = TinkerDefence.Load.Init;

RegisterScript(tinkerDefence);