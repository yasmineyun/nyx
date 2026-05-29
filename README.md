# ✦ Nyx

**Nyx** est une application de vie personnelle, douce et magique : un sanctuaire numérique qui réunit organisation du quotidien et univers spirituel (lune, rituels, manifestation, journal intime). Tout est personnalisable : couleurs, fonds animés, widgets déplaçables, et une page d'accueil que tu façonnes à ton image.

L'app est entièrement en **React** (Vite + Tailwind CSS) et se déploie en un clic sur **Vercel**.

---

## ✨ Fonctionnalités

- **Code PIN magique** à l'entrée de l'application 🌙
- **Deux univers** avec ambiances distinctes :
  - **Moi** — doux, rosé, cottagecore (to-do, habitudes, objectifs, passions, wishlist, gratitude, mood tracker, journal secret).
  - **Witch** — sombre, mystique (lune, rituels du jour, grimoire, cristaux, herbes, tarot, shifting, voyages astraux, rêves, manifestation).
- **Page d'accueil « Mon Univers »** entièrement éditable (textes, images, raccourcis cliquables).
- **Journal secret** protégé par code PIN, avec deux formats au choix :
  - **Scrapbook** — collage libre : images, gifs, musique, stickers, textes déplaçables.
  - **Note** — page lignée pour écrire comme dans un vrai journal intime.
- **Widgets déplaçables** (gifs, images, citations, notes, musique, horloge lunaire) à placer où tu veux dans chaque section.
- **Personnalisation maximale** depuis le Dashboard : thème, police, couleurs et **fond animé** (pleine lune, prairie cottagecore, ciel étoilé, aurore, braises, neige, papillons…) par section **et** par sous-section.
- **Contenu magique renouvelé chaque jour** : rituel, conseil witch, cristal, herbe, affirmation, citation.
- **Horloge lunaire animée** affichant la vraie phase de la lune.

> ℹ️ Les données sont conservées en mémoire pendant la session (pas de base de données). Pour une sauvegarde persistante entre les visites, il faudra brancher un stockage (localStorage ou backend) — voir la section « Aller plus loin ».

---

## 🚀 Démarrer en local

Pré-requis : **Node.js 18+**.

```bash
# 1. installer les dépendances
npm install

# 2. lancer le serveur de développement
npm run dev
# ouvre l'adresse affichée (par défaut http://localhost:5173)

# 3. créer la version de production
npm run build

# 4. prévisualiser la version de production
npm run preview
```

---

## ▲ Déployer sur Vercel

1. Crée un dépôt sur **GitHub** et pousse-y le contenu de ce dossier :
   ```bash
   git init
   git add .
   git commit -m "✦ Nyx"
   git branch -M main
   git remote add origin https://github.com/TON-UTILISATEUR/nyx.git
   git push -u origin main
   ```
2. Va sur [vercel.com](https://vercel.com) → **Add New Project** → importe ton dépôt GitHub.
3. Vercel détecte automatiquement **Vite**. Garde les réglages par défaut :
   - **Build Command** : `npm run build`
   - **Output Directory** : `dist`
4. Clique **Deploy**. ✦ Ton sanctuaire est en ligne.

---

## 🗂️ Structure du projet

```
nyx/
├── index.html              # point d'entrée HTML
├── package.json            # dépendances et scripts
├── vite.config.js          # configuration Vite
├── tailwind.config.js      # configuration Tailwind
├── postcss.config.js       # configuration PostCSS
├── .gitignore
├── README.md               # ce fichier (lisez-moi)
├── public/                 # fichiers statiques servis tels quels
│   ├── favicon.svg         # icône lune dans l'onglet
│   ├── manifest.json       # config "ajouter à l'écran d'accueil"
│   └── robots.txt
└── src/
    ├── main.jsx            # montage de React
    ├── index.css           # styles Tailwind + safe-area iPhone
    └── App.jsx             # toute l'application
```

---

## 🛠️ Aller plus loin (idées)

- **Sauvegarde persistante** ✅ déjà branchée via Firebase (voir ci-dessous).
- **Notifications** pour les rituels et habitudes.
- **Mode hors-ligne** (PWA + cache).

---

## 🔥 Firebase est déjà branché

L'app utilise **Firebase Authentication** (email + Google) et **Firestore** pour sauvegarder TES données dans le cloud. Tu te connectes une fois, et tu retrouves tout sur Mac, iPhone, iPad — partout où tu ouvres l'app.

La configuration Firebase est dans `src/firebase.js`. Les règles de sécurité Firestore protègent tes données : seul toi (avec ton compte) peux lire/écrire tes propres données.

**Pour réutiliser le projet avec ton propre compte Firebase** : remplace les valeurs dans `src/firebase.js` par ton `firebaseConfig` (Console Firebase → Paramètres du projet → Vos applications).

---

## 💜 Crédits

Conçu comme un espace personnel et créatif. Icônes : [lucide-react](https://lucide.dev). Polices : Google Fonts (Cormorant Garamond, Cinzel, Dancing Script, Caveat, VT323, UnifrakturCook…).

*« Un espace créé pour toi, qui change avec la lune. »*
