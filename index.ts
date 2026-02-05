/**
 * SoMark Sync Extractor Plugin for OpenCLAW
 *
 * Extract text and structure from PDF and images using SoMark API.
 */

import type { OpenClawApi } from "openclaw";
import { readFileSync } from "fs";
import { basename } from "path";

interface PluginConfig {
  api_key: string;
  output_format: "markdown" | "json" | "both";
  timeout: number;
}

const API_URL = "https://somark.soulcode.cn/api/v1/extract/acc_sync";

export default function somarkSyncPlugin(api: OpenClawApi) {
  const config = api.config.get<PluginConfig>({
    api_key: "",
    output_format: "both",
    timeout: 120,
  });

  // =============================================================================
  // Tool: Extract Document
  // =============================================================================
  api.registerTool({
    name: "somark_extract",
    description:
      "Extract text and structure from PDF, PNG, or JPG documents. " +
      "Returns markdown and/or JSON output.",
    parameters: {
      type: "object",
      properties: {
        file_path: {
          type: "string",
          description: "Path to the document file (PDF, PNG, JPG)",
        },
        format: {
          type: "string",
          enum: ["markdown", "json", "both"],
          default: "both",
          description: "Output format",
        },
      },
      required: ["file_path"],
      additionalProperties: false,
    },
    handler: async (args) => {
      const { file_path, format = config.output_format } = args;
      const formats = format === "both" ? ["markdown", "json"] : [format];

      try {
        const fileBuffer = readFileSync(file_path);
        const file = new Blob([fileBuffer]);

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
          const error = await response.text();
          throw new Error(`API error: ${response.status} - ${error}`);
        }

        const result = await response.json();

        return {
          success: true,
          file: basename(file_path),
          markdown: result.markdown || result.data?.markdown || "",
          json: result.json || result.data?.json || "",
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : String(error),
          file: basename(file_path),
        };
      }
    },
  });

  // =============================================================================
  // CLI Command
  // =============================================================================
  api.registerCli(
    ({ program }) => {
      program
        .command("extract <file>")
        .description("Extract content from a document")
        .option("-f, --format <format>", "Output format (markdown|json|both)")
        .action(async (file, opts) => {
          const result = await api.tools.somark_extract({
            file_path: file,
            format: opts.format as "markdown" | "json" | "both",
          });
          console.log(JSON.stringify(result, null, 2));
        });
    },
    { commands: ["extract"] }
  );

  // =============================================================================
  // Gateway RPC
  // =============================================================================
  api.registerGatewayMethod("somark_sync.status", ({ respond }) => {
    respond(true, {
      plugin: "somark-sync",
      status: "running",
      config: {
        has_api_key: !!config.api_key,
        output_format: config.output_format,
      },
    });
  });

  console.log("[SoMark Sync Plugin] Loaded!");
}
