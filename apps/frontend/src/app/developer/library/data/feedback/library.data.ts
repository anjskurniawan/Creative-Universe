import type { ComponentItem } from "@/app/developer/library/library.data";

export const feedbackComponents: ComponentItem[] = [
  {
    "name": "ErrorTetrisGame",
    "file": "ErrorTetrisGame/ErrorTetrisGame.tsx",
    "description": "Game Tetris interaktif yang menjadi pengalaman fallback pada halaman error.",
    "tags": [
      "Feedback",
      "Game",
      "Interactive"
    ]
  },
  {
    "name": "UniversalErrorView",
    "file": "UniversalErrorView/UniversalErrorView.tsx",
    "description": "Tampilan fallback error universal dengan pesan dan aksi pemulihan.",
    "tags": [
      "Feedback",
      "Error",
      "Fallback"
    ]
  },
  {
    "name": "Toast",
    "file": "Toast/Toast.tsx",
    "description": "Notifikasi sementara generik untuk menyampaikan status sukses atau error.",
    "tags": [
      "Feedback",
      "Notification",
      "Status"
    ]
  }
];
