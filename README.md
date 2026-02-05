# SoMark Sync Extractor Plugin for OpenCLAW

Extract content from PDF and images using SoMark API.

## Features

- Sync extraction from PDF, PNG, JPG
- Output in Markdown and/or JSON
- CLI command support

## Installation

```bash
# Install OpenCLAW
curl -fsSL https://openclaw.ai/install.sh | bash

# Install plugin
openclaw plugins install ./somark-sync-extractor
```

## Configuration

Add to `~/.openclaw/openclaw.json`:

```json5
{
  plugins: {
    entries: {
      "somark-sync": {
        enabled: true,
        config: {
          api_key: "sk-your-api-key",
          output_format: "both",
          timeout: 120
        }
      }
    }
  }
}
```

## Usage

### AI Agent

```
Extract content from report.pdf
Parse invoice.png to JSON
Convert document to markdown
```

### CLI

```bash
openclaw extract document.pdf
openclaw extract image.png --format markdown
```

## API

| Tool | Description |
|------|-------------|
| `somark_extract` | Extract document content |

## Gateway RPC

```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:18789/v1/somark_sync.status
```

## Links

- [SoMark API](https://somark-api-public.apifox.cn/)
- [OpenCLAW](https://openclaw.ai/)
