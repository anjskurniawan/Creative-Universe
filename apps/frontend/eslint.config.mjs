import { defineConfig, globalIgnores } from "eslint/config";
import boundaries from "eslint-plugin-boundaries";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["src/**/*.{js,jsx,ts,tsx}"],
    plugins: { boundaries },
    settings: {
      "boundaries/elements": [
        { type: "app", pattern: "src/app", partialMatch: false },
        { type: "feature", pattern: "src/features/*", partialMatch: false, capture: ["domain"] },
        { type: "component", pattern: "src/components", partialMatch: false },
        { type: "core", pattern: "src/core", partialMatch: false },
        { type: "provider", pattern: "src/providers/*", partialMatch: false, capture: ["provider"] },
        { type: "hook", pattern: "src/hooks/*", partialMatch: false, capture: ["hook"] },
        { type: "lib", pattern: "src/lib", partialMatch: false },
        { type: "style", pattern: "src/styles", partialMatch: false },
        { type: "type", pattern: "src/types", partialMatch: false },
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
              allow: { to: { element: { types: { anyOf: ["app", "feature", "component", "core", "provider", "hook", "lib", "style", "type"] } } } },
            },
            {
              from: { element: { type: "feature" } },
              allow: [
                { to: { element: { type: "feature", captured: { domain: "{{ from.element.captured.domain }}" } } } },
                { to: { element: { types: { anyOf: ["component", "core", "hook", "lib", "style", "type"] } } } },
              ],
            },
            {
              from: { element: { type: "component" } },
              allow: { to: { element: { types: { anyOf: ["component", "core", "hook", "lib", "style", "type"] } } } },
            },
            {
              from: { element: { type: "core" } },
              allow: { to: { element: { types: { anyOf: ["core", "lib", "type"] } } } },
            },
            {
              from: { element: { type: "provider" } },
              allow: { to: { element: { types: { anyOf: ["provider", "component", "core", "hook", "lib", "style", "type"] } } } },
            },
            {
              from: { element: { type: "hook" } },
              allow: { to: { element: { types: { anyOf: ["hook", "provider", "core", "lib", "type"] } } } },
            },
            {
              from: { element: { type: "lib" } },
              allow: { to: { element: { types: { anyOf: ["lib", "type"] } } } },
            },
            {
              from: { element: { type: "style" } },
              allow: { to: { element: { type: "style" } } },
            },
            {
              from: { element: { type: "type" } },
              allow: { to: { element: { type: "type" } } },
            },
          ],
        },
      ],
    },
  },
  // Existing source debt is isolated to exact files and rules so new violations
  // fail immediately while each owning restructuring phase removes its exception.
  {
    files: [
      "src/app/creative-report/creative-agent/edit/use-edit-member.ts",
      "src/app/creative-report/option/use-aspects-configuration.ts",
      "src/app/odds/detail/dummy/_components/DummyOddsDetailProvider/DummyOddsDetailProvider.tsx",
      "src/app/creative-report/performa/_components/HrdRulesFooter/HrdRulesFooter.tsx",
      "src/features/notifications/components/NotificationsPageContent/NotificationsPageContent.tsx",
      "src/components/ui/form/DropdownMenu/DropdownMenu.tsx",
      "src/components/ui/Modal/Modal.tsx",
      "src/features/odds/components/OddsTaskDetail/OddsTaskDetail.tsx",
    ],
    rules: {
      "react-hooks/set-state-in-effect": "off",
    },
  },
  {
    files: [
      "src/app/developer/test/_components/DeveloperTestPage/DeveloperTestPage.tsx",
      "src/app/odds/new/_components/NewOddsTaskPage/NewOddsTaskPage.tsx",
      "src/app/odds/_components/OddsPage/OddsPage.tsx",
      "src/features/auth/components/Portal/Auth/Auth.logic.ts",
      "src/features/odds/api/index.ts",
      "src/app/odds/_components/OddsPage/ScheduleConfig/ScheduleConfig.tsx",
    ],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  {
    files: ["src/app/odds/_components/OddsPage/OddsPage.tsx"],
    rules: {
      "react-hooks/purity": "off",
      "react-hooks/refs": "off",
      "react/jsx-key": "off",
    },
  },
  {
    files: ["src/features/odds/components/OddsTaskDetail/OddsTaskDetail.tsx"],
    rules: {
      "react-hooks/preserve-manual-memoization": "off",
    },
  },
  {
    files: [
      "src/features/odds/components/OddsRequestBuilder/BriefImportantMatrixStep/BriefImportantMatrixStep.tsx",
      "src/app/odds/_components/OddsPage/ScheduleConfig/ScheduleConfig.tsx",
    ],
    rules: {
      "react/no-unescaped-entities": "off",
    },
  },
  {
    files: ["src/app/odds/_components/OddsPage/ScheduleConfig/ScheduleConfig.tsx"],
    rules: {
      "react-hooks/immutability": "off",
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
