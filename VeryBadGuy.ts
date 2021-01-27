let VeryBadGuy: ScriptDescription = {};

namespace VeryBadGuyMain {
    export let gameStart: boolean = false
    export let myHero: Hero
    export let myPlayer: Player
    export let menustatusMAIN: boolean = false
    export let menustatus2: boolean = false
    export let menustatus3: boolean = false
    export let advstatus: boolean = false
    export let menu3SelectorL: number = 0
    export let time = 35
    export const drawings = ['Хаотично', 'Лайны']; //Массив с риснуками для menu3
    export const badWord = [ // Массив с сообщениями для минус морали
    'Вы школьники у которых не тянет ничего кроме доты',
    'Капец, почему мне попались такие поденки',
    'Я стал таким толстым из-за твоей мамаши, которую я каждый день жарил',
    'За такие лица, как у вас, нужно подать в суд на родителей и природу',
    '*Чих*, у меня аллергия на дешевых путан и убогих неудачников',
    'Я понимаю что ты обиженный жизнью, но сегодня не подаю мелочь',
    'Я не психиатр, но могу поставить тебе неутешительный диагноз',
    'Твоя мама не хотела тебя, а папа не старался. Или зачали на спор?',
    'Каково быть аутсайдером человеческой расы?',
    'Я бы назвал тебя скунсом, но скунс не такое вонючее животное, как ты.'
    ];

    //Состояние[Вкл/Выкл]
    let menuMAIN = Menu.AddToggle(['BaseFRFA', 'Griefing', 'BadGuy 2.0'], 'Включить', false)
    Menu.GetFolder(['BaseFRFA', 'Griefing', 'BadGuy 2.0']).SetTip('Version 1.0.0');
    menuMAIN.SetTip('Я попытался добавить функционал, которого нету в стандартном [Griefing->BadGuy]')
    menuMAIN.OnChange(state => {
        menustatusMAIN = state.newValue;
        if(menustatusMAIN){
            console.log('==========================================');
            console.log(' Спасибо за тест скрипта                      ')
            console.log(' Жду ваших предложений в своём вк: vk.com/no_frfa ')
            console.log('==========================================')
        }
    })
    menuMAIN.GetValue();

    //Сообщениями для минус морали[Вкл/Выкл (По умолчанию 'Вкл')]
    let menu2 = Menu.AddToggle(['BaseFRFA', 'Griefing', 'BadGuy 2.0'], 'Писать сообщение для минус морали?', false)
    menu2.SetTip('Пишет провоцирующие сообщения\nCообщения будут отправлятся каждые 35-60[сек]')
    menu2.OnChange(state => {
        menustatus2 = state.newValue;
    })
    menu2.GetValue();

    //Зарисовка мини-карты(различные рисунки)[Вкл/Выкл]
    let menu3 = Menu.AddToggle(['BaseFRFA', 'Griefing', 'BadGuy 2.0', 'Зарисовка мини-карты !!! UNSAFE BAN RISK !!!'], 'Включить', false)
    Menu.GetFolder(['BaseFRFA', 'Griefing', 'BadGuy 2.0', 'Зарисовка мини-карты !!! UNSAFE BAN RISK !!!']).SetTip('Будьте осторожны используя данный скрипт, так как возможно за это могут дать бан');
    menu3.SetTip('Данная функция будет довольно полезна, так как многие игроки не знают как прекратить отображение ваших "рисунков"\n[Доступно 2 рисунка]')
    menu3.OnChange(state => {
        menustatus3 = state.newValue;
    })
    menu3.GetValue();

