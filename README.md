# mcp-website-image-extractor

MCP server that extracts all images from any web page, using the Apify actor [pennydata/website-image-extractor](https://apify.com/pennydata/website-image-extractor). It runs through the official Apify MCP server, so you need your own Apify account and API token.

## Run

```
npx @apify/actors-mcp-server --actors pennydata/website-image-extractor
```

Set `APIFY_TOKEN` in your shell to your own token (Apify Console > Settings > Integrations). Runs are billed to your Apify account at the actor's pay-per-event price.

## Claude Desktop / Cursor config

```json
{
  "mcpServers": {
    "website-image-extractor": {
      "command": "npx",
      "args": ["-y", "@apify/actors-mcp-server", "--actors", "pennydata/website-image-extractor"],
      "env": { "APIFY_TOKEN": "<your Apify API token>" }
    }
  }
}
```

## Actor page

https://apify.com/pennydata/website-image-extractor

I built this and earn from its runs. Written with AI assistance (Claude).
