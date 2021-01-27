let AutoIceShardsTusk: ScriptDescription = {};

namespace TuskIceShards {
    export let HIndex: string = 'npc_dota_hero_tusk'
    export let gameStart: boolean = false //Началась игра?
    export let myHero: Hero //Герой игрока
    export let myPlayer: Player //Сам игрок
    export let MenuMainValue: boolean = false
    export let Team: number = 0 //Команда игрка [2-Свет /// 3-Тьма]
    export let AbilityPos: Vector

    let MenuMain = Menu.AddToggle(['BaseFRFA', 'Heroes', 'Strength', 'Tusk', 'Trick'], 'Статус работы', false)
    MenuMain.OnChange(state => { MenuMainValue = state.newValue; })
    MenuMainValue = MenuMain.GetValue();

    export let MenuKeyBind = Menu.AddKeyBind(['BaseFRFA', 'Heroes', 'Strength', 'Tusk', 'Trick'], 'Клавиша активации', Enum.ButtonCode.KEY_NONE);

    Menu.SetImage(['BaseFRFA', 'Heroes'], "~/menu/20x20/heroes.png");
    Menu.SetImage(['BaseFRFA', 'Heroes', 'Strength'], "~/menu/20x20/strength.png");
    Menu.SetImage(['BaseFRFA', 'Heroes', 'Strength', 'Tusk'], "panorama/images/heroes/icons/npc_dota_hero_tusk_png.vtex_c");

    export namespace Load {
        export function Init(): void {
            if (GameRules.IsActiveGame()){
                myHero = EntitySystem.GetLocalHero();
                myPlayer = EntitySystem.GetLocalPlayer();
                Team = myHero.GetTeamNum();

                if(myHero.GetUnitName() === HIndex)
                    gameStart = true;
            }
            if (!myHero || !myHero.IsExist() || myHero.GetUnitName() == null) {
                gameStart = false;
                return;
            }
        }
    }
}

AutoIceShardsTusk.OnUpdate = () => {
    let i = TuskIceShards

    if(i.gameStart && i.MenuMainValue){
        if(i.MenuKeyBind.IsKeyDownOnce()){
            let myPos = i.myHero.GetAbsOrigin();
            let myRot = i.myHero.GetAbsRotation();
            let iceShards = i.myHero.GetAbilityByIndex(0);
            i.AbilityPos = myPos.add(myRot.GetForward().Scaled(50));
            
            if(!iceShards.GetCooldown())
                iceShards.CastPosition(i.AbilityPos);
        }
    }
}

AutoIceShardsTusk.OnGameEnd = () => {
    TuskIceShards.gameStart = false;
};

AutoIceShardsTusk.OnScriptLoad = AutoIceShardsTusk.OnGameStart = TuskIceShards.Load.Init;

RegisterScript(AutoIceShardsTusk);