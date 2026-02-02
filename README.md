# n8n-render (Vercel + Supabase)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/votre-repo/n8n-vercel-supabase)

### How to install n8n on Vercel with Supabase database

#### Prérequis :

1. Un compte Supabase (créé gratuitement sur supabase.com)
2. Un compte Vercel

#### Étapes d'installation :

1. **Configurer Supabase :**
   - Créez un nouveau projet sur Supabase
   - Allez dans Settings > Database
   - Copiez les informations de connexion (host, port, user, password)

2. **Déployer sur Vercel :**
   - Cliquez sur le bouton "Deploy with Vercel" ci-dessus
   - Connectez-vous à votre compte Vercel
   - Importez le repository

3. **Configurer les variables d'environnement :**
   - Allez dans les paramètres de votre projet Vercel > Environment Variables
   - Ajoutez les variables suivantes :
     ```
     DB_TYPE=postgresdb
     DB_POSTGRESDB_HOST=votre-projet.supabase.co
     DB_POSTGRESDB_DATABASE=postgres
     DB_POSTGRESDB_PORT=5432
     DB_POSTGRESDB_USER=postgres
     DB_POSTGRESDB_PASSWORD=votre-mot-de-passe-supabase
     GENERIC_TIMEZONE=Europe/Paris
     TZ=Europe/Paris
     N8N_DEFAULT_LOCALE=fr
     N8N_ENCRYPTION_KEY=votre-clé-personnalisée
     ```

4. **Finaliser le déploiement :**
   - Déployez votre projet
   - Une fois déployé, copiez l'URL de votre projet Vercel
   - Ajoutez la variable `WEBHOOK_URL` avec votre URL Vercel
   - Redéployez pour appliquer les changements

5. **Accéder à n8n :**
   - Visitez votre URL Vercel pour accéder à l'interface n8n

#### Avantages de cette configuration :

- **Gratuit** : Vercel offre un plan généreux, Supabase aussi
- **Serverless** : Pas de gestion de serveur
- **Scalable** : Monte en charge automatiquement
- **Performant** : CDN mondial de Vercel

#### Limites :

- **Fonctions serverless** : Timeout de 30 secondes maximum
- **Base de données** : Limites du plan gratuit Supabase
- **Stockage** : Limité sur les plans gratuits

This instance will be free with Vercel and Supabase free tiers.

Created by HERMAN MOUKAM for La Machine. Adapted for Vercel + Supabase.

mot de passe:YjxBJtgTwSlBxnSQ
