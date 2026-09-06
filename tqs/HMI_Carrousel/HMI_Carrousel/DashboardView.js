/* ================================================================
   DASHBOARD VIEW
   Gestion de l'affichage du dashboard.

   Responsabilités :
   - mettre à jour les textes ;
   - mettre à jour les LED ;
   - mettre à jour les 8 bacs ;
   - afficher les états machine.

   Aucun accès ADS direct ici.
   ================================================================ */
export class DashboardView {
    nbBacs = 8;
    currentBac = 0;
    setpoint = null;
    bacCounts = null;
    fault = null;
    /* ============================================================
       HELPER DOM
       ============================================================ */
    getElement(id) {
        return document.getElementById(id);
    }
    /* ============================================================
       MODE MACHINE
       ============================================================ */
    setMode(modeValue) {
        const mode = String(modeValue ?? '---').trim();
        const modeValueElement = this.getElement('modeValue');
        const modeKpiValue = this.getElement('modeKpiValue');
        const modeBadge = this.getElement('modeBadge');
        const modeLed = this.getElement('modeKpiLed');
        const modeHint = this.getElement('modeKpiHint');
        if (modeValueElement) {
            modeValueElement.textContent = mode;
        }
        if (modeKpiValue) {
            modeKpiValue.textContent = mode;
        }
        if (modeBadge) {
            modeBadge.className = 'tqs-mode';
            switch (mode) {
                case 'AUTO':
                    modeBadge.classList.add('tqs-mode--auto');
                    break;
                case 'INIT':
                    modeBadge.classList.add('tqs-mode--init');
                    break;
                case 'DEFAUT':
                    modeBadge.classList.add('tqs-mode--fault');
                    break;
            }
        }
        if (modeLed) {
            modeLed.className = 'tqs-led';
            switch (mode) {
                case 'AUTO':
                    modeLed.classList.add('tqs-led--green', 'tqs-led--pulse');
                    break;
                case 'DEFAUT':
                    modeLed.classList.add('tqs-led--red');
                    break;
                default:
                    modeLed.classList.add('tqs-led--off');
                    break;
            }
        }
        if (modeHint) {
            switch (mode) {
                case 'AUTO':
                    modeHint.textContent =
                        'Fonctionnement automatique';
                    break;
                case 'INIT':
                    modeHint.textContent =
                        'Initialisation de la machine';
                    break;
                case 'DEFAUT':
                    modeHint.textContent =
                        'Machine en défaut';
                    break;
                default:
                    modeHint.textContent =
                        'En attente des données PLC';
                    break;
            }
        }
    }
    /* ============================================================
       ÉTAT DU CYCLE
       ============================================================ */
    setCycle(cycleValue, hint) {
        const cycle = String(cycleValue ?? '---').trim();
        const valueElement = this.getElement('cycleStateValue');
        const hintElement = this.getElement('cycleStateHint');
        const rotationRing = this.getElement('rotationRing');
        if (valueElement) {
            valueElement.textContent = cycle;
        }
        if (hintElement) {
            hintElement.textContent = hint;
        }
        /*
         * L'animation du carrousel représente uniquement
         * le véritable état BAC_SUIVANT du PLC.
         */
        if (rotationRing) {
            rotationRing.classList.toggle('tqs-carousel__ring-dash--moving', cycle === 'BAC_SUIVANT');
        }
    }
    /* ============================================================
       BAC ACTUEL
       ============================================================ */
    /* ============================================================
      BAC ACTUEL
      ============================================================ */
    setCurrentBac(value) {
        const bac = Number(value ?? 0);
        const valid = Number.isInteger(bac) &&
            bac >= 1 &&
            bac <= this.nbBacs;
        this.currentBac =
            valid ? bac : 0;
        const formatted = valid
            ? bac.toString().padStart(2, '0')
            : '--';
        const kpi = this.getElement('currentBinValue');
        const center = this.getElement('currentBinCenter');
        if (kpi) {
            kpi.textContent =
                formatted;
        }
        if (center) {
            center.textContent =
                formatted;
        }
        /*
         * Repositionne physiquement les 8 cartes.
         * Le bac actif occupe toujours la position 1.
         */
        this.updateBacPositions();
        /*
         * Actualise ensuite les couleurs,
         * compteurs et états.
         */
        this.refreshBacs();
    }
    /* ============================================================
       POSITION DES BACS SUR LE CARROUSEL

       Le bac actif occupe toujours la position 1.
       Les autres bacs sont décalés autour du cercle.
       ============================================================ */
    updateBacPositions() {
        if (this.currentBac < 1 ||
            this.currentBac > this.nbBacs) {
            return;
        }
        for (let bac = 1; bac <= this.nbBacs; bac++) {
            const card = this.getElement('bin' +
                bac +
                'Card');
            if (!card) {
                continue;
            }
            /*
             * Retire l'ancienne position.
             */
            for (let position = 1; position <= this.nbBacs; position++) {
                card.classList.remove('tqs-bac--pos' +
                    position);
            }
            const newPosition = ((bac -
                this.currentBac +
                this.nbBacs) %
                this.nbBacs) +
                1;
            card.classList.add('tqs-bac--pos' +
                newPosition);
        }
    }
    /* ============================================================
       CONSIGNE
       ============================================================ */
    setSetpoint(value) {
        this.setpoint =
            value === undefined
                ? null
                : Number(value);
        const element = this.getElement('setpointValue');
        if (element) {
            element.textContent =
                this.setpoint !== null
                    ? `${this.setpoint} pièces`
                    : '-- pièces';
        }
        this.refreshBacs();
    }
    /* ============================================================
       COMPTEURS DES BACS
       ============================================================ */
    setBacCounts(value) {
        if (!Array.isArray(value)) {
            this.bacCounts = null;
            this.refreshBacs();
            return;
        }
        this.bacCounts =
            value
                .slice(0, this.nbBacs)
                .map((item) => Number(item ?? 0));
        this.refreshBacs();
    }
    /* ============================================================
       VÉRIN AVANT
       ============================================================ */
    setCylinderForward(value) {
        this.setBooleanStatus('cylinderForwardLed', 'cylinderForwardValue', value);
    }
    /* ============================================================
       VÉRIN ARRIÈRE
       ============================================================ */
    setCylinderBackward(value) {
        this.setBooleanStatus('cylinderBackwardLed', 'cylinderBackwardValue', value);
    }
    /* ============================================================
       CYCLE VÉRIN
       ============================================================ */
    setCylinderCycle(value) {
        const text = this.getElement('cylinderCycleValue');
        const steps = this.getElement('cylinderSteps');
        if (value === undefined) {
            if (text) {
                text.textContent = '-- / 4';
            }
            if (steps) {
                for (let i = 0; i < steps.children.length; i++) {
                    steps.children[i].className = '';
                }
            }
            return;
        }
        const cycle = Math.max(0, Math.min(4, Number(value)));
        if (text) {
            text.textContent = `${cycle} / 4`;
        }
        if (steps) {
            for (let i = 0; i < steps.children.length; i++) {
                const step = steps.children[i];
                step.className =
                    i < cycle
                        ? 'on'
                        : '';
            }
        }
    }
    /* ============================================================
       DÉFAUT MACHINE
       ============================================================ */
    setFault(value) {
        const led = this.getElement('faultLed');
        const text = this.getElement('faultValue');
        if (value === undefined) {
            this.fault = null;
            if (led) {
                led.className =
                    'tqs-led tqs-led--off';
            }
            if (text) {
                text.textContent = '---';
            }
            this.refreshBacs();
            return;
        }
        this.fault = Boolean(value);
        if (led) {
            led.className =
                this.fault
                    ? 'tqs-led tqs-led--red'
                    : 'tqs-led tqs-led--green';
        }
        if (text) {
            text.textContent =
                this.fault
                    ? 'DÉFAUT'
                    : 'AUCUN';
        }
        this.refreshBacs();
    }
    /* ============================================================
       CAPTEUR ZÉRO
       ============================================================ */
    setZeroInput(value) {
        const active = Boolean(value);
        const button = document.getElementById('btnCapteurZero');
        if (!button) {
            return;
        }
        button.disabled = false;
        button.textContent =
            active
                ? 'Capteur zéro : ACTIF'
                : 'Capteur zéro : INACTIF';
        button.classList.toggle('tqs-btn--primary', active);
    }
    /* ============================================================
       DISPONIBILITÉ DU RESET BAC
       ============================================================ */
    setResetEnabled(enabled) {
        const button = document.getElementById('btnResetBin');
        if (button) {
            button.disabled = !enabled;
        }
    }
    /* ============================================================
      RAFRAÎCHISSEMENT DES BACS
      ============================================================ */
    refreshBacs() {
        let totalPieces = 0;
        for (let i = 1; i <= this.nbBacs; i++) {
            const card = this.getElement('bin' + i + 'Card');
            const chip = this.getElement('bin' + i + 'Chip');
            const countElement = this.getElement('bin' + i + 'Count');
            const maxElement = this.getElement('bin' + i + 'Max');
            const barElement = this.getElement('bin' + i + 'Bar');
            const count = this.bacCounts !== null
                ? Number(this.bacCounts[i - 1] ?? 0)
                : null;
            /* ---------- Compteur ---------- */
            if (count !== null) {
                totalPieces += count;
                if (countElement) {
                    countElement.textContent =
                        String(count);
                }
            }
            else {
                if (countElement) {
                    countElement.textContent =
                        '--';
                }
            }
            /* ---------- Consigne ---------- */
            if (maxElement) {
                maxElement.textContent =
                    this.setpoint !== null
                        ? '/ ' + this.setpoint
                        : '/ --';
            }
            /* ---------- Progression ---------- */
            let progression = 0;
            if (count !== null &&
                this.setpoint !== null &&
                this.setpoint > 0) {
                progression = Math.min(100, Math.max(0, (count / this.setpoint) * 100));
            }
            if (barElement) {
                barElement.style.width =
                    progression + '%';
            }
            /* ---------- État visuel ---------- */
            if (!card) {
                continue;
            }
            card.classList.remove('tqs-bac--active', 'tqs-bac--full', 'tqs-bac--fault');
            let chipText = '';
            const full = count !== null &&
                this.setpoint !== null &&
                this.setpoint > 0 &&
                count >= this.setpoint;
            /*
             * Priorité :
             * DÉFAUT > PLEIN > ACTIF
             */
            if (this.fault === true &&
                i === this.currentBac) {
                card.classList.add('tqs-bac--fault');
                chipText = 'Défaut';
            }
            else if (full) {
                card.classList.add('tqs-bac--full');
                chipText = 'Plein';
            }
            else if (i === this.currentBac) {
                card.classList.add('tqs-bac--active');
                chipText = 'Actif';
            }
            if (chip) {
                chip.textContent =
                    chipText;
            }
        }
        /* ---------- Total des pièces ---------- */
        const totalElement = this.getElement('totalPiecesValue');
        if (totalElement) {
            totalElement.textContent =
                this.bacCounts !== null
                    ? String(totalPieces)
                    : '--';
        }
    }
    /* ============================================================
       HELPER POUR LES ÉTATS BOOLÉENS
       ============================================================ */
    setBooleanStatus(ledId, textId, value) {
        const led = this.getElement(ledId);
        const text = this.getElement(textId);
        if (value === undefined) {
            if (led) {
                led.className = 'tqs-led tqs-led--off';
            }
            if (text) {
                text.textContent = '---';
            }
            return;
        }
        const active = Boolean(value);
        if (led) {
            led.className = active
                ? 'tqs-led tqs-led--green'
                : 'tqs-led tqs-led--off';
        }
        if (text) {
            text.textContent = active
                ? 'ON'
                : 'OFF';
        }
    }
}
//# sourceMappingURL=DashboardView.js.map