let KillSound: ScriptDescription = {};

namespace KillOfSound {
    export let gameStart: boolean = false //Началась игра?
    export let myHero: Hero //Герой игрока
    export let myPlayer: Player //Сам игрок
    export let exampleValue: boolean = false
    export let Team: number = 0 //Команда игрка [2-Свет /// 3-Тьма]
    export let RegisterFireEvent: any = ("entity_killed");
    export let EnemyList: string[] = [];

    let example = Menu.AddToggle(['DevM', 'Information', 'KillSound'], 'Статус работы', false)
    Menu.SetImage(['DevM', 'Information'], "~/menu/20x20/info.png")
    example.OnChange(state => { exampleValue = state.newValue; })
    exampleValue = example.GetValue();
    example.SetTip('Включая данный скрипт, при каждом убийстве вы будете слышать звук')

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

KillSound.OnUpdate = () => {
    let i = KillOfSound
    let heroes = EntitySystem.GetHeroesList();

    if (Engine.OnceAt(15)) {
        let AVC: number = 0
        for (let hero of heroes) {
            if (!hero.IsSameTeam(i.myHero)) {
            i.EnemyList[AVC] = hero.GetUnitName()
            AVC++
            }
        }
    }
}
    
KillSound.OnFireEvent = (event) => {
    let i = KillOfSound

    if (event.name === 'entity_killed') {
        let EnemyKilled = EntitySystem.GetByIndex(event.GetInt('entindex_killed')).GetEntityName();
        for (let j = 0; j < i.EnemyList.length; j++) {
            if (EnemyKilled === i.EnemyList[j]) {
                 // @ts-ignore
                 Audio.PlaySound('ui\\anime.vsnd_c', 0.1)
              }
         }
     }
}

    RegisterScript(KillSound);