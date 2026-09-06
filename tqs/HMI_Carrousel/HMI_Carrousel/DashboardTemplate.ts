/* ================================================================
   DASHBOARD TEMPLATE
   Construction de la structure HTML de l'IHM.

   Responsabilités :
   - construire le dashboard ;
   - générer les 8 bacs ;
   - définir les identifiants utilisés par DashboardView.

   Aucune communication ADS ici.
   Aucune logique machine ici.
   ================================================================ */

export class DashboardTemplate {

    private readonly nbBacs = 8;


    /* ============================================================
       CONSTRUCTION DU DASHBOARD
       ============================================================ */

    public render(): string {

        const bacsHtml =
            this.createBacsHtml();


        return (
            '<div class="tqs-dashboard">' +


                /* =================================================
                   HEADER
                   ================================================= */

                '<header class="tqs-header">' +

                    '<div>' +

                        '<h1 class="tqs-header__title">' +
                            'Carrousel de conditionnement' +
                        '</h1>' +

                        '<p class="tqs-header__subtitle">' +
                            'Supervision production — 8 bacs' +
                        '</p>' +

                    '</div>' +


                    '<div class="tqs-mode" id="modeBadge">' +

                        '<span ' +
                            'class="tqs-mode__dot" ' +
                            'id="modeDot">' +
                        '</span>' +

                        '<span class="tqs-mode__label">' +
                            'MODE' +
                        '</span>' +

                        '<span ' +
                            'class="tqs-mode__value" ' +
                            'id="modeValue">' +
                            '---' +
                        '</span>' +

                    '</div>' +

                '</header>' +


                /* =================================================
                   KPI
                   ================================================= */

                '<section class="tqs-kpis">' +


                    /* ---------- MODE ---------- */

                    '<div class="tqs-card tqs-kpi">' +

                        '<div class="tqs-kpi__label">' +
                            'Mode' +
                        '</div>' +

                        '<div class="tqs-kpi__value">' +

                            '<span ' +
                                'class="tqs-led tqs-led--off" ' +
                                'id="modeKpiLed">' +
                            '</span>' +

                            '<span id="modeKpiValue">' +
                                '---' +
                            '</span>' +

                        '</div>' +

                        '<div ' +
                            'class="tqs-kpi__hint" ' +
                            'id="modeKpiHint">' +
                            'En attente des données PLC' +
                        '</div>' +

                    '</div>' +


                    /* ---------- ÉTAT DU CYCLE ---------- */

                    '<div class="tqs-card tqs-kpi">' +

                        '<div class="tqs-kpi__label">' +
                            'État du cycle' +
                        '</div>' +

                        '<div ' +
                            'class="tqs-kpi__value ' +
                            'tqs-kpi__value--state">' +

                            '<span id="cycleStateValue">' +
                                '---' +
                            '</span>' +

                        '</div>' +

                        '<div ' +
                            'class="tqs-kpi__hint" ' +
                            'id="cycleStateHint">' +
                            'En attente des données PLC' +
                        '</div>' +

                    '</div>' +


                    /* ---------- BAC ACTUEL ---------- */

                    '<div class="tqs-card tqs-kpi">' +

                        '<div class="tqs-kpi__label">' +
                            'Bac actuel' +
                        '</div>' +

                        '<div ' +
                            'class="tqs-kpi__value ' +
                            'tqs-kpi__value--big">' +

                            '<span id="currentBinValue">' +
                                '--' +
                            '</span>' +

                            '<span class="tqs-kpi__unit">' +
                                '/ 08' +
                            '</span>' +

                        '</div>' +

                        '<div class="tqs-kpi__hint">' +
                            'Position du carrousel' +
                        '</div>' +

                    '</div>' +

                '</section>' +


                /* =================================================
                   ZONE PRINCIPALE
                   ================================================= */

                '<main class="tqs-main">' +


                    /* =================================================
                       CARROUSEL
                       ================================================= */

                    '<section ' +
                        'class="tqs-card tqs-carousel-card">' +

                        '<div class="tqs-card__header">' +

                            '<h2 class="tqs-card__title">' +
                                'Vue carrousel' +
                            '</h2>' +

                            '<span class="tqs-card__tag">' +
                                '8 postes' +
                            '</span>' +

                        '</div>' +


                        '<div ' +
                            'class="tqs-carousel" ' +
                            'id="carousel">' +


                            /* ---------- Anneau ---------- */

                            '<svg ' +
                                'class="tqs-carousel__ring" ' +
                                'viewBox="0 0 560 560" ' +
                                'aria-hidden="true">' +

                                '<circle ' +
                                    'cx="280" ' +
                                    'cy="280" ' +
                                    'r="218" ' +
                                    'class="tqs-carousel__ring-track">' +
                                '</circle>' +

                                '<circle ' +
                                    'cx="280" ' +
                                    'cy="280" ' +
                                    'r="218" ' +
                                    'class="tqs-carousel__ring-dash" ' +
                                    'id="rotationRing">' +
                                '</circle>' +


                                /* ---------- Bras ---------- */

                                '<g class="tqs-carousel__spokes">' +

                                    '<line ' +
                                        'x1="280" ' +
                                        'y1="280" ' +
                                        'x2="280" ' +
                                        'y2="62">' +
                                    '</line>' +

                                    '<line ' +
                                        'x1="280" ' +
                                        'y1="280" ' +
                                        'x2="434" ' +
                                        'y2="126">' +
                                    '</line>' +

                                    '<line ' +
                                        'x1="280" ' +
                                        'y1="280" ' +
                                        'x2="498" ' +
                                        'y2="280">' +
                                    '</line>' +

                                    '<line ' +
                                        'x1="280" ' +
                                        'y1="280" ' +
                                        'x2="434" ' +
                                        'y2="434">' +
                                    '</line>' +

                                    '<line ' +
                                        'x1="280" ' +
                                        'y1="280" ' +
                                        'x2="280" ' +
                                        'y2="498">' +
                                    '</line>' +

                                    '<line ' +
                                        'x1="280" ' +
                                        'y1="280" ' +
                                        'x2="126" ' +
                                        'y2="434">' +
                                    '</line>' +

                                    '<line ' +
                                        'x1="280" ' +
                                        'y1="280" ' +
                                        'x2="62" ' +
                                        'y2="280">' +
                                    '</line>' +

                                    '<line ' +
                                        'x1="280" ' +
                                        'y1="280" ' +
                                        'x2="126" ' +
                                        'y2="126">' +
                                    '</line>' +

                                '</g>' +

                            '</svg>' +


                            /* ---------- Centre ---------- */

                            '<div class="tqs-carousel__center">' +

                                '<div class="tqs-carousel__center-label">' +
                                    'Bac actuel' +
                                '</div>' +

                                '<div ' +
                                    'class="tqs-carousel__center-value" ' +
                                    'id="currentBinCenter">' +
                                    '--' +
                                '</div>' +

                            '</div>' +


                            /* =================================================
                               COUCHE ROTATIVE DES 8 BACS

                               Cette couche permettra de faire tourner
                               l'ensemble des bacs autour du centre sans
                               déplacer individuellement chaque carte.
                               ================================================= */

                            '<div ' +
                                'class="tqs-carousel__bins-layer" ' +
                                'id="binsLayer">' +

                                bacsHtml +

                            '</div>' +

                        '</div>' +


                        /* ---------- Légende ---------- */

                        '<div class="tqs-legend">' +

                            '<span class="tqs-legend__item">' +

                                '<i class="tqs-legend__swatch">' +
                                '</i>' +

                                'Normal' +

                            '</span>' +


                            '<span class="tqs-legend__item">' +

                                '<i ' +
                                    'class="tqs-legend__swatch ' +
                                    'tqs-legend__swatch--active">' +
                                '</i>' +

                                'Actif' +

                            '</span>' +


                            '<span class="tqs-legend__item">' +

                                '<i ' +
                                    'class="tqs-legend__swatch ' +
                                    'tqs-legend__swatch--full">' +
                                '</i>' +

                                'Plein' +

                            '</span>' +


                            '<span class="tqs-legend__item">' +

                                '<i ' +
                                    'class="tqs-legend__swatch ' +
                                    'tqs-legend__swatch--fault">' +
                                '</i>' +

                                'Défaut' +

                            '</span>' +

                        '</div>' +

                    '</section>' +


                    /* =================================================
                       PANNEAU DROIT
                       ================================================= */

                    '<aside class="tqs-side">' +


                        /* =================================================
                           ÉTAT MACHINE
                           ================================================= */

                        '<section ' +
                            'class="tqs-card tqs-status-panel">' +

                            '<div class="tqs-card__header">' +

                                '<h2 class="tqs-card__title">' +
                                    'État machine' +
                                '</h2>' +

                            '</div>' +


                            /* ---------- Vérin avant ---------- */

                            this.createStatusRow(
                                'Vérin avant',
                                'cylinderForwardLed',
                                'cylinderForwardValue',
                            ) +


                            /* ---------- Vérin arrière ---------- */

                            this.createStatusRow(
                                'Vérin arrière',
                                'cylinderBackwardLed',
                                'cylinderBackwardValue',
                            ) +


                            /* ---------- Cycle vérin ---------- */

                            '<div class="tqs-status-row">' +

                                '<span class="tqs-status-row__label">' +
                                    'Cycle vérin' +
                                '</span>' +

                                '<span class="tqs-status-row__state">' +

                                    '<span ' +
                                        'class="tqs-verin-steps" ' +
                                        'id="cylinderSteps">' +

                                        '<i></i>' +
                                        '<i></i>' +
                                        '<i></i>' +
                                        '<i></i>' +

                                    '</span>' +

                                    '<span ' +
                                        'class="tqs-status-row__value" ' +
                                        'id="cylinderCycleValue">' +
                                        '-- / 4' +
                                    '</span>' +

                                '</span>' +

                            '</div>' +


                            /* ---------- Défaut ---------- */

                            '<div ' +
                                'class="tqs-status-row ' +
                                'tqs-status-row--last">' +

                                '<span class="tqs-status-row__label">' +
                                    'Défaut' +
                                '</span>' +

                                '<span class="tqs-status-row__state">' +

                                    '<span ' +
                                        'class="tqs-led tqs-led--off" ' +
                                        'id="faultLed">' +
                                    '</span>' +

                                    '<span ' +
                                        'class="tqs-status-row__value" ' +
                                        'id="faultValue">' +
                                        '---' +
                                    '</span>' +

                                '</span>' +

                            '</div>' +


                            '<div ' +
                                'class="tqs-status-panel__divider">' +
                            '</div>' +


                            /* ---------- Consigne ---------- */

                            '<div class="tqs-status-row">' +

                                '<span class="tqs-status-row__label">' +
                                    'Consigne par bac' +
                                '</span>' +

                                '<span ' +
                                    'class="tqs-status-row__value" ' +
                                    'id="setpointValue">' +
                                    '-- pièces' +
                                '</span>' +

                            '</div>' +


                            /* ---------- Total pièces ---------- */

                            '<div ' +
                                'class="tqs-status-row ' +
                                'tqs-status-row--last">' +

                                '<span class="tqs-status-row__label">' +
                                    'Pièces totales' +
                                '</span>' +

                                '<span ' +
                                    'class="tqs-status-row__value ' +
                                    'tqs-status-row__value--accent" ' +
                                    'id="totalPiecesValue">' +
                                    '--' +
                                '</span>' +

                            '</div>' +

                        '</section>' +


                        /* =================================================
                           COMMANDES OPÉRATEUR
                           ================================================= */

                        '<section class="tqs-card tqs-cmds">' +

                            '<div class="tqs-card__header">' +

                                '<h2 class="tqs-card__title">' +
                                    'Commandes opérateur' +
                                '</h2>' +

                            '</div>' +


                            '<div class="tqs-cmds__grid">' +


                                /* ---------- Simuler une pièce ---------- */

                                '<button ' +
                                    'type="button" ' +
                                    'class="tqs-btn tqs-btn--primary" ' +
                                    'id="btnSimulatePiece" ' +
                                    'disabled>' +
                                    'Simuler une pièce' +
                                '</button>' +


                                /* ---------- Capteur zéro ---------- */

                                '<button ' +
                                    'type="button" ' +
                                    'class="tqs-btn" ' +
                                    'id="btnCapteurZero" ' +
                                    'disabled>' +
                                    'Capteur zéro' +
                                '</button>' +


                                /* ---------- Reset bac actif ---------- */

                                '<button ' +
                                    'type="button" ' +
                                    'class="tqs-btn" ' +
                                    'id="btnResetBin" ' +
                                    'disabled>' +
                                    'Reset bac actif' +
                                '</button>' +

                            '</div>' +


                            '<p class="tqs-cmds__note">' +
                                'Commandes opérateur raccordées directement au PLC.' +
                            '</p>' +

                        '</section>' +

                    '</aside>' +

                '</main>' +


                /* =================================================
                   SIGNATURE
                   ================================================= */

                '<div class="tqs-signature">' +
                    'TQS • PROJ4 DESIGN SYSTEM' +
                '</div>' +

            '</div>'
        );
    }


