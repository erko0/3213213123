let arcWardenMoreDefenceBase: ScriptDescription = {};

namespace ArcWardenMoreDefenceBase {
    export let HERO_INDEX = 'npc_dota_hero_arc_warden'
    export let gameStart: boolean = false
    export let ParticleIsCreate: boolean = false
    export let ArcWardenMoreBaseDef: boolean = false
    export let ArcWardenMoreBaseDefSpamSpark: boolean = false
    export let bindStatus: boolean = false
    export let bindStatusThrone: boolean = false
    export let FieldMap: boolean = false
    export let MagneticDetect: boolean = false
    export let FieldMapThrone: boolean = false
    export let MagneticDetectThrone: boolean = false
    export let myHero: Hero
    export let myPlayer: Player
    export let T3MidVector: Vector
    export let T3TopVector: Vector
    export let T3BotVector: Vector
    export let ThroneVector: Vector
    export let FieldTime: number
    export let FieldDuration: number
    export let FieldTimeThrone: number
    export let FieldDurationThrone: number
    export let BetaSpamSpark: number
    export let myClone = null
    export let font = Renderer.LoadFont('Arial', 15, Enum.FontWeight.BOLD)

    // [code: MSC] - Функция дефа
    // [code: SS] - спам спарков
    // [code: DT] - Деф трона

    export const sides = ['T3 - Mid', 'T3 - Top', 'T3 - Bot']

    let ArcWardenMoreBaseDefStatus = Menu.AddToggle(['More', 'Heroes', 'Agility', 'Arc Warden', 'BaseDef'], 'Статус', false)
    export let keybindHandle = Menu.AddKeyBind(['More', 'Heroes', 'Agility', 'Arc Warden', 'BaseDef'], 'Кнопка активации', Enum.ButtonCode.KEY_NONE)
    export let ArcWardenMoreBaseDefCombo = Menu.AddComboBox(['More', 'Heroes', 'Agility', 'Arc Warden', 'BaseDef'], 'Башня для защиты', sides, 0)
    .OnChange(state => (ArcWardenMoreBaseDefCombo = state.newValue))
    .GetValue();
    let ArcWardenMoreBaseDefSSpark = Menu.AddToggle(['More', 'Heroes', 'Agility', 'Arc Warden', 'BaseDef', 'Spark'], 'SpamSpark', false)
    export let keybindHandleThrone = Menu.AddKeyBind(['More', 'Heroes', 'Agility', 'Arc Warden', 'BaseDef', 'ThroneDef'], 'Защита трона', Enum.ButtonCode.KEY_NONE)

    ArcWardenMoreBaseDefStatus.SetTip('Использует ну очень странные (но рабочие) места для MagneticField, дабы защитить вашу T3вышку')
    ArcWardenMoreBaseDefSSpark.SetTip('Ставит Spark Wraith в центр купола\nПолезно если вы не хотите чтобы враги зашли в MagneticField')
    keybindHandleThrone.SetTip('В центр трона ставится MagneticField\nТем самым мы получаем бессметрный трон\nНе ставить одну и ту же кнопку с активацией BaseDef\n(Не включать если уже используете BaseDef)')
    keybindHandle.SetTip('(Нажать 1 раз для активации)\nСкрипт начинает использовать MagneticField на `читерные` места\n(Не включать если уже используете BaseDef)')

    ArcWardenMoreBaseDefStatus.OnChange(state => {
        ArcWardenMoreBaseDef = state.newValue;
        bindStatus = false
        FieldMap = false
        MagneticDetect = false
    })
    ArcWardenMoreBaseDefStatus.GetValue();

    ArcWardenMoreBaseDefSSpark.OnChange(state => {
        ArcWardenMoreBaseDefSpamSpark = state.newValue;
        BetaSpamSpark = 0
    })
    ArcWardenMoreBaseDefSSpark.GetValue();

    Menu.SetImage(['More', 'Heroes'], "~/menu/40x40/heroes.png")
    Menu.SetImage(['More', 'Heroes', 'Agility'], "~/menu/40x40/agillity.png")
    Menu.SetImage(['More', 'Heroes', 'Agility', 'Arc Warden'], "panorama/images/heroes/icons/npc_dota_hero_arc_warden_png.vtex_c")
    Menu.SetOrdering(['More', 'Heroes', 'Agility', 'Arc Warden', 'BaseDef'], 1)

