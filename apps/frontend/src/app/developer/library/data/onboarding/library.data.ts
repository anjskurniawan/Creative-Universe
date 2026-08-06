import type { ComponentItem } from "@/app/developer/library/library.data";

export const onboardingComponents: ComponentItem[] = [
  {
    "name": "OnboardingCard",
    "file": "onboarding-card.tsx",
    "description": "Wadah utama untuk alur onboarding pengguna baru.",
    "tags": [
      "Onboarding",
      "Card",
      "Wizard"
    ]
  },
  {
    "name": "OnboardingForm",
    "file": "onboarding-form.tsx",
    "description": "Form bertahap untuk mengumpulkan data awal dan menyelesaikan onboarding.",
    "tags": [
      "Onboarding",
      "Form",
      "Wizard"
    ]
  },
  {
    "name": "Steps",
    "file": "steps/",
    "description": "Folder Steps.",
    "tags": [
      "Folder"
    ],
    "children": [
      {
        "name": "StepDivision",
        "file": "steps/step-division.tsx",
        "description": "Komponen Steps\\stepDivision pada kategori onboarding.",
        "tags": [
          "Component",
          "onboarding"
        ]
      },
      {
        "name": "StepFullname",
        "file": "steps/step-fullname.tsx",
        "description": "Komponen Steps\\stepFullname pada kategori onboarding.",
        "tags": [
          "Component",
          "onboarding"
        ]
      },
      {
        "name": "StepPosition",
        "file": "steps/step-position.tsx",
        "description": "Komponen Steps\\stepPosition pada kategori onboarding.",
        "tags": [
          "Component",
          "onboarding"
        ]
      },
      {
        "name": "StepPreparing",
        "file": "steps/step-preparing.tsx",
        "description": "Komponen Steps\\stepPreparing pada kategori onboarding.",
        "tags": [
          "Component",
          "onboarding"
        ]
      },
      {
        "name": "StepReady",
        "file": "steps/step-ready.tsx",
        "description": "Komponen Steps\\stepReady pada kategori onboarding.",
        "tags": [
          "Component",
          "onboarding"
        ]
      },
      {
        "name": "StepSplash",
        "file": "steps/step-splash.tsx",
        "description": "Komponen Steps\\stepSplash pada kategori onboarding.",
        "tags": [
          "Component",
          "onboarding"
        ]
      },
      {
        "name": "StepWelcome",
        "file": "steps/step-welcome.tsx",
        "description": "Komponen Steps\\stepWelcome pada kategori onboarding.",
        "tags": [
          "Component",
          "onboarding"
        ]
      },
      {
        "name": "StepWhatsapp",
        "file": "steps/step-whatsapp.tsx",
        "description": "Komponen Steps\\stepWhatsapp pada kategori onboarding.",
        "tags": [
          "Component",
          "onboarding"
        ]
      }
    ]
  }
];

