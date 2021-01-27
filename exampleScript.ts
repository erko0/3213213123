let runeOfAmplification: ScriptDescription = {};

namespace RuneOfAmplification {
    export let gameStart: boolean = false;
    export let myHero: Hero;
    export let myPlayer: Player;
    export let FunctionStatus: boolean = false;

    //Вектора верхней и нижний руны усиления
    let runeTop = new Vector(-1640, 984, 176);
    // let runeBot = new Vector(1180, 1248, 192);
    
    //Пункты в меню
    export let runeVisionMenuStatus = Menu.AddToggle(['Information', 'RuneVision'], 'Статус работы', false)
        
    //Таймер для сообщения в чате
    export let runeVisionMenuTimer = Menu.AddSlider(['Information', 'RuneVision'], 'Оповещение каждые ... сек', 1, 10, 5, 1)
    export let timer = runeVisionMenuTimer.GetValue();
    
    //Описания пунктов меню
    runeVisionMenuTimer.SetTip('Через сколько секунд будет появлятся повтороное сообщение об руне\n(Изменения вступают через 1 секунду)')
    runeVisionMenuStatus.SetTip('После как в поле зрения вашей команды появляется любая руна усиления(хоть на 0.000001с)\nвы сразу получите всю информацию о ней.\nЕсли вы не подбирали руну и не прошло 2 минуты после её спавна,\nто скорее всего её взяли противники')

    //Проверка состояния кнопки
    runeVisionMenuStatus.OnChange(state => {
        FunctionStatus = state.newValue;
    })
    runeVisionMenuStatus.GetValue();

    //Названия рун
    let runesName = ['[NotInf]', 'Двойной Урон', 'Ускорение', 'Иллюзии', 'Невидимость', 'Регенерация', 'Баунти', 'Волшебство'];

    //Обнаружение (Спасибо Madaspe)
    export function detect() {
        for (let i of EntitySystem.GetRunesList()) {
            let posRune = i.GetAbsOrigin();
            if (i.GetRuneType() !== Enum.RuneType.DOTA_RUNE_BOUNTY) {
                if (runeTop.Distance(posRune) < 100) {
                    Chat.Print('ConsoleChat', 'Обнаружена руна усиления: <font color="#7B68EE">Сверху(top)</font>' + "  " + '<font color="#FF8C00" >' + " " + runesName[i.GetRuneType().valueOf() + 1])
                } else {
                    Chat.Print('ConsoleChat', 'Обнаружена руна усиления: <font color="#7B68EE">Снизу(bot)</font>' + "  " + '<font color="#FF8C00" >' + " " + runesName[i.GetRuneType().valueOf() + 1])
                }
            }
        }
    }

    //Проверка активная игра или нет (Спасибо Madaspe)
    export namespace Load {
        export function Init(): void {
            if (GameRules.IsActiveGame()) {
                gameStart = true;
                myHero = EntitySystem.GetLocalHero();
                myPlayer = EntitySystem.GetLocalPlayer();
            }
            if (
                !myHero ||
                !myHero.IsExist() ||
                myHero.GetUnitName() == null
            ) {
                gameStart = false;
                return;
            }
        }
    }
}

runeOfAmplification.OnUpdate = () => {
    //Каждую секунду проверяем значение runeVisionMenuTimer
    if(Engine.OnceAt(1))
    RuneOfAmplification.timer = RuneOfAmplification.runeVisionMenuTimer.GetValue();

    //Если игра активна и RuneVision = Вкл
    if (RuneOfAmplification.gameStart && RuneOfAmplification.FunctionStatus){
        //Каждые N секунд, получаем информацию об рунах усилений (N - runeVisionMenuTimer)
            if (Engine.OnceAt(RuneOfAmplification.timer)) {
                RuneOfAmplification.detect();
            } 
        }
};

//Когда матч закончился, говорит что игра не активна
runeOfAmplification.OnGameEnd = () => {
    RuneOfAmplification.gameStart = false;
};

runeOfAmplification.OnScriptLoad = runeOfAmplification.OnGameStart = RuneOfAmplification.Load.Init;

RegisterScript(runeOfAmplification);