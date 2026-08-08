import ProfileSettingsPage from "@/components/settings/profile-settings-page";
import { SettingsLayout } from "@/components/layout/settings-layout";

export default function ProfilePage() {
  return (
    <SettingsLayout>
      <ProfileSettingsPage />
    </SettingsLayout>
  );
}
