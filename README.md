# TQS — Carrousel de conditionnement

Projet TwinCAT 3 réalisé à la suite d'un test technique pour un poste d'automaticien / développeur PLC.

Le périmètre initial porte sur le pilotage d'un carrousel de conditionnement à 8 bacs : comptage des pièces, indexation pneumatique, réinitialisations opérateur et traitement des cas limites. Deux interfaces ont ensuite été ajoutées à titre personnel pour faciliter la démonstration : une PLC Visualization V1 et une TwinCAT HMI V2.

## Organisation du dépôt

```text
TQS_Test_CHATER/
├── tqs/
│   ├── TQS_Test_CHATER/
│   │   ├── PLC_Carrousel/          # Programme automate et PLC Visualization V1
│   │   └── TQS_Test_CHATER.tsproj  # Projet TwinCAT XAE
│   ├── HMI_Carrousel/              # Application TwinCAT HMI V2
│   └── TQS_Test_CHATER.sln
├── docs/
│   ├── images/                     # Captures des deux interfaces
│   ├── rapport/                    # Sources LaTeX structurées
│   └── Rapport_TQS_Chater_Bach-char.pdf
├── .gitignore
└── README.md
```

Les dossiers de compilation, bibliothèques restaurées, paquets et fichiers temporaires TwinCAT/HMI ne font pas partie des sources du projet.

## PLC

La logique métier est regroupée dans `FB_Carrousel`; `MAIN` assure les liaisons avec les entrées et les sorties.

- comptage sur front montant avec `R_TRIG` ;
- mémoire indépendante des 8 bacs ;
- indexation par 4 cycles complets du vérin ;
- modes `INIT`, `AUTO` et `DEFAUT` ;
- machine d'états du cycle automatique ;
- reset individuel ou global après un maintien de 10 s ;
- attente opérateur si le bac suivant est déjà plein ;
- contrôle des paramètres invalides et acquittement du défaut.

Les sources PLC se trouvent dans `tqs/TQS_Test_CHATER/PLC_Carrousel/` :

```text
PLC_Carrousel/
├── DUTs/       # E_ModeCarrousel, E_EtatCycle
├── POUs/       # MAIN, FB_Carrousel
├── VISUs/      # PLC Visualization V1
└── PlcTask.TcTTO
```

## Interfaces ajoutées après l'entretien

Les interfaces opérateur ne faisaient pas partie de la demande initiale. Elles constituent un complément personnel, documenté séparément dans l'Annexe B du rapport.

### PLC Visualization V1

La première interface est intégrée au projet PLC avec `VISUs/Visualization.TcVIS`. Elle sert à la supervision et aux essais dans TwinCAT XAE :

- mode, état courant, bac actif et avancement du cycle vérin ;
- compteurs et consigne des 8 bacs ;
- reset individuel des bacs ;
- indicateurs de défaut et de mouvement ;
- simulation du capteur zéro et du passage d'une pièce.

![PLC Visualization V1 du carrousel TQS](docs/images/VISU1.png)

### TwinCAT HMI V2

La seconde interface est une application web TwinCAT HMI située dans `tqs/HMI_Carrousel/`. Elle reprend les données du PLC dans un tableau de bord responsive sans déplacer la logique machine hors de l'automate.

- `PlcService.ts` encapsule la lecture, la surveillance et l'écriture des symboles ADS ;
- `CarouselController.ts` coordonne les échanges avec le PLC ;
- `DashboardView.ts` met à jour l'affichage ;
- `DashboardTemplate.ts` construit la structure du tableau de bord ;
- `Themes/Base/TqsDashboard.css` centralise le thème, les couleurs d'état et la mise en page responsive.

![TwinCAT HMI V2 du carrousel TQS](docs/images/VISU2.png)

Cette V2 convient à la démonstration et à la simulation. Une qualification pour la production demanderait notamment une gestion complète des droits, des alarmes historisées et des exigences de sécurité machine.

## Rapport technique

Le [rapport final au format PDF](docs/Rapport_TQS_Chater_Bach-char.pdf) présente le travail demandé lors de l'entretien : architecture TwinCAT, machine d'états, Structured Text, essais et cas limites. Les IHM ajoutées ensuite sont volontairement isolées dans l'Annexe B.

Les sources LaTeX sont versionnées dans `docs/rapport/` et séparées par sections :

```text
docs/rapport/
├── main.tex
├── sections/
│   ├── 00_couverture.tex
│   ├── 00_sommaire.tex
│   ├── 01_contexte_objectif.tex
│   ├── ...
│   ├── 10_conclusion.tex
│   ├── annexe_a_types_interface.tex
│   └── annexe_b_ihm.tex
└── images/
```

Pour recompiler le rapport avec une distribution LaTeX complète :

```bash
cd docs/rapport
latexmk -pdf main.tex
```

Le PDF compilé dans `docs/rapport/main.pdf` reste local et est ignoré. Le document de référence est conservé sous `docs/Rapport_TQS_Chater_Bach-char.pdf`.

## Validation et ouverture du projet

Le projet PLC a été compilé, exécuté et testé sous TwinCAT 3 sur un runtime local. Les essais couvrent notamment le référencement, le comptage, l'indexation, le retour du bac 8 vers le bac 1, les resets et les paramètres invalides.

- solution : `tqs/TQS_Test_CHATER.sln` ;
- projet XAE : `tqs/TQS_Test_CHATER/TQS_Test_CHATER.tsproj` ;
- projet TwinCAT HMI : `tqs/HMI_Carrousel/HMI_Carrousel.hmiproj.xml` ;
- rapport final : `docs/Rapport_TQS_Chater_Bach-char.pdf`.

---

**Chater Bach-char**  
Ingénieur systèmes numériques & instrumentation
