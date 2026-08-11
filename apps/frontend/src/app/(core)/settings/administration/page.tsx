import { redirect } from "next/navigation";

export default function AdministrationPage() {
  redirect("/settings/administration/system-configuration");
}
