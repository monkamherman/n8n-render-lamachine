# Dockerfile pour n8n sur Railway avec Supabase
FROM node:18-alpine

# Définir le répertoire de travail
WORKDIR /data

# Installer les dépendances système
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    musl-dev \
    giflib-dev \
    pixman-dev \
    pangomm-dev \
    libjpeg-turbo-dev \
    freetype-dev

# Copier les fichiers package
COPY package.json bun.lock* ./

# Installer bun si nécessaire et les dépendances
RUN npm install -g bun && \
    bun install --frozen-lockfile --production

# Copier le reste du code
COPY . .

# Créer les répertoires nécessaires pour n8n
RUN mkdir -p /data/.n8n && \
    chown -R node:node /data

# Changer vers l'utilisateur node
USER node

# Exposer le port n8n
EXPOSE 5678

# Variables d'environnement par défaut
ENV N8N_HOST=0.0.0.0
ENV N8N_PORT=5678
ENV N8N_PROTOCOL=https
ENV NODE_ENV=production
ENV N8N_BASIC_AUTH_ACTIVE=false
ENV N8N_EXECUTION_DATA_PRUNE=true
ENV N8N_EXECUTION_DATA_MAX_AGE=168
ENV N8N_METRICS=true
ENV N8N_DIAGNOSTICS_ENABLED=false
ENV N8N_USER_MANAGEMENT_DISABLED=true
ENV GENERIC_TIMEZONE=Europe/Paris
ENV TZ=Europe/Paris

# Point de montage pour les données n8n
VOLUME ["/data/.n8n"]

# Commande de démarrage
CMD ["npx", "n8n", "start"]
