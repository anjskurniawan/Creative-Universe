"use client";

import React, { useState } from "react";
import { BubbleChat } from "@/features/creative-ai/components/Creative/BubbleChat";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  content: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "msg-1",
    sender: "ai",
    content: "Halo! Saya asisten **Creative AI**. Ada yang bisa saya bantu buatkan hari ini?",
  },
  {
    id: "msg-2",
    sender: "user",
    content: "Bantu saya membuat deskripsi konsep desain bertema Modern Space & AI Universe.",
  },
  {
    id: "msg-3",
    sender: "ai",
    content: "Tentu! Berikut adalah ringkasan konsep **Modern Space & AI Universe**:\n\n- **Visual Aesthetics**: Gelap pekat (*deep space* #050505) dipadukan dengan aksen *glow neon* dan *glassmorphism*.\n- **Tipografi**: Menggunakan font modern clean dengan kontras tinggi untuk keterbacaan optimal.\n- **Interaksi**: Komponen modular cerdas (*ChatBox, SideNav, BubbleChat*) dengan feedback interaktif yang mulus.\n\n```typescript\n// Contoh konfigurasi tema Creative Universe\nexport const universeTheme = {\n  mode: \"dark\",\n  accent: \"neon-cyan\",\n  blur: \"backdrop-blur-xl\",\n};\n```\n\nApakah Anda ingin menambahkan detail elemen UI tertentu?",
  },
];

export default function CreativeAiPage() {
  const [messages] = useState<ChatMessage[]>(INITIAL_MESSAGES);

  return (
    <div className="flex h-full w-full flex-col justify-end p-4 md:px-6 max-w-3xl mx-auto space-y-6">
      {messages.map((msg) => (
        <BubbleChat
          key={msg.id}
          sender={msg.sender}
          content={msg.content}
        />
      ))}
    </div>
  );
}
