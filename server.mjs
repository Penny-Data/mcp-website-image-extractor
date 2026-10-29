// Token-free MCP stdio server: tools/list works without APIFY_TOKEN; the token is only needed at tools/call.
import { createInterface } from 'node:readline';

const ACTOR = 'pennydata~website-image-extractor';
const TOOL = {
  name: 'extract_website_images',
  description: 'Extract all images from web pages (URL, alt text, size, type) with the Apify actor pennydata/website-image-extractor. $0.002 per image, billed to your Apify account. Modes: images, files (bulk download), brand (favicons, logos, colours).',
  inputSchema: {
    type: 'object',
    properties: {
      mode: { type: 'string', enum: ['images', 'files', 'brand'], default: 'images', description: 'images = image URLs from pages; files = bulk file downloader; brand = favicons, logos, top colours per site.' },
      startUrls: { type: 'array', description: 'Public web pages to read.', items: { type: 'object', required: ['url'], properties: { url: { type: 'string', format: 'uri' } } } },
      maxPagesPerStart: { type: 'integer', minimum: 1, maximum: 50, default: 1, description: 'Pages per start URL (follows same-site links above 1).' },
      minWidth: { type: 'integer', minimum: 0, default: 0, description: 'Skip images narrower than this (px).' },
      sameDomainOnly: { type: 'boolean', default: false, description: 'Keep only images on the same site.' },
      includeCssBackgrounds: { type: 'boolean', default: false, description: 'Also collect CSS background images.' },
      maxImages: { type: 'integer', minimum: 1, maximum: 100000, default: 1000, description: 'Stop after this many image rows (caps cost).' },
    },
    required: ['startUrls'],
  },
};

const send = (m) => process.stdout.write(JSON.stringify({ jsonrpc: '2.0', ...m }) + '\n');
const text = (t, isError = false) => ({ content: [{ type: 'text', text: t }], isError });

async function callTool(args) {
  const token = process.env.APIFY_TOKEN;
  if (!token) return text('APIFY_TOKEN is not set. Create a free token at https://console.apify.com/settings/integrations and set it in the server env.', true);
  const r = await fetch(`https://api.apify.com/v2/acts/${ACTOR}/run-sync-get-dataset-items?format=json`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
    body: JSON.stringify(args || {}),
  });
  const body = await r.text();
  return text(r.ok ? body : `Apify API error ${r.status}: ${body.slice(0, 500)}`, !r.ok);
}

async function handle(msg) {
  const { id, method, params } = msg;
  if (id === undefined) return; // notifications
  if (method === 'initialize') {
    return send({ id, result: { protocolVersion: params?.protocolVersion || '2024-11-05', capabilities: { tools: {} }, serverInfo: { name: 'mcp-website-image-extractor', version: '1.1.0' } } });
  }
  if (method === 'tools/list') return send({ id, result: { tools: [TOOL] } });
  if (method === 'tools/call') {
    if (params?.name !== TOOL.name) return send({ id, error: { code: -32602, message: `Unknown tool ${params?.name}` } });
    try { return send({ id, result: await callTool(params.arguments) }); }
    catch (e) { return send({ id, result: text(`Request failed: ${e.message}`, true) }); }
  }
  if (method === 'ping') return send({ id, result: {} });
  send({ id, error: { code: -32601, message: `Method not found: ${method}` } });
}

createInterface({ input: process.stdin }).on('line', (l) => { try { handle(JSON.parse(l)); } catch {} });
