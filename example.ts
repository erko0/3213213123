let example: ScriptDescription = {};

namespace Example {
    export let gameStart: boolean = false //Началась игра?
    export let myHero: Hero //Герой игрока
    export let myPlayer: Player //Сам игрок
    export let exampleValue: boolean = false
    export let Team: number = 0 //Команда игрка [2-Свет /// 3-Тьма]


    let example = Menu.AddToggle(['exam1', 'exam2', 'exam3'], 'Статус работы', false)
    example.OnChange(state => { exampleValue = state.newValue; })
    exampleValue = example.GetValue();
    example.SetTip('Пример описания')

    /*
    Menu.SetImage(['exam1'], "~/menu/40x40/heroes.png")
    Menu.SetImage(['exam1', 'exam2'], "~/menu/40x40/agillity.png")
    */

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

//example.OnDraw = () => { РАБОТАЕТ КАЖДЫЙ КАДР. НЕ ДЕЛАТЬ СЛОЖНУЮ ЛОГИКУ. ONLY ОТРИСОВКА ГРАФИКИ }

example.OnUpdate = () => { 
    console.log('СОЗДАНА ДЛЯ СЛОЖНОЙ ЛОГИКИ. НЕ РЕКОМЕНДУЮ ОТРИСОВЫВАТЬ ГРАФИКУ') //Отправляется каждый тик
}

example.OnGameEnd = () => {
    Example.gameStart = false;
};

example.OnScriptLoad = example.OnGameStart = Example.Load.Init;

RegisterScript(example);