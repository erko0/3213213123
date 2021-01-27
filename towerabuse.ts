let TowerAbuse: ScriptDescription = {};

namespace TowerOfAbuse {
    export let gameStart: boolean = false //Началась игра?
    export let myHero: Hero //Герой игрока
    export let myPlayer: Player //Сам игрок
    export let TA1Value: boolean = false
    export let Team: number = 0 //Команда игрка [2-Свет /// 3-Тьма]
    export let towerList = [new Vector(-6256, 1816, 128), new Vector(-1544, -1408, 128), new Vector(4924, -6128, 128), //[0-2] - свет, ТОП-МИД-НИЗ
                            new Vector(-4672, 6016, 128), '523.969, 651.969, 128', new Vector(6259, -1728, 128)]//[3-5] - тьма, ТОП-МИД-НИЗ

    let TA1menu = Menu.AddToggle(['DevM', 'Abuse', 'TowerAbuse'], 'Статус работы', false)
    TA1menu.OnChange(state => { TA1Value = state.newValue; })
    TA1Value = TA1menu.GetValue();
    TA1menu.SetTip('Авто-Глиф для башни')
    Menu.SetImage(['DevM', 'Abuse'], "~/menu/20x20/abuse.png")

    export namespace Load {
        export function Init(): void {
            if (GameRules.IsActiveGame()) {
                gameStart = true;
                myHero = EntitySystem.GetLocalHero();
                myPlayer = EntitySystem.GetLocalPlayer();
                Team = myHero.GetTeamNum()
            }
            if (!myHero || !myHero.IsExist() || myHero.GetUnitName() == null) {
                gameStart = false;
                return;
            }
        }
    }
}

TowerAbuse.OnUpdate = () => {
    let i = TowerOfAbuse
        let entities = EntitySystem.GetNPCsList();
        for (let ent of entities) {
            if (ent.IsTower() && 25 >= ent.GetHealth()/ent.GetMaxHealth()*100 && ent.IsExist()){

                if(ent.GetAbsOrigin() == i.towerList[4])
                    console.log('4')

                //MiniMap.Ping(ent.GetAbsOrigin(), Enum.PingType.NORMAL, false)
                //TowerOfAbuse.myPlayer.PrepareUnitOrders(Enum.UnitOrder.DOTA_UNIT_ORDER_GLYPH, null, null, null, Enum.PlayerOrderIssuer.DOTA_ORDER_ISSUER_HERO_ONLY, null, false);
            }
        }
}

TowerAbuse.OnGameEnd = () => {
    TowerOfAbuse.gameStart = false;
};

TowerAbuse.OnScriptLoad = TowerAbuse.OnGameStart = TowerOfAbuse.Load.Init;

RegisterScript(TowerAbuse);