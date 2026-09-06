import { PlcService } from './PlcService.js';
import { DashboardView } from './DashboardView.js';


/* ================================================================
   Coordination entre le PLC et l'affichage.
   ================================================================ */

export class CarouselController {

    private static readonly NB_BACS = 8;

    private readonly plc: PlcService;
    private readonly view: DashboardView;

    private zeroInput = false;
    private currentBac = 0;
    private resetBacPressed: number | null = null;


    /* ============================================================
       SYMBOLES PLC
       ============================================================ */

    private readonly symbols = {
        mode: '%s%ADS.PLC1.MAIN.sModeVisu%/s%',
        cycle: '%s%ADS.PLC1.MAIN.sEtatCycleVisu%/s%',
        currentBac: '%s%ADS.PLC1.MAIN.nBacOut%/s%',

        setpoint: '%s%ADS.PLC1.MAIN.nPieceBacCmd%/s%',
        bacCounts: '%s%ADS.PLC1.MAIN.aPieceBacOut%/s%',

        cylinderCycle: '%s%ADS.PLC1.MAIN.nImpOut%/s%',
        cylinderForward: '%s%ADS.PLC1.MAIN.bVerinAvOut%/s%',
        cylinderBackward: '%s%ADS.PLC1.MAIN.bVerinArOut%/s%',

        fault: '%s%ADS.PLC1.MAIN.bDefautOut%/s%',

        laserInput: '%s%ADS.PLC1.MAIN.bLaserIn%/s%',
        zeroInput: '%s%ADS.PLC1.MAIN.bZeroIn%/s%',
    };


    /* ============================================================
       DESCRIPTION DES ÉTATS DU CYCLE
       ============================================================ */

    private readonly cycleHints: Record<string, string> = {
        ATTENTE: 'En attente du cycle',
        COMPTAGE: 'Comptage des pièces en cours',
        BAC_PLEIN: 'Consigne du bac atteinte',
        VERIN_SORTIE: 'Sortie du vérin en cours',
        VERIN_RENTREE: 'Rentrée du vérin en cours',
        BAC_SUIVANT: 'Passage au bac suivant',
        ATTENTE_BAC: 'Bac plein — attente du reset opérateur',
    };


    /* ============================================================
       CONSTRUCTEUR
       ============================================================ */

    public constructor(
        plc: PlcService,
        view: DashboardView,
    ) {
        this.plc = plc;
        this.view = view;
    }


    /* ============================================================
       DÉMARRAGE
       ============================================================ */

    public start(): void {
        this.connectReadSymbols();
        this.connectOperatorCommands();
    }


    /* ============================================================
       PLC → IHM
       ============================================================ */

    private connectReadSymbols(): void {

        /* ---------- Mode machine ---------- */

        this.plc.watch<string>(
            this.symbols.mode,
            'MODE',
            (value) => {
                this.view.setMode(value);
            },
        );


        /* ---------- État du cycle ---------- */

        this.plc.watch<string>(
            this.symbols.cycle,
            'ÉTAT DU CYCLE',
            (value) => {
                const cycle = String(value ?? '---').trim();

                const hint =
                    this.cycleHints[cycle] ??
                    'État transmis par le PLC';

                this.view.setCycle(
                    value,
                    hint,
                );
            },
        );


        /* ---------- Bac actuel ---------- */

        this.plc.watch<number>(
            this.symbols.currentBac,
            'BAC ACTUEL',
            (value) => {
                const bac = Number(value ?? 0);

                const isValidBac =
                    Number.isInteger(bac) &&
                    bac >= 1 &&
                    bac <= CarouselController.NB_BACS;

                this.currentBac =
                    isValidBac ? bac : 0;

                this.view.setCurrentBac(value);
                this.view.setResetEnabled(isValidBac);
            },
        );


        /* ---------- Consigne par bac ---------- */

        this.plc.watch<number>(
            this.symbols.setpoint,
            'CONSIGNE',
            (value) => {
                this.view.setSetpoint(value);
            },
        );


        /* ---------- Compteurs des 8 bacs ---------- */

        this.plc.watch<number[]>(
            this.symbols.bacCounts,
            'COMPTEURS BACS',
            (value) => {
                this.view.setBacCounts(value);
            },
        );


        /* ---------- Cycle vérin ---------- */

        this.plc.watch<number>(
            this.symbols.cylinderCycle,
            'CYCLE VÉRIN',
            (value) => {
                this.view.setCylinderCycle(value);
            },
        );


        /* ---------- Vérin avant ---------- */

        this.plc.watch<boolean>(
            this.symbols.cylinderForward,
            'VÉRIN AVANT',
            (value) => {
                this.view.setCylinderForward(value);
            },
        );


        /* ---------- Vérin arrière ---------- */

        this.plc.watch<boolean>(
            this.symbols.cylinderBackward,
            'VÉRIN ARRIÈRE',
            (value) => {
                this.view.setCylinderBackward(value);
            },
        );


        /* ---------- Défaut machine ---------- */

        this.plc.watch<boolean>(
            this.symbols.fault,
            'DÉFAUT',
            (value) => {
                this.view.setFault(value);
            },
        );


        /* ---------- Capteur zéro ---------- */

        this.plc.watch<boolean>(
            this.symbols.zeroInput,
            'CAPTEUR ZÉRO',
            (value) => {
                this.zeroInput = Boolean(value);
                this.view.setZeroInput(value);
            },
        );
    }


