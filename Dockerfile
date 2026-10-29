FROM node:22-alpine
LABEL io.modelcontextprotocol.server.name="io.github.Penny-Data/mcp-website-image-extractor"
LABEL org.opencontainers.image.source="https://github.com/Penny-Data/mcp-website-image-extractor"
WORKDIR /app
COPY server.mjs package.json ./
# APIFY_TOKEN is only needed when a tool is called: docker run -i -e APIFY_TOKEN=... <image>
ENTRYPOINT ["node", "/app/server.mjs"]
