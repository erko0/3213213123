let antiAntiMage: ScriptDescription = {};

namespace AntiMageAnti {
    export let gameStart: boolean = false; //Началась игра?
    export let antiMageFunStat: boolean = false;
    export let antiMagePTVamValue: boolean = true;
    export let limhpVal: number = 750;
    export let myHero: Hero; //Герой игрока
    export let ultAM: Ability;
    export let myPlayer: Player; //Игрок
    export let damageUlt = [0.0, 0.8, 0.95, 1.1]
    export let itemMana = [
        'item_magic_stick',
        'item_magic_wand',
        'item_arcane_ring',
        'item_enchanted_mango',
        'item_soul_ring',
        'item_arcane_boots',
        'item_guardian_greaves'
    ];
    export let itemManaBool: boolean[] = [true, true, true, true, true, true, true];
    export let itemManaImage = [
        'panorama/images/items/magic_stick_png.vtex_c',
        'panorama/images/items/magic_wand_png.vtex_c',
        'panorama/images/items/arcane_ring_png.vtex_c',
        'panorama/images/items/enchanted_mango_png.vtex_c',
        'panorama/images/items/soul_ring_png.vtex_c',
        'panorama/images/items/arcane_boots_png.vtex_c',
        'panorama/images/items/guardian_greaves_png.vtex_c'
    ];
    export let AntiMageAntiMenuStatus = Menu.AddToggle(['BaseFRFA', 'Safeguard', 'Anti-AntiMage'], 'Статус работы', false);
    Menu.SetImage(['BaseFRFA', 'Safeguard'], "~/menu/20x20/safeguard.png")
    AntiMageAntiMenuStatus.SetTip('Данный скрипт будет использовать все возможные расходники для пополнения маны, чтобы вы как меньше получили урона от ManaVoid\nТак же будут изменяться состояния PT&Vambrace');
    AntiMageAntiMenuStatus.OnChange(state => {
        antiMageFunStat = state.newValue;
    })
    antiMageFunStat = AntiMageAntiMenuStatus.GetValue();

    Menu.GetFolder(['BaseFRFA', 'Safeguard', 'Anti-AntiMage']).SetTip('version 1.0.0');

    export let LimitHP = Menu.AddSlider(['BaseFRFA', 'Safeguard', 'Anti-AntiMage'], `Работаем если останется <N(hp)`, 350, 3000, 750, 50)
    LimitHP.SetTip('Если вы выставили значение(к примеру) 550,\nто если антимаг ультанёт в вас и у вас останется меньше 550хп, то скрипт сработает') // TODO: Переписать описание(Более понятнее)
    LimitHP.OnChange(state => {
        limhpVal = state.newValue;
    })
    limhpVal = LimitHP.GetValue();

    export let AntiMageAntiMenuItems = Menu.AddMultiSelect(['BaseFRFA', 'Safeguard', 'Anti-AntiMage'], 'Предметы', itemManaImage, itemManaBool)
    AntiMageAntiMenuItems.OnChange(state => {
        itemManaBool = state.newValue;
    })
    itemManaBool = AntiMageAntiMenuItems.GetValue();

    export let AntiMageAntiMenuPT_Vambrace = Menu.AddToggle(['BaseFRFA', 'Safeguard', 'Anti-AntiMage', 'Переключать PT&Vambrace'], 'Включить', true);
    Menu.SetImage(['BaseFRFA', 'Safeguard', 'Anti-AntiMage', 'Переключать PT&Vambrace'], "panorama/images/items/power_treads_png.vtex_c")
    AntiMageAntiMenuPT_Vambrace.SetTip('Переключает PT(power treads) и Vambrace на силу и после возвращает в предыдущее состояние')
    AntiMageAntiMenuPT_Vambrace.OnChange(state => {
        antiMagePTVamValue = state.newValue;
    })
    antiMagePTVamValue = AntiMageAntiMenuPT_Vambrace.GetValue();

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

antiAntiMage.OnUpdate = () => {
    let i = AntiMageAnti
    let heroes = EntitySystem.GetHeroesList();

    if(!i.gameStart)
        return

    if(Engine.OnceAt(10)){ //Каждые 10 секунд получаем список героев на карте
        for(let hero of heroes) {
            if(!hero.IsSameTeam(i.myHero) && hero.GetUnitName() === 'npc_dota_hero_antimage'){
                i.ultAM = hero.GetAbility('antimage_mana_void')
            }
        }
    }
}

antiAntiMage.OnPrepareUnitOrders = (order) => {
    let i = AntiMageAnti
    if(
        i.antiMageFunStat //Если скрипт включён
        && order.ability // Если это способонсть
        && order.ability.GetName() === 'antimage_mana_void' //Это эта способность ManaVoid
        && order.target.GetUnitName() === i.myHero.GetUnitName() //Если цель этой способности - герой игрока
    ){
        let myHP = i.myHero.GetHealth() //хп (на данный момент)
        let myMP = i.myHero.GetMana() //мана (на данный момент)
        let myMaxMP = i.myHero.GetMaxMana() //максимальный запас маны
        let FinalHP = myHP-(myMaxMP-myMP)*i.damageUlt[i.ultAM.GetLevel()]*i.myHero.GetMagicalArmorDamageMultiplier() //сколько хп останется просле применения ульты
        let PT = i.myHero.GetItem('item_power_treads', true); //Проверяем наличие PT в основных слотах
        let VR = i.myHero.GetItem('item_vambrace', false); // Проверяем наличие Vambrace в слотах

        if(FinalHP <= i.limhpVal){
            for(let k=0; k<7; k++){
                if(i.myHero.GetItem(i.itemMana[k], false)){
                    if(i.itemManaBool[k])
                        i.myHero.GetItem(i.itemMana[k], false).CastNoTarget()
                }
            }
            if(PT){
                /*
                Сила - 0
                Интеллект - 1
                Ловкость - 2
                */
                if(PT.GetPowerTreadsState() == 1){
                    PT.CastNoTarget()
                    PT.CastNoTarget()
                    returnPT_Vambrace(1, PT)
                } else if(PT.GetPowerTreadsState() == 2){
                    PT.CastNoTarget()
                    returnPT_Vambrace(2, PT)
                }
            }
            if(VR){
                if(VR.GetProperty("C_DOTA_Item_Vambrace", "m_iStat") == 1){
                    VR.CastNoTarget()
                    VR.CastNoTarget()
                    returnPT_Vambrace(1, VR)
                } else if(VR.GetProperty("C_DOTA_Item_Vambrace", "m_iStat") == 2){
                    VR.CastNoTarget()
                    returnPT_Vambrace(2, VR)
                }
            }
        }
    }   
}

antiAntiMage.OnGameEnd = () => {
    AntiMageAnti.gameStart = false;
};

antiAntiMage.OnScriptLoad = antiAntiMage.OnGameStart = AntiMageAnti.Load.Init;

//Через 1,5с возвращаем PT&Vambrace в состояние до работы скрипта
function returnPT_Vambrace(oldPT: number, Name: Item){
    setTimeout(() => {
        if(oldPT == 1){
            Name.CastNoTarget()
        }
        if(oldPT == 2){
            Name.CastNoTarget()
            Name.CastNoTarget()
        }
    }, 1500)
}

RegisterScript(antiAntiMage);