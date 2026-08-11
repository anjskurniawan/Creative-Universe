import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

import { playwright } from '@vitest/browser-playwright';

const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  resolve: {
    alias: {
      "@react-spectrum/s2/style": path.resolve(dirname, "src/test/spectrum-style-mock.ts"),
    },
  },
  optimizeDeps: {
    include: [
      "@react-spectrum/s2/ActionButtonGroup",
      "@react-spectrum/s2/ActionButton",
      "@react-spectrum/s2/ActionMenu",
      "@react-spectrum/s2/Avatar",
      "@react-spectrum/s2/AvatarGroup",
      "@react-spectrum/s2/Badge",
      "@react-spectrum/s2/Button",
      "@react-spectrum/s2/SideNav",
      "@react-spectrum/s2/Toast",
      "@react-spectrum/s2/Breadcrumbs",
      "@react-spectrum/s2/ButtonGroup",
      "@react-spectrum/s2/CardView",
      "@react-spectrum/s2/Checkbox",
      "@react-spectrum/s2/CheckboxGroup",
      "@react-spectrum/s2/ColorArea",
      "@react-spectrum/s2/ColorField",
      "@react-spectrum/s2/ColorSlider",
      "@react-spectrum/s2/ColorSwatch",
      "@react-spectrum/s2/ColorSwatchPicker",
      "@react-spectrum/s2/ColorWheel",
      "@react-spectrum/s2/ContextualHelp",
      "@react-spectrum/s2/DateField",
      "@react-spectrum/s2/DatePicker",
      "@react-spectrum/s2/DateRangePicker",
      "@react-spectrum/s2/Dialog",
      "@react-spectrum/s2/Disclosure",
      "@react-spectrum/s2/Divider",
      "@react-spectrum/s2/DropZone",
      "@react-spectrum/s2/Form",
      "@react-spectrum/s2/IllustratedMessage",
      "@react-spectrum/s2/Image",
      "@react-spectrum/s2/LabeledValue",
      "@react-spectrum/s2/Link",
      "@react-spectrum/s2/LinkButton",
      "@react-spectrum/s2/ListView",
      "@react-spectrum/s2/Menu",
      "@react-spectrum/s2/Meter",
      "@react-spectrum/s2/NumberField",
      "@react-spectrum/s2/Picker",
      "@react-spectrum/s2/Popover",
      "@react-spectrum/s2/ProgressBar",
      "@react-spectrum/s2/ProgressCircle",
      "@react-spectrum/s2/Provider",
      "@react-spectrum/s2/RadioGroup",
      "@react-spectrum/s2/RangeCalendar",
      "@react-spectrum/s2/RangeSlider",
      "@react-spectrum/s2/SearchField",
      "@react-spectrum/s2/SegmentedControl",
      "@react-spectrum/s2/SelectBoxGroup",
      "@react-spectrum/s2/Skeleton",
      "@react-spectrum/s2/Slider",
      "@react-spectrum/s2/StatusLight",
      "@react-spectrum/s2/Switch",
      "@react-spectrum/s2/TableView",
      "@react-spectrum/s2/Tabs",
      "@react-spectrum/s2/TagGroup",
      "@react-spectrum/s2/TextArea",
      "@react-spectrum/s2/TimeField",
      "@react-spectrum/s2/ToggleButton",
      "@react-spectrum/s2/ToggleButtonGroup",
      "@react-spectrum/s2/Tooltip",
      "@react-spectrum/s2/TreeView",
      "@react-spectrum/s2/style",
      "@react-spectrum/s2/icons/Copy",
      "@react-spectrum/s2/icons/Cut",
      "@react-spectrum/s2/icons/Paste",
    ],
  },
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({ configDir: path.join(dirname, '.storybook') }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});
