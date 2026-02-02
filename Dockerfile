FROM node:20-alpine

# Install dependencies
RUN npm install -g n8n@latest && \
    echo "n8n version: $(n8n --version)"

# Set working directory
WORKDIR /data

# Copy package files
COPY package*.json ./
RUN npm install --force

# Copy application
COPY . .

# Expose port
EXPOSE 5678

# Start n8n with tunnel
CMD ["n8n", "start", "--tunnel"]
