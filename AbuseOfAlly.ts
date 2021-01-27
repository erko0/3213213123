let AbuseAlly: ScriptDescription = {};

namespace AbuseOfAlly {
    export let gameStart: boolean = false; //Началась игра?
    export let myHero: Hero; //Герой игрока
    export let myPlayer: Player; //Игрок
    export let AOAmenuValue: boolean = false;
    export let AOAmenu2Value: boolean = true;
    export let AOAmenu2adValue: boolean = false;
    export let IsContinue = true;
    export let AOAmenu3Value: number = 0;
    export let AOAmenu3adValue: number = 0;
    export let AOAmenu4Value: boolean[] = [];
    export let myTeam: number = 0;
    export let AOAmenu4Ally: string[] = [];
    export let AOAmenuListAlly = [];
    export const actions = ['Фарм леса', 'Пуш лайна'];
    export const ancientSpot = ['Не фармить древних', 'Фармить все'];
    export const points = [
        new Vector(4732, -4254, 128), new Vector(3100, -4593, 128), new Vector(1305, -5322, 256), new Vector(-136, -1994, 128), new Vector(-303, -3365, 256), new Vector(-1848, -4303, 128), //Большой лес (СВЕТ) [0-5]
        new Vector(-2560, -653, 128), new Vector(-3886, 1355, 256), //Малый лес (СВЕТ) [6-7]
        new Vector(-4925, -377, 256), //Древние (СВЕТ) [8]
        new Vector(-7195, -6699, 392), //База (СВЕТ) [9]

        new Vector(-4348, 3479, 128), new Vector(-2422, 4870, 128), new Vector(-590, 5287, 256), new Vector(112, 3638, 256), new Vector(-943, 2056, 256), new Vector(1118, 3436, 128), //Большой лес (ТЬМА) [10-15]
        new Vector(2192, -405, 128), new Vector(4508, 891, 256), //Малый лес (ТЬМА) [16-17]
        new Vector(4338, -297, 256), //Древние (ТЬМА) [18]
        new Vector(6975, 6408, 392), //База (ТЬМА)[19]

        new Vector(5618, -5711, 128), new Vector(-1080, -842, 128) , new Vector(-6271, 2593, 128), //Низ-Мид-Топ (СВЕТ) [20-22]
        new Vector(6160, -2466, 128), new Vector(129, 212, 128 ), new Vector(-5940, 5376, 128) //Низ-Мид-Топ (ТЬМА) [23-25]
    ];

    export let AOAmenu = Menu.AddToggle(['BaseFRFA', 'Abuse', 'Abuse Of Ally'], 'Статус работы', false);
    Menu.SetImage(['BaseFRFA', 'Abuse'], "~/menu/20x20/abuse.png")
    AOAmenu.SetTip('Включая данный скрипт, вы можете заставить героя ливнушего союзника фармить для вас лес и отпушивать лайны\nТак же скрипт работает если союзник дал вам управление');
    AOAmenu.OnChange(state => {AOAmenuValue = state.newValue})
    AOAmenuValue = AOAmenu.GetValue();

    export let AOAmenu2 = Menu.AddToggle(['BaseFRFA', 'Abuse', 'Abuse Of Ally'], '"Умная" защита', true);
    AOAmenu2.OnChange(state => {AOAmenu2Value = state.newValue})
    AOAmenu2Value = AOAmenu2.GetValue();
    AOAmenu2.SetTip('Включает "умную" защиту героя\nЕсли рядом будет обнаружен враг - герой уйдёт на другую точку или на базу\nТак же если у героя будет мало HP - он уйдёт на базу');

    export let AOAmenu2ad = Menu.AddToggle(['BaseFRFA', 'Abuse', 'Abuse Of Ally'], 'Использовать Teleport?', false);
    AOAmenu2ad.OnChange(state => {AOAmenu2adValue = state.newValue})
    AOAmenu2adValue = AOAmenu2ad.GetValue();
    AOAmenu2ad.SetTip('Если есть Teleport и он не в КД, использует его для быстрого перемещения на базу\nЕсли включена "Умная" защита, телепорт будет использоваться только если рядом нет врагов');

    export let AOAmenu3 = Menu.AddComboBox(['BaseFRFA', 'Abuse', 'Abuse Of Ally'], 'Действие', actions, 0)
    AOAmenu3.OnChange(state => {AOAmenu3Value = state.newValue})
    AOAmenu3Value = AOAmenu3.GetValue();
    AOAmenu3.SetTip('Фарм леса - Герой будет ходить по лесу и фармить `споты`\nПуш лайна - Герой будет Пушить/Отпушивать лайны')

    export let AOAmenu3ad = Menu.AddComboBox(['BaseFRFA', 'Abuse', 'Abuse Of Ally'], 'Какие споты фармить', ancientSpot, 0)
    AOAmenu3ad.OnChange(state => {AOAmenu3adValue = state.newValue})
    AOAmenu3adValue = AOAmenu3ad.GetValue();

