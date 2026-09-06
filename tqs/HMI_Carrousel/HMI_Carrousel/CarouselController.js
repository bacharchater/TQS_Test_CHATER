/* ================================================================
   CAROUSEL CONTROLLER
   Coordination entre le PLC et l'affichage.

   Responsabilités :
   - lire les variables PLC ;
   - transmettre les valeurs à DashboardView ;
   - gérer les commandes opérateur ;
   - ne contenir aucune logique de séquencement machine.

   Le PLC reste l'unique source de vérité.
   ================================================================ */
export class CarouselController {
    static NB_BACS = 8;
    plc;
    view;
    zeroInput = false;
    currentBac = 0;
    resetBacPressed = null;
    /* ============================================================
       SYMBOLES PLC
       ============================================================ */
    symbols = {
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
    cycleHints = {
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
    constructor(plc, view) {
        this.plc = plc;
        this.view = view;
    }
    /* ============================================================
       DÉMARRAGE
       ============================================================ */
    start() {
        this.connectReadSymbols();
        this.connectOperatorCommands();
    }
    /* ============================================================
       PLC → IHM
       ============================================================ */
    connectReadSymbols() {
        /* ---------- Mode machine ---------- */
        this.plc.watch(this.symbols.mode, 'MODE', (value) => {
            this.view.setMode(value);
        });
        /* ---------- État du cycle ---------- */
        this.plc.watch(this.symbols.cycle, 'ÉTAT DU CYCLE', (value) => {
            const cycle = String(value ?? '---').trim();
            const hint = this.cycleHints[cycle] ??
                'État transmis par le PLC';
            this.view.setCycle(value, hint);
        });
        /* ---------- Bac actuel ---------- */
        this.plc.watch(this.symbols.currentBac, 'BAC ACTUEL', (value) => {
            const bac = Number(value ?? 0);
            const isValidBac = Number.isInteger(bac) &&
                bac >= 1 &&
                bac <= CarouselController.NB_BACS;
            this.currentBac =
                isValidBac ? bac : 0;
            this.view.setCurrentBac(value);
            this.view.setResetEnabled(isValidBac);
        });
        /* ---------- Consigne par bac ---------- */
        this.plc.watch(this.symbols.setpoint, 'CONSIGNE', (value) => {
            this.view.setSetpoint(value);
        });
        /* ---------- Compteurs des 8 bacs ---------- */
        this.plc.watch(this.symbols.bacCounts, 'COMPTEURS BACS', (value) => {
            this.view.setBacCounts(value);
        });
        /* ---------- Cycle vérin ---------- */
        this.plc.watch(this.symbols.cylinderCycle, 'CYCLE VÉRIN', (value) => {
            this.view.setCylinderCycle(value);
        });
        /* ---------- Vérin avant ---------- */
        this.plc.watch(this.symbols.cylinderForward, 'VÉRIN AVANT', (value) => {
            this.view.setCylinderForward(value);
        });
        /* ---------- Vérin arrière ---------- */
        this.plc.watch(this.symbols.cylinderBackward, 'VÉRIN ARRIÈRE', (value) => {
            this.view.setCylinderBackward(value);
        });
        /* ---------- Défaut machine ---------- */
        this.plc.watch(this.symbols.fault, 'DÉFAUT', (value) => {
            this.view.setFault(value);
        });
        /* ---------- Capteur zéro ---------- */
        this.plc.watch(this.symbols.zeroInput, 'CAPTEUR ZÉRO', (value) => {
            this.zeroInput = Boolean(value);
            this.view.setZeroInput(value);
        });
    }
    /* ============================================================
      GÉNÉRATION DU SYMBOLE RESET BAC

      nBacOut      : 1..8
      aResetBacIn  : 0..7
      ============================================================ */
    getResetBacSymbol(bac) {
        const resetIndex = bac - 1;
        return ('%s%ADS.PLC1.MAIN.aResetBacIn[' +
            resetIndex +
            ']%/s%');
    }
    /* ============================================================
       IHM → PLC
       ============================================================ */
    connectOperatorCommands() {
        this.connectPieceCommand();
        this.connectZeroCommand();
        this.connectResetCommand();
    }
    /* ============================================================
       COMMANDE — SIMULER UNE PIÈCE
       bLaserIn : entrée momentanée
       ============================================================ */
    connectPieceCommand() {
        const button = document.getElementById('btnSimulatePiece');
        if (!button) {
            return;
        }
        button.disabled = false;
        button.addEventListener('pointerdown', () => {
            this.plc.writeBool(this.symbols.laserInput, true);
        });
        const release = () => {
            this.plc.writeBool(this.symbols.laserInput, false);
        };
        button.addEventListener('pointerup', release);
        button.addEventListener('pointercancel', release);
        button.addEventListener('pointerleave', release);
    }
    /* ============================================================
       COMMANDE — CAPTEUR ZÉRO
       bZeroIn : entrée maintenue
       ============================================================ */
    connectZeroCommand() {
        const button = document.getElementById('btnCapteurZero');
        if (!button) {
            return;
        }
        button.addEventListener('click', () => {
            this.plc.writeBool(this.symbols.zeroInput, !this.zeroInput);
        });
    }
    /* ============================================================
       COMMANDE — RESET BAC ACTIF
       aResetBacIn[1..8] : entrée momentanée
       ============================================================ */
    connectResetCommand() {
        const button = document.getElementById('btnResetBin');
        if (!button) {
            return;
        }
        /* ---------- Appui ---------- */
        button.addEventListener('pointerdown', () => {
            const isValidBac = this.currentBac >= 1 &&
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
            this.plc.writeBool(this.getResetBacSymbol(this.resetBacPressed), true);
        });
        /* ---------- Relâchement ---------- */
        const release = () => {
            if (this.resetBacPressed === null) {
                return;
            }
            this.plc.writeBool(this.getResetBacSymbol(this.resetBacPressed), false);
            this.resetBacPressed = null;
        };
        button.addEventListener('pointerup', release);
        button.addEventListener('pointercancel', release);
        button.addEventListener('pointerleave', release);
    }
    /* ============================================================
       ARRÊT
       ============================================================ */
    destroy() {
        this.plc.destroy();
    }
}
//# sourceMappingURL=CarouselController.js.map