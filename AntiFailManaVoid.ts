let antiFailManaVoid: ScriptDescription = {};

namespace AntiFailManaVoid {
    export let gameStart: boolean = false;
    export let myHero: Hero;
    export let myPlayer: Player;
    export let antiFailManaVoidBool: boolean = false;
    export let HERO_INDEX = 'npc_dota_hero_antimage';
    export let font = Renderer.LoadFont('Arial', 24, Enum.FontWeight.BOLD);
    export let blockne = false
    export let imageManaVoid

    export let antiFailManaVoidStatus = Menu.AddToggle(['More', 'Heroes', 'Agility', 'AntiMage', 'AntiFail'], 'ManaVoid', false)
    export let antiFailManaVoidPercent = Menu.AddSlider(['More', 'Heroes', 'Agility', 'AntiMage', 'AntiFail'], 'Если процент маны больше чем n%,\nблокируем ManaVoid', 60, 100, 85, 5)
    export let antiFailManaVoidPercentT

    antiFailManaVoidStatus.SetTip('Если у врага будет %маны больше чем вы указали, ManaVoid будет отменён')

    antiFailManaVoidStatus.OnChange(state => {
        antiFailManaVoidBool = state.newValue;
    })
    antiFailManaVoidStatus.GetValue();

    Menu.SetImage(['More', 'Heroes'], "~/menu/40x40/heroes.png")
    Menu.SetImage(['More', 'Heroes', 'Agility'], "~/menu/40x40/agillity.png")
    Menu.SetImage(['More', 'Heroes', 'Agility', 'AntiMage'], "panorama/images/heroes/icons/npc_dota_hero_antimage_png.vtex_c")
    Menu.SetImage(['More', 'Heroes', 'Agility', 'AntiMage', 'AntiFail'], 'panorama/images/spellicons/antimage_mana_void_png.vtex_c')

    export namespace Load {
        export function Init(): void {
            if (GameRules.IsActiveGame()) {
                gameStart = true;
                myHero = EntitySystem.GetLocalHero();
                myPlayer = EntitySystem.GetLocalPlayer();
            }
            if (!myHero || !myHero.IsExist() || myHero.GetUnitName() !== HERO_INDEX) {
                gameStart = false;
                return;
            }
        }
    }

    export namespace BigText {
        export function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
    }
}

antiFailManaVoid.OnDraw = () => {
    if(!AntiFailManaVoid.imageManaVoid) {
        AntiFailManaVoid.imageManaVoid = Renderer.LoadImage(`panorama/images/spellicons/antimage_mana_void_png.vtex_c`);
    }

    if(AntiFailManaVoid.antiFailManaVoidBool && AntiFailManaVoid.gameStart){
        if(AntiFailManaVoid.blockne){
            let [width, height] = Renderer.GetScreenSize();
            Renderer.SetDrawColor(255, 255, 255, 255);
            Renderer.DrawTextCentered(AntiFailManaVoid.font, width/2, height/2-200, 'Заблокирован');
            Renderer.SetDrawColor(255, 255, 255, 255);
            Renderer.DrawImage(AntiFailManaVoid.imageManaVoid, width/2-100, height/2-213, 25, 25);
 
            if(Engine.OnceAt(2)){
                AntiFailManaVoid.blockne = false
            }
        }
    }
}

antiFailManaVoid.OnUpdate = () => {
    if (Engine.OnceAt(0.33)) {
        AntiFailManaVoid.antiFailManaVoidPercentT = AntiFailManaVoid.antiFailManaVoidPercent.GetValue();
    }
};

antiFailManaVoid.OnPrepareUnitOrders = (order) => {
    if(AntiFailManaVoid.antiFailManaVoidBool && AntiFailManaVoid.gameStart){
        if(order.ability) {
            if(order.target === null){
                return
            }
                if(order.target.GetUnitName() !== null){
                    let percentMana = order.target.GetMana()/order.target.GetMaxMana()*100;
                    if(AntiFailManaVoid.antiFailManaVoidPercentT <= percentMana){
                        AntiFailManaVoid.blockne = true
                        EntitySystem.GetLocalPlayer().PrepareUnitOrders(Enum.UnitOrder.DOTA_UNIT_ORDER_STOP, AntiFailManaVoid.myHero, null, null, Enum.PlayerOrderIssuer.DOTA_ORDER_ISSUER_SELECTED_UNITS, AntiFailManaVoid.myHero, false, true)
                        return false;
                    }
                    else{
                        Chat.Print('ConsoleChat', `<font color="#FFFFFF">У цели меньше маны чем</font> <font color="#A52A2A">${AntiFailManaVoid.antiFailManaVoidPercentT}%`);
                    }
                }
        //console.log(RuneOfAmplification.myHero.GetUnitName())
        //console.log(order.abilityIndex)
        //console.log(order.target.GetUnitName())
        }
    }
}

antiFailManaVoid.OnGameEnd = () => {
    AntiFailManaVoid.gameStart = false;
};

antiFailManaVoid.OnScriptLoad = antiFailManaVoid.OnGameStart = AntiFailManaVoid.Load.Init;

declare interface PreparedOrder {
    player: Player;
    order: Enum.UnitOrder;
    target: NPC | null;
    position: Vector | null;
    ability: Ability | null;
    abilityIndex: Number | null;
    orderIssuer: Enum.PlayerOrderIssuer;
    npc: NPC | null;
    queue: boolean;
    showEffects: boolean;
}

RegisterScript(antiFailManaVoid);