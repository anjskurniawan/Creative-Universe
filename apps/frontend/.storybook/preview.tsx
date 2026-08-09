import type { Preview } from "@storybook/nextjs-vite";
import "@react-spectrum/s2/page.css";
import "../src/styles/spectrum-fonts.css";

const preview: Preview = {
  globalTypes: {
    spectrumColorScheme: {
      description: "Color scheme untuk QA component React Spectrum S2.",
      defaultValue: "light",
      toolbar: {
        icon: "mirror",
        dynamicTitle: true,
        items: [
          { value: "light", title: "Spectrum Light" },
          { value: "dark", title: "Spectrum Dark" },
        ],
      },
    },
  },
  decorators: [
    (Story, context) => {
      if (typeof document !== "undefined") {
        if (context.title.startsWith("Spectrum/")) {
          document.documentElement.dataset.colorScheme = context.globals.spectrumColorScheme;
        } else {
          delete document.documentElement.dataset.colorScheme;
        }
      }

      return <Story />;
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: "todo",
    },
  },
};

export default preview;