    export namespace Load {
        export function Init(): void {
            if (GameRules.IsActiveGame()) {
                gameStart = true;
                    myHero = EntitySystem.GetLocalHero()
                        myPlayer = EntitySystem.GetLocalPlayer()
                        setTimeout(() => {
                            if (myHero.GetTeamNum() === 2) {
                                T3MidVector = new Vector(-4951, -4434, 384)
                                T3TopVector = new Vector(-6595, -3844, 384)
                                T3BotVector = new Vector(-4386, -6086, 384)
                                ThroneVector = new Vector(-5845, 5367, 384)
                            } else {
                                T3MidVector = new Vector(4547, 4103, 384)
                                T3TopVector = new Vector(3990, 5790, 384)
                                T3BotVector = new Vector(6323, 3468, 384)
                                ThroneVector = new Vector(5529, 4992, 384)
                            }
                        }, 500)
            }
            if (!myHero || !myHero.IsExist() || myHero.GetUnitName() !== HERO_INDEX) {
                gameStart = false;
                return;
            }
        }
    }
}

/*arcWardenMoreDefenceBase.OnDraw = () => {
    if(ArcWardenMoreDefenceBase.gameStart && ArcWardenMoreDefenceBase.ArcWardenMoreBaseDef){
    let [x, y, isOnScreen] = Renderer.WorldToScreen(ArcWardenMoreDefenceBase.myHero.GetAbsOrigin().add(new Vector(0, 0, ArcWardenMoreDefenceBase.myHero.GetHealthBarOffset())));
        if(!isOnScreen){
            return
        }

        Renderer.SetDrawColor(255, 255, 255, 255);

        if(ArcWardenMoreDefenceBase.bindStatus){
            Renderer.DrawTextCentered(ArcWardenMoreDefenceBase.font, x, y-60, `[Defence base] ${ArcWardenMoreDefenceBase.sides[ArcWardenMoreDefenceBase.ArcWardenMoreBaseDefCombo]}`)
            if(ArcWardenMoreDefenceBase.ArcWardenMoreBaseDefSpamSpark){
                Renderer.DrawTextCentered(ArcWardenMoreDefenceBase.font, x, y-50, `+SpamSpark`)
            }
        }

        if(ArcWardenMoreDefenceBase.bindStatusThrone){
            Renderer.DrawTextCentered(ArcWardenMoreDefenceBase.font, x, y-70, `[Defence Throne]`)
        }
    }
}*/

