// "Beckhoff.TwinCAT.HMI.Framework/*" is mapped to the correct folder
// in runtime and in tsconfig.json.
import { EventProvider, } from 'Beckhoff.TwinCAT.HMI.Framework/index.esm.js';
import { PlcService } from './PlcService.js';
import { DashboardView } from './DashboardView.js';
import { DashboardTemplate } from './DashboardTemplate.js';
import { CarouselController } from './CarouselController.js';
/* ================================================================
   DASHBOARD
   Point d'entrée de l'IHM du carrousel.

   Architecture :
   DashboardTemplate    → construit l'interface HTML
   DashboardView        → met à jour l'affichage
   PlcService           → communique avec le PLC via ADS
   CarouselController   → relie le PLC à l'affichage
   ================================================================ */
let controller = null;
/* ================================================================
   INITIALISATION
   ================================================================ */
EventProvider.register('DashboardHost.onAttached', (e) => {
    /*
     * Cet événement d'initialisation
     * ne doit être exécuté qu'une seule fois.
     */
    e.destroy();
    /* ---------- Récupération du HtmlHost ---------- */
    const host = TcHmi.Controls.get('DashboardHost');
    if (!host) {
        console.error('DashboardHost introuvable');
        return;
    }
    const element = host.getElement()[0];
    /* ---------- Nettoyage d'une instance précédente ---------- */
    if (controller) {
        controller.destroy();
        controller = null;
    }
    /* ---------- Construction de l'interface ---------- */
    const template = new DashboardTemplate();
    element.innerHTML =
        template.render();
    /* ---------- Création des composants ---------- */
    const plc = new PlcService();
    const view = new DashboardView();
    /* ---------- Démarrage du contrôleur ---------- */
    controller =
        new CarouselController(plc, view);
    controller.start();
});
//# sourceMappingURL=Dashboard.js.map