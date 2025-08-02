# 🎧 Spicetify Extract Stems — Extension + Serveur local

Cette extension Spicetify ajoute un bouton “Extraire les stems” à l'interface Spotify, permettant de séparer les pistes audio (voix, batterie, basse, etc.) d’un morceau en cours de lecture.  
Elle utilise un serveur local Python basé sur Demucs de Facebook Research.

---

## 🚀 Fonctionnement

- L'utilisateur clique sur le bouton "Extraire les stems" dans Spotify.
- L'extension envoie le titre/artiste au serveur local.
- Le serveur télécharge automatiquement la piste via YouTube (yt-dlp).
- Il la sépare en stems avec Demucs.
- Un lien s'affiche pour télécharger les stems (voix, batterie, basse, etc.)

---

## ⚙️ Installation

### Étape 1 — Installer automatiquement le serveur

📌 Ouvre PowerShell en tant qu'administrateur (clic droit sur PowerShell > "Exécuter en tant qu’administrateur").

Colle ensuite la commande disponible dans ce fichier :

→ https://raw.githubusercontent.com/noahhrcy/stem-extraction-server/main/how_to_install.txt

Elle va :
- Installer Python, Git, ffmpeg, yt-dlp si nécessaire
- Créer un environnement virtuel Python
- Installer Flask, torchaudio, Demucs
- Télécharger le modèle htdemucs
- Générer un script run.ps1 pour lancer le serveur facilement

---

### Étape 2 — Lancer le serveur

Après l'installation, lance le serveur via cette commande dans PowerShell :

powershell -ExecutionPolicy Bypass -File "$env:USERPROFILE\Documents\demucs-server\run.ps1"

Le serveur sera alors accessible à l'adresse :

http://localhost:5000

---

### Étape 3 — Utiliser l’extension dans Spotify

Une fois l’extension installée dans Spicetify :
- Ouvre Spotify
- Clique sur le bouton “Extraire les stems” dans les contrôles du lecteur
- Une notification s’affichera avec un lien vers les fichiers séparés

---

## 🧪 Si le serveur n'est pas lancé…

L’extension détecte automatiquement si le serveur est inaccessible et propose un lien d’installation.  
Le bouton se transformera en “Installer le serveur Demucs 🛠️”.

---

## 📂 Répertoires générés

Les stems sont stockés dans :

%USERPROFILE%\Documents\demucs-server\stems\...

Chaque morceau crée un sous-dossier contenant :
- drums.wav
- bass.wav
- other.wav
- vocals.wav
- mixture.wav (mix original)

---

## 📌 Remarques

- Le script requiert Python ≥ 3.8
- Le modèle htdemucs peut prendre plusieurs secondes/minutes selon la durée du morceau
- Le traitement peut être intensif en CPU/RAM
- Le serveur ne fonctionne pas sur hébergement distant public (traitement trop lourd, dépendances natives, yt-dlp)

---

## ✅ À venir (ou à faire toi-même)

- Option pour zipper les stems automatiquement
- Script .bat universel pour double-clic
- Interface web de pré-écoute ou visualisation des stems
- Amélioration UI dans Spotify (icônes, état du serveur, etc.)
