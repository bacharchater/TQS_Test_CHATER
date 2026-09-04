# TQS — Carrousel de conditionnement

Projet TwinCAT 3 réalisé à la suite d'un test technique pour un poste d'automaticien / développeur PLC.

Le projet reprend le pilotage d'un carrousel de conditionnement à 8 bacs, avec comptage des pièces, indexation pneumatique, resets opérateur et gestion de plusieurs cas limites.

## Fonctionnalités

- Comptage des pièces sur front montant avec `R_TRIG`
- Gestion indépendante des 8 bacs
- Indexation par 4 cycles complets du vérin
- Temps de mouvement paramétrable
- Reset individuel de chaque bac
- Reset global après maintien 10 s
- Modes `INIT / AUTO / DEFAUT`
- Attente opérateur lorsqu'un bac déjà plein revient en position
- Gestion des paramètres invalides
- Acquittement défaut avec retour par `INIT`

## Architecture

MAIN  
└── FB_Carrousel  
  ├── INIT  
  ├── AUTO  
  │ ├── ATTENTE  
  │ ├── COMPTAGE  
  │ ├── BAC_PLEIN  
  │ ├── VERIN_SORTIE  
  │ ├── VERIN_RENTREE  
  │ ├── BAC_SUIVANT  
  │ └── ATTENTE_BAC  
  └── DEFAUT  

Les états sont définis avec :

- `E_ModeCarrousel`
- `E_EtatCycle`

## Validation

Le projet a été compilé et exécuté sous TwinCAT 3 sur runtime local.

Les essais ont notamment permis de valider :

- le référencement par le capteur zéro ;
- le comptage des pièces ;
- le passage de bac ;
- les 4 cycles de vérin ;
- le retour du bac 8 vers le bac 1 ;
- les resets individuels et global ;
- l'attente sur un bac déjà plein ;
- le passage en défaut pour une consigne de pièces ou un temps vérin invalide.

Plusieurs cas limites ont été reproduits puis corrigés pendant les essais.

## Rapport technique

Le rapport détaillé est disponible ici :

`docs/Rapport_TQS_Chater_Bach-char.pdf`

## Projet TwinCAT

Les sources TwinCAT sont directement présentes dans le dépôt.

Une archive du projet est également disponible :

`TQS_Test_CHATER.tnzip`

---

**Chater Bach-char**  
Ingénieur systèmes