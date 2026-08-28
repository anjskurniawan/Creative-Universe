import type { ComponentItem } from "@/app/developer/library/library.data";

export const loginComponents: ComponentItem[] = [
  {
    "name": "LoginCard",
    "file": "LoginCard/LoginCard.tsx",
    "sourcePath": "@/features/auth/components/Login/LoginCard/LoginCard.tsx",
    "description": "Kartu layout utama yang membungkus pengalaman login.",
    "tags": [
      "Login",
      "Card",
      "Layout"
    ]
  },
  {
    "name": "LoginForm",
    "file": "LoginForm/LoginForm.tsx",
    "sourcePath": "@/features/auth/components/Login/LoginForm/LoginForm.tsx",
    "description": "Form interaktif untuk memasukkan kredensial dan mengirim proses login.",
    "tags": [
      "Login",
      "Form",
      "Authentication"
    ]
  }
];
