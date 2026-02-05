# n8n Render Deployment

Configuration optimisée pour Render avec résolution des problèmes IPv6.

## Modifications apportées

### 1. Dockerfile simplifié

- Utilisation de l'image officielle `n8nio/n8n:latest`
- Configuration IPv4 forcée avec `NODE_OPTIONS="--dns-result-order=ipv4first"`
- Suppression des dépendances inutiles

### 2. Configuration PostgreSQL

- Utilisation du connection pooler Supabase (IPv4)
- SSL activé et configuré correctement
- Pool size réduit à 2 pour le tier gratuit

### 3. Variables d'environnement clés

- `DB_POSTGRESDB_SSL_ENABLED=true`
- `DB_POSTGRESDB_SSL_REJECT_UNAUTHORIZED=false`
- `NODE_OPTIONS="--dns-result-order=ipv4first"`

## Déploiement

1. Assurez-vous que le mot de passe PostgreSQL est défini dans Render
2. Déployez avec `git push origin main`
3. Vérifiez les logs dans le dashboard Render

## Résolution des problèmes

L'erreur `connect ENETUNREACH` était causée par une tentative de connexion IPv6.
Le forçage IPv4 et l'utilisation du pooler Supabase résolvent ce problème.
