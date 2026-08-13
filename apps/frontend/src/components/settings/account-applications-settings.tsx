"use client";

import { useAuth } from "@/providers/auth-provider";
import { Card, Content, Text } from "@react-spectrum/s2/Card";

export default function AccountApplicationsSettings() {
  const { user } = useAuth();
  const applications = user?.applications.filter((application) => application.type === "sub_app").sort((left, right) => left.sort_order - right.sort_order) ?? [];

  return <div className="w-full space-y-6"><div className="grid gap-3 sm:grid-cols-2">{applications.map((application) => <Card key={application.key}><Content><Text>{application.display_name}</Text><Text slot="description">{application.status === "experimental" ? "Eksperimen" : "Aktif"}</Text></Content></Card>)}{applications.length === 0 && <p className="text-sm text-cu-muted">Belum ada aplikasi yang dapat diakses.</p>}</div></div>;
}
