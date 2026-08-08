import { SettingsLayout } from "@/components/layout/settings-layout";
import SecuritySettings from "@/components/settings/security-settings";

export default function SecurityPage() {
  return (
    <SettingsLayout>
      <SecuritySettings />
    </SettingsLayout>
  );
}
