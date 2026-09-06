# TQS — Carrousel de conditionnement

Projet TwinCAT 3 réalisé à la suite d'un test technique pour un poste d'automaticien / développeur PLC.

Le projet pilote un carrousel de conditionnement à 8 bacs : comptage des pièces, indexation pneumatique, réinitialisations opérateur et gestion de plusieurs cas limites. Il comprend la logique PLC, une visualisation locale TwinCAT et la documentation technique complète.

## PLC

La logique métier est regroupée dans `FB_Carrousel`; `MAIN` assure les liaisons avec les entrées, les sorties et la visualisation.

- comptage sur front montant avec `R_TRIG` ;
- mémoire indépendante des 8 bacs ;
- indexation par 4 cycles complets du vérin ;
- modes `INIT`, `AUTO` et `DEFAUT` ;
- machine d'états du cycle automatique ;
- reset individuel ou global après un maintien de 10 s ;
- attente opérateur si le bac suivant est déjà plein ;
- contrôle des paramètres invalides et acquittement du défaut.

Les sources se trouvent dans `PLC_Carrousel/` :

```text
PLC_Carrousel/
├── DUTs/       # E_ModeCarrousel, E_EtatCycle
├── POUs/       # MAIN, FB_Carrousel
├── VISUs/      # PLC Visualization V1
└── PlcTask.TcTTO
```

## PLC Visualization V1

La première interface est intégrée au projet PLC avec l'objet `PLC_Carrousel/VISUs/Visualization.TcVIS`. Elle sert à la supervision et aux essais sur le runtime local :

- mode, état courant, bac actif et avancement du cycle vérin ;
- compteurs et consigne des 8 bacs ;
- reset individuel de chaque bac ;
- indicateurs de défaut et de mouvement du vérin ;
- simulation du capteur zéro et du passage d'une pièce.

![PLC Visualization V1 du carrousel TQS](docs/images/VISU1.png)

## Rapport technique

Le [rapport final au format PDF](docs/Rapport_TQS_Chater_Bach-char.pdf) présente l'architecture TwinCAT, la machine d'états, les extraits Structured Text, les essais et les cas limites corrigés.

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
│   └── annexe_a_types_interface.tex
└── images/
```

Pour recompiler le rapport avec une distribution LaTeX complète :

```bash
cd docs/rapport
latexmk -pdf main.tex
```

Le PDF de référence reste conservé sous `docs/Rapport_TQS_Chater_Bach-char.pdf`.

## TwinCAT HMI V2 — évolution prévue

La PLC Visualization V1 constitue l'interface locale actuelle. Une future TwinCAT HMI V2 pourra reprendre les mêmes données PLC dans une interface web plus moderne, avec navigation, vues de diagnostic, alarmes et historique. Cette V2 est une évolution prévue et n'est pas incluse dans l'état actuel du dépôt.

## Validation et ouverture du projet

Le projet a été compilé, exécuté et testé sous TwinCAT 3 sur un runtime local. Les essais couvrent notamment le référencement, le comptage, l'indexation, le retour du bac 8 vers le bac 1, les resets et les paramètres invalides.

- projet XAE : `TQS_Test_CHATER.tsproj` ;
- archive TwinCAT : `TQS_Test_CHATER.tnzip` ;
- rapport final : `docs/Rapport_TQS_Chater_Bach-char.pdf`.

---

**Chater Bach-char**  
Ingénieur systèmes numériques & instrumentation
