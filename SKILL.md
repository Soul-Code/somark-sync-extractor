---
name: somark-extract
description: Extract content from PDF and images using SoMark API
---

# SoMark Extract

Extract structured content from documents using SoMark API.

## Supported Formats
- **PDF** - Full document extraction with headers, footers, tables, figures
- **Images** - PNG, JPG with OCR text recognition

## Output Formats
- **Markdown** - Human-readable formatted text
- **JSON** - Structured data with component types

## Usage

```bash
# Using CLI
openclaw extract document.pdf
openclaw extract image.png --format markdown
```

## Limits
- Max file size: 200MB
- Max pages: 300
- QPS: 1 (one concurrent request)