    //Селектор для выбора 'стиля' рисования на мини-карте [По умолчанию 'Хаотично']
    export let menu3Selector = Menu.AddComboBox(
        ['BaseFRFA', 'Griefing', 'BadGuy 2.0', 'Зарисовка мини-карты !!! UNSAFE BAN RISK !!!'],
        'Как рисуем?',
        drawings,
        0
    )
    menu3Selector.OnChange(state => (menu3SelectorL = state.newValue))
    menu3Selector.GetValue();
    menu3Selector.SetTip('ОСТОРОЖНО! Может вызывать просадки FPS\n[Хаотично] - Рисует рандомные линии по всей мини-карте, тем самым закрашивая её\n[Лайны] - Закрашивает основные линии на мини-карте, так же задевает саму базу')


    export let adv = Menu.AddToggle(['BaseFRFA', 'Griefing', 'BadGuy 2.0', 'Другие настройки'], 'Информационные сообщения', true)
    adv.SetTip('Включает/Выключает информационные сообщения (Видите только вы)')
    adv.OnChange(state => {
        advstatus = state.newValue;
    })
    adv.GetValue();

    //Началась игра или нет
    export namespace Load {
        export function Init(): void {
            if (GameRules.IsActiveGame()) {
                gameStart = true;
                myHero = EntitySystem.GetLocalHero();
                myPlayer = EntitySystem.GetLocalPlayer();
                time = 35
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

//Делаем что-то каждый тик
VeryBadGuy.OnUpdate = () => {
    let i = VeryBadGuyMain
    if(i.gameStart && i.menustatusMAIN){//Если [BadGuy 2.0] включён
        if(i.menustatus2){//Если [Писать сообщение для минус морали] включён
            if(Engine.OnceAt(i.time)){
                Chat.SendChatWheel(i.badWord[getRandomNUM(0,9)])
                i.time = getRandomNUM(35, 60)
            }
        }

        if(i.menustatus3){//Если [Зарисовка мини-карты] включён
            if(i.drawings[i.menu3SelectorL] === 'Хаотично'){
                MiniMap.DrawLine(new Vector(getRandomNUM(-7000, 7000), getRandomNUM(-7000, 7000),0), new Vector(getRandomNUM(-7000, 7000), getRandomNUM(-7000, 7000),0))
            } else if (i.drawings[i.menu3SelectorL] === 'Лайны'){
                MiniMap.DrawLine(new Vector(getRandomNUM(-7600, -6300), -6130,0), new Vector(getRandomNUM(7400, 6300), 6130,0)) //мид
                    MiniMap.DrawLine(new Vector(getRandomNUM(-6800, -5700), -6500,0), new Vector(getRandomNUM(-7200, -5700), 6300,0)) //топ
                    MiniMap.DrawLine(new Vector(6800, getRandomNUM(5300, 6300),0), new Vector(getRandomNUM(-6100, -6300), getRandomNUM(5300, 6300),0)) //топ
                        MiniMap.DrawLine(new Vector(getRandomNUM(7200, 5700), 6300,0), new Vector(getRandomNUM(7200, 5300), -6500,0)) //бот
                        MiniMap.DrawLine(new Vector(-6800, getRandomNUM(-6500, -5500),0), new Vector(getRandomNUM(6100, 6300), getRandomNUM(-6500, -5500),0)) //бот
            }
        }

        if(i.advstatus){
            if(Engine.OnceAt(300)){
                Chat.Print('ConsoleChat', `<font color="#4682B4">Вы можете оставить отзыв/предложение/замечание мне в</font>`);
                Chat.Print('ConsoleChat', `<font color="#4682B4">Вк: vk.com/no_frfa:</font>`);
                Chat.Print('ConsoleChat', `<font color="#4682B4">Discord: KaToh#2120</font>`);
            }
        }
    }
}

//Скрипт загружен
VeryBadGuy.OnGameEnd = () => {
    VeryBadGuyMain.gameStart = false;
};

//Загрузился скрипт
VeryBadGuy.OnScriptLoad = VeryBadGuy.OnGameStart = VeryBadGuyMain.Load.Init;

//Хаотичное рисование
function getRandomNUM(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

//Регистрация
RegisterScript(VeryBadGuy);