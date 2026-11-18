# TP 1:

## Question 2:
```
package.json : ce fichier ressemble à la carte d'identité du projet. Il est écrit par le
développeur et contient les métadonnées (nom, version, licence et description), les scripts à lancer
(build, test, lint…) et la liste des dépendances, séparées en `dependencies` (nécessaires
à l'exécution) et `devDependencies` (utiles seulement au développement, comme TypeScript
ou ESLint). Les versions y sont indiquées sous forme de plages (ex. ^5.3.0), pas de
manière exacte.

package-lock.json : ce fichier est généré automatiquement par npm et ne se modifie pas à
la main. Il enregistre la version exacte de chaque dépendance installée, y compris les
dépendances des dépendances, avec leur lien de téléchargement et une empreinte
d'intégrité. Il garantit que toute personne (ou serveur) qui installe le projet obtient
exactement les mêmes versions. C'est pourquoi on le versionne dans Git.
```

## Question 3:

```
Après avoir lancé `npm install systeminformation`, `git status` indique que
package.json et package-lock.json ont été modifiés.
`git diff package.json` montre qu'une nouvelle section `dependencies` a été créée :
avant l'installation, le dépôt ne contenait que des `devDependencies`.
package-lock.json enregistre la version exacte installée. Le dossier node_modules/
n'apparaît pas dans Git car il est ignoré par le .gitignore : il faut donc commiter
les deux fichiers.

- dependencies : les dépendances nécessaires à l'exécution de l'application en production.
- devDependencies : les dépendances utilisées uniquement pendant le développement,
  par exemple pour compiler (TypeScript), vérifier le code (ESLint) ou le tester (Jest).
```