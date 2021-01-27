let getmoreinformation: ScriptDescription = {};

namespace getmoreinformationMain {
    export let gameStart: boolean = false;
    export let myHero: Hero;
    export let myPlayer: Player;
    export let menustatusMAIN: boolean = false;
    export let menustatusTHR: boolean = false;
    export let menustatusTHR_2: boolean = true;
    export let menusecN: number = 60; //Кд для оповещения[Варды]

    //Состояние[Вкл/Выкл]
    let menuMAIN = Menu.AddToggle(['BaseFRFA', 'Communication', 'GetMoreInfo'], 'Включить', false)
    Menu.GetFolder(['BaseFRFA', 'Communication', 'GetMoreInfo']).SetTip('Version 1.1.6')
    menuMAIN.SetTip('Информирует союзников о том, о чём иногда лень писать/пинговать\nНа данный момент информирует:\n[-] Местоположение вражеских вардов')
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
    export let menuSEC = Menu.AddSlider(['BaseFRFA', 'Communication', 'GetMoreInfo'], 'Частота оповещений[сек] (О вражеских вардах)', 5, 120, 60, 5)

    let menuTHR = Menu.AddToggle(['BaseFRFA', 'Communication', 'GetMoreInfo', 'Отрисовка радиуса'], 'Включить', false)
    menuTHR.SetTip('Включает/Выключает отрисовку радиуса вражеского варда на мини-карте')
    menuTHR.OnChange(state => {
        menustatusTHR = state.newValue;
    })
    menuTHR.GetValue();

    let menuTHR_2 = Menu.AddToggle(['BaseFRFA', 'Communication', 'GetMoreInfo', 'Отрисовка радиуса'], 'Видят-ли союзники?', true)
    menuTHR_2.OnChange(state => {
        menustatusTHR_2 = state.newValue;
    })
    menuTHR_2.GetValue();

    //Началась игра или нет
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

//Делаем что-то каждый тик
getmoreinformation.OnUpdate = () => {
    let i = getmoreinformationMain
    let aaa = 0

    if(i.menustatusMAIN && getmoreinformationMain.gameStart){//Если [Communication] включён
        if (Engine.OnceAt(0.33)) {//Обновляем данные из ползунка o_O
            i.menusecN = i.menuSEC.GetValue();
        }

        if(Engine.OnceAt(i.menusecN)){//Пингуем [Варды]
            for (let wardInfo of GetGlobal().WardTracker.GetWardList())
            {
              if(wardInfo.type == 0){//Проверка на обсерв
              MiniMap.Ping(wardInfo.position, Enum.PingType.ENEMY_VISION, false);
              aaa = 1;
              }
            }
            if(aaa == 1){Chat.SendChatWheel(`Тут стоят вражеские варды`);}
        }

        if(i.menustatusTHR){
            if(i.menustatusTHR_2){
                if(Engine.OnceAt(2)){
                    for (let wardInfo2 of GetGlobal().WardTracker.GetWardList())
                    {
                      if(wardInfo2.type == 0){//Проверка на обсерв
                            DrawCircleMinimap(wardInfo2.position, 1600, 20, false);
                      }
                    }
                }
            } else {
                if(Engine.OnceAt(2)){
                    for (let wardInfo3 of GetGlobal().WardTracker.GetWardList())
                    {
                      if(wardInfo3.type == 0){//Проверка на обсерв
                            DrawCircleMinimap(wardInfo3.position, 1600, 20, true);
                      }
                    }
                }
            }   
        }
    }
}

//Функции
function DrawCircleMinimap(position, radius, sidesCount, clientSide) {
    let pos = position;
    let angle = 360 / sidesCount;
    let posL = position.add(new Vector(0, radius, 0));
    for (let i = 0; i <= 360 / angle; i++) {
      let posVec = position.add(new Vector(0, radius, 0).Rotated(angle * i));
      MiniMap.DrawLine(posL, posVec, clientSide);
      pos = posVec;
      posL = pos
    }
}

//Игра окончена
getmoreinformation.OnGameEnd = () => {
    getmoreinformationMain.gameStart = false;
};

//Лоад скрипта
getmoreinformation.OnScriptLoad = getmoreinformation.OnGameStart = getmoreinformationMain.Load.Init;

//Регистрация
RegisterScript(getmoreinformation);