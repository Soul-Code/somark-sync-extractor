/**
 * SoMark Sync Extractor Plugin for OpenCLAW
 */

import type { OpenClawPluginApi } from "openclaw/plugin-sdk";
import { readFileSync } from "fs";
import { basename } from "path";

const API_URL = "https://somark.soulcode.cn/api/v1/extract/acc_sync";

const plugin = {
  id: "somark-sync",
  name: "SoMark Sync Extractor",
  description: "Extract content from PDF and images using SoMark API",
  configSchema: {
    type: "object",
    properties: {
      api_key: {
        type: "string",
        description: "SoMark API key (sk-...)",
      },
      output_format: {
        type: "string",
        enum: ["markdown", "json", "both"],
        default: "both",
      },
      timeout: {
        type: "integer",
        default: 120,
      },
    },
    required: ["api_key"],
    additionalProperties: false,
  },
  register(api: OpenClawPluginApi) {
    // Register tool
    api.registerTool(
      (ctx) => {
        const config = ctx.config as {
          api_key: string;
          output_format: "markdown" | "json" | "both";
          timeout: number;
        };

        return api.runtime.tools.create({
          name: "somark_extract",
          description:
            "Extract text and structure from PDF, PNG, or JPG documents. Returns markdown and/or JSON output.",
          parameters: {
            type: "object",
            properties: {
              file_path: {
                type: "string",
                description: "Path to the document file",
              },
              format: {
                type: "string",
                enum: ["markdown", "json", "both"],
                default: config.output_format,
              },
            },
            required: ["file_path"],
          },
          handler: async (args) => {
            const { file_path, format = config.output_format } = args;
            const formats = format === "both" ? ["markdown", "json"] : [format];

            try {
              const fileBuffer = readFileSync(file_path);
              const file = new Blob([fileBuffer]);

              const FormData = (await import("form-data")).default;
              const form = new FormData();
              form.append("file", file, basename(file_path));
              form.append("output_formats", JSON.stringify(formats));
              form.append("api_key", config.api_key);

              const response = await fetch(API_URL, {
                method: "POST",
                body: form,
                signal: AbortSignal.timeout(config.timeout * 1000),
              });

              if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
              }

              const result = await response.json();
              return {
                success: true,
                file: basename(file_path),
                markdown: result.markdown || "",
                json: result.json || "",
              };
            } catch (error) {
              return {
                success: false,
                error: error instanceof Error ? error.message : String(error),
              };
            }
          },
        });
      },
      { names: ["somark_extract"] },
    );

    // Register CLI
    api.registerCli(
      ({ program }) => {
        program
          .command("extract <file>")
          .description("Extract content from a document")
          .option("-f, --format <format>", "Output format (markdown|json|both)")
          .action(async (file, opts) => {
            const result = await api.runtime.tools.somark_extract({
              file_path: file,
              format: opts.format as "markdown" | "json" | "both",
            });
            console.log(JSON.stringify(result, null, 2));
          });
      },
      { commands: ["extract"] },
    );
  },
};

export default plugin;
