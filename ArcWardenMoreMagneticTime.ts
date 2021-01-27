let arcWardenMoreMagneticTime: ScriptDescription = {};

namespace ArcWardenMoreMagneticTime {
    export let HERO_INDEX = 'npc_dota_hero_arc_warden'
    export let gameStart: boolean = false
    export let ParticleIsCreate: boolean = false
    export let ArcWardenMoreMagneticField: boolean = false
    export let MagneticFieldBool: boolean = false
    export let MagneticFieldBoolClone: boolean = false
    export let myHero: Hero
    export let myPlayer: Player
    export let MagneticFieldVector = new Vector(0, 0, 0)
    export let MagneticFieldVectorClone = new Vector (0, 0, 0)
    export let MagneticFiedlTime: number
    export let MagneticFiedlTimeClone: number
    export let MagneticFieldParticle: number
    export let MagneticFieldParticleClone: number
    export let font = Renderer.LoadFont('Arial', 24, Enum.FontWeight.BOLD)

    let ArcWardenMoreMagneticFieldStatus = Menu.AddToggle(['More', 'Heroes', 'Agility', 'Arc Warden', 'MagneticField'], 'Таймер', false)

    ArcWardenMoreMagneticFieldStatus.SetTip('Показывает таймер, после использования MagneticFiel')

    ArcWardenMoreMagneticFieldStatus.OnChange(state => {
        ArcWardenMoreMagneticField = state.newValue;
    })
    ArcWardenMoreMagneticFieldStatus.GetValue();

    Menu.SetImage(['More', 'Heroes'], "~/menu/40x40/heroes.png")
    Menu.SetImage(['More', 'Heroes', 'Agility'], "~/menu/40x40/agillity.png")
    Menu.SetImage(['More', 'Heroes', 'Agility', 'Arc Warden'], "panorama/images/heroes/icons/npc_dota_hero_arc_warden_png.vtex_c")
    Menu.SetImage(['More', 'Heroes', 'Agility', 'Arc Warden', 'MagneticField'], 'panorama/images/spellicons/arc_warden_magnetic_field_png.vtex_c')

    export namespace Load {
        export function Init(): void {
            if (GameRules.IsActiveGame()) {
                gameStart = true;
                    myHero = EntitySystem.GetLocalHero();
                        myPlayer = EntitySystem.GetLocalPlayer();
            }
            if (!myHero || !myHero.IsExist() || myHero.GetUnitName() !== HERO_INDEX) {
                gameStart = false;
                return;
            }
        }
    }

    export namespace Timer {
        export function ActiveTimer() {
            if(MagneticFieldBool){
                let timerID = setInterval(() => {
                    if(MagneticFiedlTime > 0){
                        MagneticFiedlTime = MagneticFiedlTime-0.1
                    }
                }, 100);

                setTimeout(() => {
                    clearInterval(timerID)
                        MagneticFieldBool = false
                            ParticleIsCreate = false
                                    MagneticFieldParticle = 0
                }, 1000 * MagneticFiedlTime);
            }
        }
    }

    export namespace Timer2 {
        export function ActiveTimer() {
            if(MagneticFieldBoolClone){
                let timerIDClone = setInterval(() => {
                    if(MagneticFiedlTimeClone > 0){
                        MagneticFiedlTimeClone = MagneticFiedlTimeClone-0.1
                    }
                }, 100);

                setTimeout(() => {
                    clearInterval(timerIDClone)
                        MagneticFieldBoolClone = false
                                MagneticFieldParticleClone = 0
                }, 1000 * MagneticFiedlTimeClone);
            }
        }
    }
}

arcWardenMoreMagneticTime.OnDraw = () => {
    if(ArcWardenMoreMagneticTime.ArcWardenMoreMagneticField && ArcWardenMoreMagneticTime.gameStart && ArcWardenMoreMagneticTime.MagneticFieldBoolClone){
        let [x, y] = Renderer.WorldToScreen(ArcWardenMoreMagneticTime.MagneticFieldVectorClone)
            Renderer.SetDrawColor(255, 255, 255, 255);
                Renderer.DrawTextCentered(ArcWardenMoreMagneticTime.font, x, y, `${Math.round(ArcWardenMoreMagneticTime.MagneticFiedlTimeClone)}сек`)
    }

    if(ArcWardenMoreMagneticTime.ArcWardenMoreMagneticField && ArcWardenMoreMagneticTime.gameStart && ArcWardenMoreMagneticTime.MagneticFieldBool){
        let [x, y] = Renderer.WorldToScreen(ArcWardenMoreMagneticTime.MagneticFieldVector)
            Renderer.SetDrawColor(255, 255, 255, 255);
                Renderer.DrawTextCentered(ArcWardenMoreMagneticTime.font, x, y, `${Math.round(ArcWardenMoreMagneticTime.MagneticFiedlTime)}сек`)
    }
}

arcWardenMoreMagneticTime.OnPrepareUnitOrders = (order) => {
    if(ArcWardenMoreMagneticTime.ArcWardenMoreMagneticField && ArcWardenMoreMagneticTime.gameStart){
        if(order.ability){
            if(ArcWardenMoreMagneticTime.ParticleIsCreate){
                ArcWardenMoreMagneticTime.MagneticFieldVectorClone = new Vector(0, 0, 0)
                    ArcWardenMoreMagneticTime.MagneticFieldVectorClone = order.position
            }
            else if(order.ability.GetName() === 'arc_warden_magnetic_field'){
                    ArcWardenMoreMagneticTime.MagneticFieldVector = new Vector(0, 0, 0)
                        ArcWardenMoreMagneticTime.MagneticFieldVector = order.position
            }
        }
    }
}

arcWardenMoreMagneticTime.OnParticleCreate = (particle) => {
    if(ArcWardenMoreMagneticTime.ArcWardenMoreMagneticField && ArcWardenMoreMagneticTime.gameStart){
        if(ArcWardenMoreMagneticTime.ParticleIsCreate && particle.fullName === 'particles/units/heroes/hero_arc_warden/arc_warden_magnetic.vpcf'){
            ArcWardenMoreMagneticTime.MagneticFiedlTimeClone = EntitySystem.GetLocalHero().GetAbilityByIndex(1).GetLevelSpecialValueForFloat("duration");
            ArcWardenMoreMagneticTime.MagneticFieldParticleClone = particle.index
                ArcWardenMoreMagneticTime.MagneticFieldBoolClone = true
                    ArcWardenMoreMagneticTime.Timer2.ActiveTimer()
        }
        else if(particle.fullName === 'particles/units/heroes/hero_arc_warden/arc_warden_magnetic.vpcf'){
            ArcWardenMoreMagneticTime.MagneticFiedlTime = EntitySystem.GetLocalHero().GetAbilityByIndex(1).GetLevelSpecialValueForFloat("duration");
                ArcWardenMoreMagneticTime.MagneticFieldParticle = particle.index
                    ArcWardenMoreMagneticTime.MagneticFieldBool = true
                        ArcWardenMoreMagneticTime.ParticleIsCreate = true
                            ArcWardenMoreMagneticTime.Timer.ActiveTimer()
        }
    }
}

arcWardenMoreMagneticTime.OnGameEnd = () => {
    ArcWardenMoreMagneticTime.gameStart = false;
};

arcWardenMoreMagneticTime.OnScriptLoad = arcWardenMoreMagneticTime.OnGameStart = ArcWardenMoreMagneticTime.Load.Init;

RegisterScript(arcWardenMoreMagneticTime);