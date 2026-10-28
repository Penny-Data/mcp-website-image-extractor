FROM node:22-alpine
WORKDIR /app
RUN npm install -g @apify/actors-mcp-server
ENV ACTORS=pennydata/website-image-extractor
# the user supplies their own Apify token at runtime
ENTRYPOINT ["sh", "-c", "exec actors-mcp-server --actors \"$ACTORS\""]