    export let AOAmenu4 = Menu.AddMultiSelect(['BaseFRFA', 'Abuse', 'Abuse Of Ally'], 'Кем управляем:', AOAmenu4Ally, AOAmenu4Value)
    AOAmenu4.OnChange(state => { AOAmenu4Value = state.newValue; })
    AOAmenu4Value = AOAmenu4.GetValue();

    Menu.GetFolder(['BaseFRFA', 'Abuse', 'Abuse Of Ally']).SetTip('version 1.0.0');

    export namespace Load {
        export function Init(): void {
            if (GameRules.IsActiveGame()) {
                gameStart = true;
                myHero = EntitySystem.GetLocalHero();
                myPlayer = EntitySystem.GetLocalPlayer();
                myTeam = myHero.GetTeamNum()
            }
            if (!myHero || !myHero.IsExist() || myHero.GetUnitName() == null) {
                gameStart = false;
                return;
            }
        }
    }
}

AbuseAlly.OnUpdate = () => {
    let i = AbuseOfAlly;

    // ВНЕ ЗАВИСИМОСТИ ОТ ВКЛ/ВЫКЛ СКРИПТА, ПОЛУЧАЕМ СПИСОК ГЕРОЕВ, КОТОРЫМИ МОЖНО УПРАВЛЯТЬ
    if(i.gameStart){
        let heroes = EntitySystem.GetHeroesList();
        let IsDangerousZone = i.myHero.GetHeroesInRadius(1800, Enum.TeamType.TEAM_ENEMY)

        if(Engine.OnceAt(25)){
            let nameHero = []
            let AVC: number = 0
            let newValue: boolean = false
            for(let hero of heroes) {
                if(hero.IsSameTeam(i.myHero)){
                    if(hero.IsControllableByPlayer(i.myPlayer) && hero.GetUnitName() !== i.myHero.GetUnitName() && !hero.IsIllusion()){
                        nameHero[AVC] = hero.GetUnitName().replace('npc_dota_hero_', '')
                        i.AOAmenuListAlly[AVC] = hero
                        AVC++
                    }
                }
            }

            if(i.AOAmenu4Ally.length < AVC || i.AOAmenu4Ally.length > AVC){
                newValue = true
                i.AOAmenu4Ally = []
                i.AOAmenu4Value = []
            }

            if(i.AOAmenu4Ally.length == AVC)
                newValue = false

            if(nameHero.length >= 1){
                for(let f=0; f<nameHero.length; f++){
                    i.AOAmenu4Ally[f] = 'panorama/images/heroes/icons/npc_dota_hero_' +nameHero[f]+ '_png.vtex_c'
                }
            }

            if(i.AOAmenu4Value.length >= 1){
                for(let f=i.AOAmenu4Value.length; f<AVC; f++){
                    i.AOAmenu4Value[f] = true
                }
            }

            if(i.AOAmenu4Ally.length >= 1 && newValue){
                Menu.RemoveOption(i.AOAmenu4)
                i.AOAmenu4 = Menu.AddMultiSelect(['BaseFRFA', 'Abuse', 'Abuse Of Ally'], 'Кем управляем:', i.AOAmenu4Ally, i.AOAmenu4Value)
                i.AOAmenu4.OnChange(state => { i.AOAmenu4Value = state.newValue })
                i.AOAmenu4Value = i.AOAmenu4.GetValue();
            }
        }

    // ОСНОВНАЯ ЧАСТЬ СКРИПТА
        if(i.AOAmenuValue){

            if(IsDangerousZone.length >= 1){
                if(i.AOAmenu2Value){
                    let ActiveTeleport = i.myHero.GetItem('item_teleport', false);
                    if(ActiveTeleport && i.AOAmenu2adValue){
                        if(i.myTeam == 2){                            
                            UsedTeleported(ActiveTeleport, i.points[9])
                        }
                        else if(i.myTeam == 3){
                            UsedTeleported(ActiveTeleport, i.points[19])
                        }
                    } else {
                        
                    }
                }
            }

            if(i.AOAmenuListAlly.length >= 1){
                if(i.actions[i.AOAmenu3Value] === 'Фарм леса'){
                    if(i.ancientSpot[i.AOAmenu3adValue] === 'Фармить все'){
                        if(Engine.OnceAt(15) && i.myTeam == 2){ //ЕСЛИ ИГРОК ЗА (СВЕТ)
                            for(let x=0; x<=9; x++){
                                for(let j=0; j<i.AOAmenuListAlly.length; j++){
                                    if(i.AOAmenu4Value[j]){
                                        ConsistentOrder(i.points[x], i.AOAmenuListAlly[j], x, 3000+x*100, true)
                                    }
                                }
                            }
                        }
                        else if(Engine.OnceAt(15) && i.myTeam == 3){ //ЕСЛИ ИГРОК ЗА (ТЬМУ)
                            for(let x=10; x<=19; x++){
                                for(let j=0; j<i.AOAmenuListAlly.length; j++){
                                    if(i.AOAmenu4Value[j]){
                                        ConsistentOrder(i.points[x], i.AOAmenuListAlly[j], x, 3000+x*100, true)
                                    }
                                }
                            }
                        }
                    }
                    else if(i.ancientSpot[i.AOAmenu3adValue] === 'Не фармить древних'){
                        if(Engine.OnceAt(15) && i.myTeam == 2){
                            for(let x=0; x<=9; x++){
                                for(let j=0; j<i.AOAmenuListAlly.length; j++){
                                    if(i.AOAmenu4Value[j]){
                                        ConsistentOrder(i.points[x], i.AOAmenuListAlly[j], x, 3000+x*100, false)
                                    }
                                }
                            }
                        }
                        else if(Engine.OnceAt(15) && i.myTeam == 3){
                            for(let x=10; x<=19; x++){
                                for(let j=0; j<i.AOAmenuListAlly.length; j++){
                                    if(i.AOAmenu4Value[j]){
                                        ConsistentOrder(i.points[x], i.AOAmenuListAlly[j], x, 3000+x*100, false)
                                    }
                                }
                            }
                        }
                    }
                }
                else if(i.actions[i.AOAmenu3Value] === 'Пуш лайна'){
                    if(Engine.OnceAt(15) && i.myTeam == 2){
                        for(let x=20; x<=22; x++){
                            for(let j=0; j<i.AOAmenuListAlly.length; j++){
                                if(i.AOAmenu4Value[j]){
                                    ConsistentOrderLine(i.points[x], i.AOAmenuListAlly[j], x, 3000+x*100)
                                }
                            }
                        }
                    }
                    else if(Engine.OnceAt(15) && i.myTeam == 3){
                        for(let x=23; x<=25; x++){
                            for(let j=0; j<i.AOAmenuListAlly.length; j++){
                                if(i.AOAmenu4Value[j]){
                                    ConsistentOrderLine(i.points[x], i.AOAmenuListAlly[j], x, 3000+x*100)
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

AbuseAlly.OnGameEnd = () => {
    let i = AbuseOfAlly
    i.gameStart = false;
    if(i.gameStart)
        return
    for(let j=0; j<i.AOAmenu4Ally.length; j++){
        i.AOAmenu4Ally[j] = ''
        i.AOAmenu4Value[j] = false
    }
};

AbuseAlly.OnScriptLoad = AbuseAlly.OnGameStart = AbuseOfAlly.Load.Init;

//Отправка ордеров(FIXED Задержка в управлении основным героем)
function ConsistentOrder(POINTS: Vector, HERO: Hero, NUM: number, Value: number, FarmAll: boolean){
    let i = AbuseOfAlly
    setTimeout(() => {
        if(i.myTeam == 2){
            if(NUM == 8 && FarmAll)
                EntitySystem.GetLocalPlayer().PrepareUnitOrders(Enum.UnitOrder.DOTA_UNIT_ORDER_ATTACK_MOVE, null, POINTS, null, Enum.PlayerOrderIssuer.DOTA_ORDER_ISSUER_PASSED_UNIT_ONLY, HERO, true);
            
            if(NUM != 8)
                EntitySystem.GetLocalPlayer().PrepareUnitOrders(Enum.UnitOrder.DOTA_UNIT_ORDER_ATTACK_MOVE, null, POINTS, null, Enum.PlayerOrderIssuer.DOTA_ORDER_ISSUER_PASSED_UNIT_ONLY, HERO, true);
        }
        else if(i.myTeam == 3){
            if(NUM == 18 && FarmAll)
                EntitySystem.GetLocalPlayer().PrepareUnitOrders(Enum.UnitOrder.DOTA_UNIT_ORDER_ATTACK_MOVE, null, POINTS, null, Enum.PlayerOrderIssuer.DOTA_ORDER_ISSUER_PASSED_UNIT_ONLY, HERO, true);
                
            if(NUM != 18)
                EntitySystem.GetLocalPlayer().PrepareUnitOrders(Enum.UnitOrder.DOTA_UNIT_ORDER_ATTACK_MOVE, null, POINTS, null, Enum.PlayerOrderIssuer.DOTA_ORDER_ISSUER_PASSED_UNIT_ONLY, HERO, true);
        }
    }, Value)
}

function ConsistentOrderLine(POINTS: Vector, HERO: Hero, NUM: number, Value: number){
    let i = AbuseOfAlly
    setTimeout(() => {
        if(i.myTeam == 2){
            if(NUM => 20 && NUM <= 22){
                EntitySystem.GetLocalPlayer().PrepareUnitOrders(Enum.UnitOrder.DOTA_UNIT_ORDER_ATTACK_MOVE, null, POINTS, null, Enum.PlayerOrderIssuer.DOTA_ORDER_ISSUER_PASSED_UNIT_ONLY, HERO, true); 
            }
        }
        else if(i.myTeam == 3){
            if(NUM => 23 && NUM <= 25){
                EntitySystem.GetLocalPlayer().PrepareUnitOrders(Enum.UnitOrder.DOTA_UNIT_ORDER_ATTACK_MOVE, null, POINTS, null, Enum.PlayerOrderIssuer.DOTA_ORDER_ISSUER_PASSED_UNIT_ONLY, HERO, true); 
            }
        }
    }, Value)
}

function UsedTeleported(TP, fountain){
    TP.CastPosition(fountain)
}

RegisterScript(AbuseAlly);