arcWardenMoreDefenceBase.OnUpdate = () => {
    let i = ArcWardenMoreDefenceBase
    if(i.gameStart && i.ArcWardenMoreBaseDef){
        if(Menu.IsKeyDownOnce(i.keybindHandle)){
            if(i.bindStatus){
                i.bindStatus = false
                i.BetaSpamSpark = 0
            }
            else i.bindStatus = true
        }else if(Menu.IsKeyDownOnce(i.keybindHandleThrone)){
            if(i.bindStatusThrone){
                i.bindStatusThrone = false
            }
            else i.bindStatusThrone = true
        }
    }

        // Функция дефа (Магнетик, спарки(если вкл), клон) [code: MSC]
        if(i.gameStart && i.ArcWardenMoreBaseDef && i.bindStatus && !i.bindStatusThrone){
            if(i.sides[i.ArcWardenMoreBaseDefCombo] === 'T3 - Mid'){
                let magneticfieldspell = i.myHero.GetAbilityByIndex(1)
                let createclone = i.myHero.GetAbility('arc_warden_tempest_double')
                let leftTime: number
                if(!i.FieldMap) {
                    if(!magneticfieldspell.GetCooldown()){
                        if(i.myHero.GetMana() > magneticfieldspell.GetManaCost()){
                            magneticfieldspell.CastPosition(i.T3MidVector)
                            setTimeout(() => {
                                if(!i.MagneticDetect){
                                    return
                                } else {
                                    i.FieldDuration = magneticfieldspell.GetLevelSpecialValueForFloat("duration");
                                        i.FieldTime = GameRules.GetGameTime()
                                            i.FieldMap = true
                                            i.MagneticDetect = false
                                            if(i.ArcWardenMoreBaseDefSpamSpark)
                                                i.BetaSpamSpark = 1
                                    }
                            }, 100)
                        }
                    }
                } else {
                    if(i.myClone){
                        leftTime = GameRules.GetGameTime()-(i.FieldTime-0.3) //Клон уже призван, убираем задержку призыва клона
                    } else leftTime = GameRules.GetGameTime()-(i.FieldTime-0.65-0.3) //Клона нет, добавляем задержку на его появление

                    if(leftTime > i.FieldDuration) {
                        if(i.myClone === null){
                            createclone.CastNoTarget()
                            setTimeout(() => {
                                let clone = i.myClone.GetAbilityByIndex(1)
                                    clone.CastPosition(i.T3MidVector)
                            }, 500);
                            i.FieldMap = false
                        } else {
                            let Clonemagneticfieldspell = i.myClone.GetAbilityByIndex(1)
                            if(!Clonemagneticfieldspell.GetCooldown()){
                                if(i.myClone.GetMana() > Clonemagneticfieldspell.GetManaCost()){
                                    Clonemagneticfieldspell.CastPosition(i.T3MidVector)
                                    setTimeout(() => {
                                        if(!i.MagneticDetect){
                                            return
                                        } else {
                                            i.FieldDuration = Clonemagneticfieldspell.GetLevelSpecialValueForFloat("duration");
                                                i.FieldTime = GameRules.GetGameTime()
                                                    i.FieldMap = false
                                                    i.MagneticDetect = false
                                        }
                                }, 100)
                            }
                        }
                    }
                }
            }
        }

        
            if(i.sides[i.ArcWardenMoreBaseDefCombo] === 'T3 - Top'){
                let magneticfieldspell = i.myHero.GetAbilityByIndex(1)
                let createclone = i.myHero.GetAbility('arc_warden_tempest_double')
                let leftTime: number
                if(!i.FieldMap) {
                    if(!magneticfieldspell.GetCooldown()){
                        if(i.myHero.GetMana() > magneticfieldspell.GetManaCost()){
                            magneticfieldspell.CastPosition(i.T3TopVector)
                            setTimeout(() => {
                                if(!i.MagneticDetect){
                                    return
                                } else {
                                    i.FieldDuration = magneticfieldspell.GetLevelSpecialValueForFloat("duration");
                                        i.FieldTime = GameRules.GetGameTime()
                                            i.FieldMap = true
                                            i.MagneticDetect = false
                                            if(i.ArcWardenMoreBaseDefSpamSpark)
                                                i.BetaSpamSpark = 2
                                    }
                            }, 100)
                        }
                    }
                } else {
                    if(i.myClone){
                        leftTime = GameRules.GetGameTime()-(i.FieldTime-0.3) //Клон уже призван, убираем задержку призыва клона
                    } else leftTime = GameRules.GetGameTime()-(i.FieldTime-0.65-0.3) //Клона нет, добавляем задержку на его появление

                    if(leftTime > i.FieldDuration) {
                        if(i.myClone === null){
                            createclone.CastNoTarget()
                            setTimeout(() => {
                                let clone = i.myClone.GetAbilityByIndex(1)
                                    clone.CastPosition(i.T3TopVector)
                            }, 500);
                            i.FieldMap = false
                        } else {
                            let Clonemagneticfieldspell = i.myClone.GetAbilityByIndex(1)
                            if(!Clonemagneticfieldspell.GetCooldown()){
                                if(i.myClone.GetMana() > Clonemagneticfieldspell.GetManaCost()){
                                    Clonemagneticfieldspell.CastPosition(i.T3TopVector)
                                    setTimeout(() => {
                                        if(!i.MagneticDetect){
                                            return
                                        } else {
                                            i.FieldDuration = Clonemagneticfieldspell.GetLevelSpecialValueForFloat("duration");
                                                i.FieldTime = GameRules.GetGameTime()
                                                    i.FieldMap = false
                                                    i.MagneticDetect = false
                                        }
                                }, 100)
                            }
                        }
                    }
                }
            }
        }

            if(i.sides[i.ArcWardenMoreBaseDefCombo] === 'T3 - Bot'){
                let magneticfieldspell = i.myHero.GetAbilityByIndex(1)
                let createclone = i.myHero.GetAbility('arc_warden_tempest_double')
                let leftTime: number
                if(!i.FieldMap){
                    if(!magneticfieldspell.GetCooldown()){
                        if(i.myHero.GetMana() > magneticfieldspell.GetManaCost()){
                            magneticfieldspell.CastPosition(i.T3BotVector)
                            setTimeout(() => {
                                if(!i.MagneticDetect){
                                    return
                                } else {
                                    i.FieldDuration = magneticfieldspell.GetLevelSpecialValueForFloat("duration");
                                        i.FieldTime = GameRules.GetGameTime()
                                            i.FieldMap = true
                                            i.MagneticDetect = false
                                            if(i.ArcWardenMoreBaseDefSpamSpark)
                                                i.BetaSpamSpark = 3
                                    }
                            }, 100)
                        }
                    }
                } else {
                    if(i.myClone){
                        leftTime = GameRules.GetGameTime()-(i.FieldTime-0.3) //Клон уже призван, убираем задержку призыва клона
                    } else leftTime = GameRules.GetGameTime()-(i.FieldTime-0.65-0.3) //Клона нет, добавляем задержку на его появление

                    if(leftTime > i.FieldDuration) {
                        if(i.myClone === null){
                            createclone.CastNoTarget()
                            setTimeout(() => {
                                let clone = i.myClone.GetAbilityByIndex(1)
                                    clone.CastPosition(i.T3BotVector)
                            }, 500);
                            i.FieldMap = false
                        } else {
                            let Clonemagneticfieldspell = i.myClone.GetAbilityByIndex(1)
                            if(!Clonemagneticfieldspell.GetCooldown()){
                                if(i.myClone.GetMana() > Clonemagneticfieldspell.GetManaCost()){
                                    Clonemagneticfieldspell.CastPosition(i.T3BotVector)
                                    setTimeout(() => {
                                        if(!i.MagneticDetect){
                                            return
                                        } else {
                                            i.FieldDuration = Clonemagneticfieldspell.GetLevelSpecialValueForFloat("duration");
                                                i.FieldTime = GameRules.GetGameTime()
                                                    i.FieldMap = false
                                                    i.MagneticDetect = false
                                        }
                                }, 100)
                            }
                        }
                    }
                }
            }
        }
    }

    // Спам Спарков [code: SS]
    if(i.ArcWardenMoreBaseDefSpamSpark && i.bindStatus && !i.bindStatusThrone){
        if(i.BetaSpamSpark === 1){
            let spark = i.myHero.GetAbilityByIndex(2)
            if(!spark.GetCooldown()){
                if(i.myHero.GetMana() > spark.GetManaCost()){
                    spark.CastPosition(i.T3MidVector)
                }
            }

            if(i.myClone !== null){
                setTimeout(() => {
                    let sparkClone = i.myClone.GetAbilityByIndex(2)
                    if(!spark.GetCooldown()){
                        if(i.myClone.GetMana() > spark.GetManaCost()){
                            sparkClone.CastPosition(i.T3MidVector)
                        }
                    }
                }, 500);
            }

        }
        else if(i.BetaSpamSpark === 2){
            let spark = i.myHero.GetAbilityByIndex(2)
            if(!spark.GetCooldown()){
                if(i.myHero.GetMana() > spark.GetManaCost()){
                    spark.CastPosition(i.T3TopVector)
                }
            }

            if(i.myClone !== null){
                setTimeout(() => {
                    let sparkClone = i.myClone.GetAbilityByIndex(2)
                    if(!spark.GetCooldown()){
                        if(i.myClone.GetMana() > spark.GetManaCost()){
                            sparkClone.CastPosition(i.T3TopVector)
                        }
                    }
                }, 500);
            }
        }
        else if(i.BetaSpamSpark === 3){
            let spark = i.myHero.GetAbilityByIndex(2)
            if(!spark.GetCooldown()){
                if(i.myHero.GetMana() > spark.GetManaCost()){
                    spark.CastPosition(i.T3BotVector)
                }
            }
            
            if(i.myClone !== null){
                setTimeout(() => {
                    let sparkClone = i.myClone.GetAbilityByIndex(2)
                    if(!sparkClone.GetCooldown()){
                        if(i.myClone.GetMana() > sparkClone.GetManaCost()){
                            sparkClone.CastPosition(i.T3BotVector)
                        }
                    }
                }, 500);
            }
        }
    }
    
    
    // Деф трона [code: DT]
    if(i.bindStatusThrone && i.gameStart && !i.bindStatus){
            let magneticfieldspellThrone = i.myHero.GetAbilityByIndex(1)
            let createcloneThrone = i.myHero.GetAbility('arc_warden_tempest_double')
            let leftTime: number
                if(!i.FieldMapThrone){
                    if(!magneticfieldspellThrone.GetCooldown()){
                        if(i.myHero.GetMana() > magneticfieldspellThrone.GetManaCost()){
                            magneticfieldspellThrone.CastPosition(i.ThroneVector)
                            setTimeout(() => {
                                if(!i.MagneticDetectThrone){
                                    return
                                } else {
                                    i.FieldDurationThrone = magneticfieldspellThrone.GetLevelSpecialValueForFloat("duration");
                                        i.FieldTimeThrone = GameRules.GetGameTime()
                                            i.FieldMapThrone = true
                                            i.MagneticDetectThrone = false
                                    }
                            }, 100)
                        }
                    }
                } else {
                    if(i.myClone){
                        leftTime = GameRules.GetGameTime()-(i.FieldTimeThrone-0.3) //Клон уже призван, убираем задержку призыва клона
                    } else leftTime = GameRules.GetGameTime()-(i.FieldTimeThrone-0.65-0.3) //Клона нет, добавляем задержку на его появление

                    if(leftTime > i.FieldDurationThrone) {
                        if(i.myClone === null){
                            createcloneThrone.CastNoTarget()
                            setTimeout(() => {
                                let clone = i.myClone.GetAbilityByIndex(1)
                                    clone.CastPosition(i.ThroneVector)
                            }, 500);
                            i.FieldMapThrone = false
                        } else {
                            let ClonemagneticfieldspellThrone = i.myClone.GetAbilityByIndex(1)
                            if(!ClonemagneticfieldspellThrone.GetCooldown()){
                                if(i.myClone.GetMana() > ClonemagneticfieldspellThrone.GetManaCost()){
                                    ClonemagneticfieldspellThrone.CastPosition(i.ThroneVector)
                                    setTimeout(() => {
                                        if(!i.MagneticDetectThrone){
                                            return
                                        } else {
                                            i.FieldDuration = ClonemagneticfieldspellThrone.GetLevelSpecialValueForFloat("duration");
                                                i.FieldTime = GameRules.GetGameTime()
                                                    i.FieldMapThrone = false
                                                    i.MagneticDetectThrone = false
                                        }
                                }, 100)
                            }
                        }
                    }
                }
            }
        }
}

