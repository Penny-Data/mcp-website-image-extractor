# mcp-website-image-extractor

MCP server that lets AI agents (Claude Desktop, Cursor, VS Code, any MCP client) extract and download all images from a web page. It runs the Apify Store actor [pennydata/website-image-extractor](https://apify.com/pennydata/website-image-extractor) through a small dependency-free stdio server (`server.mjs`). `tools/list` works without a token; `APIFY_TOKEN` is only needed when the tool is called.

## Tools exposed

- `extract_website_images`: give it page URLs, get back the images found on each page (URL, alt text, size, type). Modes: images, files, brand.

## Setup

1. Create a free Apify account and copy your API token: https://console.apify.com/settings/integrations
2. Add the server to your client. The token is passed as an environment variable and is never stored in this repo.

Claude Desktop (`claude_desktop_config.json`) or Cursor (`~/.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "website-image-extractor": {
      "command": "node",
      "args": ["/path/to/server.mjs"],
      "env": { "APIFY_TOKEN": "<your Apify token>" }
    }
  }
}
```

Docker:

```bash
docker build -t mcp-website-image-extractor .
docker run -i --rm -e APIFY_TOKEN=<your Apify token> mcp-website-image-extractor
```

## Pricing

Actor runs are billed by Apify pay-per-event; see https://apify.com/pennydata/website-image-extractor.

I built this and earn from its runs. Written with AI assistance (Claude).