    /* ============================================================
       GÉNÉRATION DES 8 BACS
       ============================================================ */

    private createBacsHtml(): string {

        let html = '';


        for (
            let i = 1;
            i <= this.nbBacs;
            i++
        ) {

            html +=
                '<div ' +
                    'class="tqs-bac tqs-bac--pos' +
                    i +
                    '" ' +
                    'id="bin' +
                    i +
                    'Card">' +


                    /* ---------- En-tête du bac ---------- */

                    '<div class="tqs-bac__head">' +

                        '<span class="tqs-bac__name">' +
                            'BAC ' +
                            i +
                        '</span>' +

                        '<span ' +
                            'class="tqs-bac__chip" ' +
                            'id="bin' +
                            i +
                            'Chip">' +
                        '</span>' +

                    '</div>' +


                    /* ---------- Compteur ---------- */

                    '<div class="tqs-bac__count">' +

                        '<span id="bin' +
                            i +
                            'Count">' +
                            '--' +
                        '</span>' +

                        '<span ' +
                            'class="tqs-bac__max" ' +
                            'id="bin' +
                            i +
                            'Max">' +
                            '/ --' +
                        '</span>' +

                    '</div>' +


                    /* ---------- Barre de progression ---------- */

                    '<div class="tqs-bac__bar">' +

                        '<div ' +
                            'class="tqs-bac__bar-fill" ' +
                            'id="bin' +
                            i +
                            'Bar" ' +
                            'style="width:0%">' +
                        '</div>' +

                    '</div>' +

                '</div>';
        }


        return html;
    }


    /* ============================================================
       LIGNE D'ÉTAT BOOLÉENNE
       ============================================================ */

    private createStatusRow(
        label: string,
        ledId: string,
        valueId: string,
    ): string {

        return (
            '<div class="tqs-status-row">' +

                '<span class="tqs-status-row__label">' +
                    label +
                '</span>' +

                '<span class="tqs-status-row__state">' +

                    '<span ' +
                        'class="tqs-led tqs-led--off" ' +
                        'id="' +
                        ledId +
                        '">' +
                    '</span>' +

                    '<span ' +
                        'class="tqs-status-row__value" ' +
                        'id="' +
                        valueId +
                        '">' +
                        '---' +
                    '</span>' +

                '</span>' +

            '</div>'
        );
    }
}