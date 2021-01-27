let goodEnemyForAntiMage: ScriptDescription = {};

namespace GoodEnemyForAntiMage {
    export let gameStart: boolean = false;
    export let myHero: Hero;
    export let myPlayer: Player;
    export let GoodEnemyAntiMageStat: boolean = false;
    export let enemypriority: Array<[Hero, number]>;
    export let HERO_INDEX = 'npc_dota_hero_antimage';
    export let font = Renderer.LoadFont('Arial', 27, Enum.FontWeight.BOLD);

    export let goodEnemyForAntiMageStatus = Menu.AddToggle(['More', 'Heroes', 'Agility', 'AntiMage', 'GoodEnemy'], 'Статус работы', false)
    export let goodtargetMessage = Menu.AddSlider(['More', 'Heroes', 'Agility', 'AntiMage', 'GoodEnemy'], 'Частота оповещений в чат(сек)', 1, 120, 30, 1)
    export let goodtargetPing = Menu.AddSlider(['More', 'Heroes', 'Agility', 'AntiMage', 'GoodEnemy'], 'Частота пингов(сек)', 1, 120, 30, 1)
    export let goodtargetMessageTime, goodtargerPingTime

    goodEnemyForAntiMageStatus.SetTip('Данный скрипт будет отмечать и информировать вас о том герое врага,\nкоторого будет лучше всего зафокусить и убить')

    goodEnemyForAntiMageStatus.OnChange(state => {
        GoodEnemyAntiMageStat = state.newValue;
    })
    goodEnemyForAntiMageStatus.GetValue();

    Menu.SetImage(['More', 'Heroes'], "~/menu/40x40/heroes.png")
    Menu.SetImage(['More', 'Heroes', 'Agility'], "~/menu/40x40/agillity.png")
    Menu.SetImage(['More', 'Heroes', 'Agility', 'AntiMage'], "panorama/images/heroes/icons/npc_dota_hero_antimage_png.vtex_c")

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

goodEnemyForAntiMage.OnDraw = () => {
    if(GoodEnemyForAntiMage.GoodEnemyAntiMageStat && GoodEnemyForAntiMage.gameStart){
        let enemy = null
            for(let i = 4; i>-1; i--){
                let tempEnemy = GoodEnemyForAntiMage.enemypriority[i][0]

                if(!tempEnemy.IsDormant()){
                    enemy = GoodEnemyForAntiMage.enemypriority[i]
                    break
                }
            }

            if(  enemy && enemy[0].IsAlive() && !enemy[0].IsDormant() && !enemy[0].IsIllusion() && !enemy[0].IsMeepoClone() && enemy[0].IsVisible()){
        let [x, y, isOnScreen] = Renderer.WorldToScreen(GoodEnemyForAntiMage.enemypriority[4][0].GetAbsOrigin().add(new Vector(0, 0, GoodEnemyForAntiMage.enemypriority[4][0].GetHealthBarOffset())));
            if(!isOnScreen) {
                return;
            }

        Renderer.SetDrawColor(255, 255, 255, 255);
        Renderer.DrawText(GoodEnemyForAntiMage.font, x-85, y-75, 'ЛУЧШАЯ ЦЕЛЬ')
        }
    }
};

goodEnemyForAntiMage.OnUpdate = () => {
    if (Engine.OnceAt(0.33)) {
        GoodEnemyForAntiMage.goodtargetMessageTime = GoodEnemyForAntiMage.goodtargetMessage.GetValue();
        GoodEnemyForAntiMage.goodtargerPingTime = GoodEnemyForAntiMage.goodtargetPing.GetValue();
        if (GoodEnemyForAntiMage.GoodEnemyAntiMageStat && GoodEnemyForAntiMage.gameStart) {
            GoodEnemyForAntiMage.enemypriority = [];

            for (let i of EntitySystem.GetHeroesList()) {
                if (!i.IsSameTeam(GoodEnemyForAntiMage.myHero))
                    GoodEnemyForAntiMage.enemypriority.push([i, i.GetMaxMana()])
            }

            GoodEnemyForAntiMage.enemypriority.sort((a, b) => {
                return (a[1] - b[1])
            });

            for (let i of GoodEnemyForAntiMage.enemypriority) {
                console.log(i[0].GetUnitName(), i[1])
            }

            let enemy = null
            for(let i = 4; i>-1; i--){
                let tempEnemy = GoodEnemyForAntiMage.enemypriority[i][0]

                if(!tempEnemy.IsDormant()){
                    enemy = GoodEnemyForAntiMage.enemypriority[i]
                    break
                }
            }

            if(Engine.OnceAt(GoodEnemyForAntiMage.goodtargerPingTime - 0.33) && GoodEnemyForAntiMage.enemypriority[4]){
                if( enemy && enemy[0].IsAlive() && !enemy[0].IsDormant() && !enemy[0].IsIllusion() && !enemy[0].IsMeepoClone() && enemy[0].IsVisible()){
                    MiniMap.Ping(GoodEnemyForAntiMage.enemypriority[4][0].GetAbsOrigin(), Enum.PingType.NORMAL, true);
                }
            }

            if (Engine.OnceAt(GoodEnemyForAntiMage.goodtargetMessageTime - 0.33) && GoodEnemyForAntiMage.enemypriority[4]) {
                if( enemy && enemy[0].IsAlive() && !enemy[0].IsDormant()){
                let finalNameH = GoodEnemyForAntiMage.enemypriority[4][0].GetUnitName().replace('npc_dota_hero_', '').split('_');
                let target = '';
                for (let k = 0; k < finalNameH.length; k++) {
                    target += GoodEnemyForAntiMage.BigText.capitalizeFirstLetter(finalNameH[k]) + " "
                }
                    Chat.Print('ConsoleChat', '<font color="#FFFFFF">Лучшая цель: </font><font color="#A52A2A">' + " " + target);
                }
                else{
                    Chat.Print('ConsoleChat', 'Цель не обнаружена');
                }
            }
        }
    }
};

goodEnemyForAntiMage.OnGameEnd = () => {
    GoodEnemyForAntiMage.gameStart = false;
};

goodEnemyForAntiMage.OnScriptLoad = goodEnemyForAntiMage.OnGameStart = GoodEnemyForAntiMage.Load.Init;

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

RegisterScript(goodEnemyForAntiMage);