 /* ============================================================
   GÉNÉRATION DU SYMBOLE RESET BAC

   nBacOut      : 1..8
   aResetBacIn  : 0..7
   ============================================================ */

    private getResetBacSymbol(
        bac: number,
    ): string {

        const resetIndex = bac - 1;

        return (
            '%s%ADS.PLC1.MAIN.aResetBacIn[' +
            resetIndex +
            ']%/s%'
        );
    }


    /* ============================================================
       IHM → PLC
       ============================================================ */

    private connectOperatorCommands(): void {

        this.connectPieceCommand();
        this.connectZeroCommand();
        this.connectResetCommand();
    }


    /* ============================================================
       COMMANDE — SIMULER UNE PIÈCE
       bLaserIn : entrée momentanée
       ============================================================ */

    private connectPieceCommand(): void {

        const button =
            document.getElementById(
                'btnSimulatePiece',
            ) as HTMLButtonElement | null;

        if (!button) {
            return;
        }

        button.disabled = false;


        button.addEventListener(
            'pointerdown',
            () => {
                this.plc.writeBool(
                    this.symbols.laserInput,
                    true,
                );
            },
        );


        const release = (): void => {
            this.plc.writeBool(
                this.symbols.laserInput,
                false,
            );
        };


        button.addEventListener(
            'pointerup',
            release,
        );

        button.addEventListener(
            'pointercancel',
            release,
        );

        button.addEventListener(
            'pointerleave',
            release,
        );
    }


    /* ============================================================
       COMMANDE — CAPTEUR ZÉRO
       bZeroIn : entrée maintenue
       ============================================================ */

    private connectZeroCommand(): void {

        const button =
            document.getElementById(
                'btnCapteurZero',
            ) as HTMLButtonElement | null;

        if (!button) {
            return;
        }


        button.addEventListener(
            'click',
            () => {
                this.plc.writeBool(
                    this.symbols.zeroInput,
                    !this.zeroInput,
                );
            },
        );
    }


    /* ============================================================
       COMMANDE — RESET BAC ACTIF
       aResetBacIn[1..8] : entrée momentanée
       ============================================================ */

    private connectResetCommand(): void {

        const button =
            document.getElementById(
                'btnResetBin',
            ) as HTMLButtonElement | null;

        if (!button) {
            return;
        }


        /* ---------- Appui ---------- */

        button.addEventListener(
            'pointerdown',
            () => {
                const isValidBac =
                    this.currentBac >= 1 &&
                    this.currentBac <=
                        CarouselController.NB_BACS;

                if (!isValidBac) {
                    return;
                }


                /*
                 * Mémorisation du bac commandé.
                 *
                 * Même si nBacOut change pendant l'appui,
                 * le même élément sera remis à FALSE.
                 */
                this.resetBacPressed =
                    this.currentBac;


                this.plc.writeBool(
                    this.getResetBacSymbol(
                        this.resetBacPressed,
                    ),
                    true,
                );
            },
        );


        /* ---------- Relâchement ---------- */

        const release = (): void => {

            if (this.resetBacPressed === null) {
                return;
            }


            this.plc.writeBool(
                this.getResetBacSymbol(
                    this.resetBacPressed,
                ),
                false,
            );


            this.resetBacPressed = null;
        };


        button.addEventListener(
            'pointerup',
            release,
        );

        button.addEventListener(
            'pointercancel',
            release,
        );

        button.addEventListener(
            'pointerleave',
            release,
        );
    }


    /* ============================================================
       ARRÊT
       ============================================================ */

    public destroy(): void {
        this.plc.destroy();
    }
}