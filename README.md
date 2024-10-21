# KFET KING : Site de gestion de la KFET

Ce site a pour but de gérer les stocks et les ventes de la KFET.

Il permet d'ouvrir une caisse virtuelle, d'y ajouter des articles, de choisir la méthode de paiement et d'enregistrer l'achat.
La liste des produits peut être gérée sur le site ainsi que les stocks de chacun de ceux-ci.

Il intègre aussi un système de gestion de commande, permettant de gérer les commandes de nourritures le midi (pizza, etc.) et de les afficher sur l'autre écran de la KFET.

Ce site est créé avec Next.js en Typescript, et utilise Prisma comme ORM.

## Installation

Prérequis : Node.js installé sur votre machine avec Yarn v1 et une base de données PostgreSQL.

Installer les dépendances Node.js :

    yarn

Créer un fichier .env dans le dossier server et copier le contenu du fichier .env.example dans ce fichier. Modifier les variables d'environnement pour correspondre à votre configuration. Voici l'explication de chaque variable :
- `NEXT_PUBLIC_APP_BASE_URL` : l'adresse du domaine sur lequel le site sera accessible (dans notre cas `https://kfet.bde-esirem.fr`)
- `JWT_SECRET` : 
- `DATABASE_URL` : adresse de la base de données (sous la forme `postgresql://USER:PASSWORD@HOST:PORT/DATABASE`)
- `LOGIN_PASSWORD` : mot de passe pour accéder au site de la KFET
- `ESIPAY_API_URL` : adresse de l'API ESIPAY (dans notre cas `https://esipay.bde-esirem.fr`)
- `ESIPAY_API_KEY` : clé d'API pour ESIPAY
- `ESIPAY_PAYMENT_RECEIVER_ID` : identifiant de la personne recevant les paiements au nom de la KFET
- `ESIPAY_PASSWORD` : mot de passe pour accéder à la page d'ESIPAY sur le site de la KFET

Pour lancer en mode développement (le panel d'administration et le client web ne peuvent pas être utilisés simultanément en mode développement) :

    yarn dev

Pour build et lancer en mode production :

    yarn build
    yarn start -p VOTRE_PORT

## Base de données

Le site de la KFET utilise PostgreSQL en tant que base de données, et il utilise [Prisma](https://www.prisma.io/) comme ORM.

Prisma est un ORM qui permet de gérer les migrations de la base de données. Le fichier `prisma/schema.prisma` contient la structure de la base de données.

À chaque changement de la structure de la base de données, vous devriez créer une migration. Pour créer une migration, vous pouvez utiliser la commande suivante :

    yarn db:migrate

Pour générer des données de test, vous pouvez utiliser la commande suivante :

    yarn db:seed

Pour générer le client Prisma, il faut utiliser la commande suivante :

    yarn prisma generate

Pour déployer les migrations sur la base de données, il faut utiliser la commande suivante :

    yarn prisma migrate deploy

## Détails de fonctionnalitées spécifiques

### Suppression des commandes en status `DONE`

La suppression automatique est un processus compliqué prompt au bug. Son comportement fonctionnel attendu est défini tel que :
    
    En tant que membre de la Kfet, je souhaite que quand je mets une commande dans l'état `Done`, alors celle-ci est supprimée après N minutes sans autre interventions utilisateurs, afin de réduire la charge mental des membres de le Kfet.


```mermaid
sequenceDiagram
    participant M as Membre de la kfet
    participant I as Kfet interface
    participant B as Kfet backend
    participant D as Kfet database
    M->>I: Update commande.status = DONE
    I->>+B: Update commande.status = DONE
    B->>-I: Ok
    Note over B: Wait for n minutes
    loop Every minute
        I-->I: Reload les commandes
    end
    B->>D: DELETE FROM commande WHERE id = commande.status;
```

Sachant qu'il faut prendre en compte le fait que une commande peut retourner à un état précédent, et devrait dans ce cas être retirée des listes. Et que lors du redémarrage du serveur (e.g : si plantage en prod ou mise à jour), les lignes concernées soient biens mises comme devant être supprimées.


```mermaid
sequenceDiagram
    participant M as Membre de la kfet
    participant I as Kfet interface
    participant B as Kfet backend
    participant D as Kfet database
    M->>I: Update commande.status = DONE
    I->>+B: Update commande.status = DONE
    B->>-I: Ok
    Note over B: Wait for n minutes
    M->>I: Update commande.status = IN_PROGRESS
    I->>+B: Update commande.status = IN_PROGRESS
    B->>-I: Ok
    Note over B: Cancels deletion order
    loop Every minute
        I-->I: Reload les commandes
    end
```

Pour le point des lignes à prendre en compte même quand plantage, pour le moment, pas de solutions misent en place. Les lignes sont marquées comme "deleted" en front et nécessitent une suppression manuel.

## Crédits

- [**Gauthier THOMAS**](https://github.com/gauthier-th) : création du projet
- [**Arno BIDET**](https://github.com/ArnoBidet) : reprise du projet, passage à Docker, chantier de modification d'octobre 2024
- [**Ewan VIDAL**](https://github.com/ewanvidal) : contribution au chantier de modification d'octobre 2024

## Licence

Le site de la KFET est distribué sous licence MIT. Voir le fichier `LICENSE` pour plus d'informations.