# Guide de mise à jour n8n

## Option 1 : Mise à jour automatique (recommandé)

Le Dockerfile utilise déjà `n8n@latest`, donc chaque déploiement utilisera la dernière version.

## Option 2 : Version spécifique

Modifiez le Dockerfile :

```dockerfile
RUN npm install -g n8n@1.60.0  # Remplacez par la version souhaitée
```

## Option 3 : Mise à jour manuelle

1. **Vérifier la version actuelle :**

   ```bash
   # Connectez-vous au conteneur Render
   # Dans les logs, cherchez : "n8n version: X.X.X"
   ```

2. **Mettre à jour le Dockerfile :**

   ```dockerfile
   RUN npm install -g n8n@1.60.0  # Nouvelle version
   ```

3. **Forcer le rebuild :**
   - Faites un petit changement (ex: ajouter un commentaire)
   - Push sur GitHub
   - Render rebuild automatiquement

## Versions recommandées

- **Stable :** `n8n@1.60.0` (dernière stable)
- **Latest :** `n8n@latest` (toujours à jour)
- **Spécifique :** `n8n@1.59.3` (version testée)

## Vérifier les versions

```bash
# Versions disponibles
npm view n8n versions --json

# Dernière version
npm view n8n version
```

## Notes importantes

- Les mises à jour peuvent nécessiter une migration de base de données
- Testez toujours sur une version de développement d'abord
- Sauvegardez vos workflows avant les mises à jour
- Consultez les [release notes n8n](https://github.com/n8n-io/n8n/releases)
