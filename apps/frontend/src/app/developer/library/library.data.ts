import { authComponents } from "./data/auth/library.data";
import { creativeAiComponents } from "./data/creative-ai/library.data";
import { creativeReportComponents } from "./data/creative-report/library.data";
import { dashboardComponents } from "./data/dashboard/library.data";
import { docsComponents } from "./data/docs/library.data";
import { feedbackComponents } from "./data/feedback/library.data";
import { landingComponents } from "./data/landing/library.data";
import { layoutComponents } from "./data/layout/library.data";
import { loginComponents } from "./data/login/library.data";
import { messagesComponents } from "./data/messages/library.data";
import { notificationsComponents } from "./data/notifications/library.data";
import { settingsComponents } from "./data/settings/library.data";
import { navigationComponents } from "./data/navigation/library.data";
import { oddsComponents } from "./data/odds/library.data";
import { onboardingComponents } from "./data/onboarding/library.data";
import { panelComponents } from "./data/panel/library.data";
import { typographyComponents } from "./data/typography/library.data";
import { uiComponents } from "./data/ui/library.data";
import { rootComponents } from "./data/root/library.data";

export interface ComponentItem {
  name: string;
  file: string;
  sourcePath?: string;
  description: string;
  version?: string;
  history?: string;
  tags?: string[];
  children?: ComponentItem[];
  childComponents?: Array<{ name: string; category: string; file: string }>;
}

export const COMPONENT_DATABASE: Record<string, ComponentItem[]> = {
  auth: authComponents,
  "creative-ai": creativeAiComponents,
  "creative-report": creativeReportComponents,
  dashboard: dashboardComponents,
  docs: docsComponents,
  feedback: feedbackComponents,
  landing: landingComponents,
  layout: layoutComponents,
  login: loginComponents,
  messages: messagesComponents,
  notifications: notificationsComponents,
  settings: settingsComponents,
  navigation: navigationComponents,
  odds: oddsComponents,
  onboarding: onboardingComponents,
  panel: panelComponents,
  typography: typographyComponents,
  ui: uiComponents,
  root: rootComponents,
};