arcWardenMoreDefenceBase.OnModifierCreate = (entity) => {
        let i = ArcWardenMoreDefenceBase
        // @ts-ignore
        if (entity.GetClassName() === 'CDOTA_Unit_Hero_ArcWarden' && entity !== i.myHero && entity.HasModifier('modifier_arc_warden_tempest_double') && (!i.myClone || !i.myClone.IsEntity() || !i.myClone.IsAlive())){
                i.myClone = entity;
        }
}

arcWardenMoreDefenceBase.OnModifierDestroy = (entity) => {
        let i = ArcWardenMoreDefenceBase
        // @ts-ignore
        if (entity.GetClassName() === 'CDOTA_Unit_Hero_ArcWarden' && entity !== i.myHero && entity.HasModifier('modifier_arc_warden_tempest_double') && (!i.myClone || !i.myClone.IsEntity() || !i.myClone.IsAlive())){
                i.myClone = null;
        }
};

arcWardenMoreDefenceBase.OnParticleCreate = (particle) => {
    if(ArcWardenMoreDefenceBase.ArcWardenMoreBaseDef && ArcWardenMoreDefenceBase.gameStart){
        if(ArcWardenMoreDefenceBase.bindStatus){
            if(particle.fullName === 'particles/units/heroes/hero_arc_warden/arc_warden_magnetic.vpcf'){
                ArcWardenMoreDefenceBase.MagneticDetect = true
            }
        }
        else if(ArcWardenMoreDefenceBase.bindStatusThrone){
            if(particle.fullName === 'particles/units/heroes/hero_arc_warden/arc_warden_magnetic.vpcf'){
                ArcWardenMoreDefenceBase.MagneticDetectThrone = true
            }
        }
    }
}

arcWardenMoreDefenceBase.OnGameEnd = () => {
    ArcWardenMoreDefenceBase.gameStart = false;
};

arcWardenMoreDefenceBase.OnScriptLoad = arcWardenMoreDefenceBase.OnGameStart = ArcWardenMoreDefenceBase.Load.Init; ArcWardenMoreDefenceBase.bindStatus = false; ArcWardenMoreDefenceBase.bindStatusThrone = false

RegisterScript(arcWardenMoreDefenceBase);