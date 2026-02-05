---
name: extract-document
description: Extract text and structure from PDF, PNG, or JPG documents using SoMark OCR
homepage: https://github.com/somark
user-invocable: true
disable-model-invocation: false
command-dispatch: tool
command-tool: somark_extract_sync
metadata:
  openclaw:
    requires:
      bins: []
      env: []
      config: []
---

Extract structured content from documents using SoMark API.

## Supported Formats
- **PDF** - Full document extraction with headers, footers, tables, figures
- **Images** - PNG, JPG with OCR text recognition

## Output Formats
- **Markdown** - Human-readable formatted text
- **JSON** - Structured data with component types

## Usage Examples

```
Extract content from report.pdf
Parse the document invoice.png
Convert test.pdf to markdown
Extract tables from document.pdf as json
```

## Limits
- Max file size: 200MB
- Max pages: 300
- QPS: 1 (one concurrent request)
