import { defineConfig, globalIgnores } from "eslint/config";
import boundaries from "eslint-plugin-boundaries";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: {
      boundaries,
    },
    settings: {
      "boundaries/elements": [
        { type: "app", pattern: "src/app/**/*" },
        { type: "components", pattern: "src/components/**/*" },
        { type: "features", pattern: "src/features/**/*" },
        { type: "core", pattern: "src/core/**/*" },
        { type: "providers", pattern: "src/providers/**/*" },
        { type: "hooks", pattern: "src/hooks/**/*" },
        { type: "lib", pattern: "src/lib/**/*" },
        { type: "styles", pattern: "src/styles/**/*" },
        { type: "types", pattern: "src/types/**/*" },
      ],
    },
    rules: {
      "boundaries/dependencies": [
        "error",
        {
          default: "disallow",
          policies: [
            {
              from: { element: { type: "app" } },
              allow: {
                to: {
                  element: {
                    types: [
                      "app",
                      "components",
                      "features",
                      "core",
                      "providers",
                      "hooks",
                      "lib",
                      "styles",
                      "types",
                    ],
                  },
                },
              },
            },
            {
              from: { element: { type: "features" } },
              allow: {
                to: {
                  element: {
                    types: ["components", "core", "hooks", "lib", "types"],
                  },
                },
              },
            },
            {
              from: { element: { type: "components" } },
              allow: {
                to: {
                  element: {
                    types: ["components", "core", "hooks", "lib", "types"],
                  },
                },
              },
            },
            {
              from: { element: { type: "providers" } },
              allow: {
                to: {
                  element: {
                    types: ["providers", "core", "hooks", "lib", "types"],
                  },
                },
              },
            },
            {
              from: { element: { type: "hooks" } },
              allow: {
                to: {
                  element: {
                    types: ["hooks", "core", "lib", "types"],
                  },
                },
              },
            },
            {
              from: { element: { type: "lib" } },
              allow: {
                to: { element: { types: ["lib", "types"] } },
              },
            },
            {
              from: { element: { type: "core" } },
              allow: {
                to: { element: { types: ["core", "lib", "types"] } },
              },
            },
            {
              from: { element: { type: "styles" } },
              allow: {
                to: { element: { types: ["styles"] } },
              },
            },
            {
              from: { element: { type: "types" } },
              allow: {
                to: { element: { types: ["types"] } },
              },
            },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
