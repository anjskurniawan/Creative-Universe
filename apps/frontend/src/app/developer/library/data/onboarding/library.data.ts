import type { ComponentItem } from "@/app/developer/library/library.data";

export const onboardingComponents: ComponentItem[] = [
  {
    "name": "OnboardingCard",
    "file": "OnboardingCard/OnboardingCard.tsx",
    "sourcePath": "@/features/auth/components/Onboarding/OnboardingCard/OnboardingCard.tsx",
    "description": "Wadah utama untuk alur onboarding pengguna baru.",
    "tags": [
      "Onboarding",
      "Card",
      "Wizard"
    ]
  },
  {
    "name": "OnboardingForm",
    "file": "OnboardingForm/OnboardingForm.tsx",
    "sourcePath": "@/features/auth/components/Onboarding/OnboardingForm/OnboardingForm.tsx",
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
        "file": "steps/StepDivision/StepDivision.tsx",
        "sourcePath": "@/features/auth/components/Onboarding/steps/StepDivision/StepDivision.tsx",
        "description": "Komponen Steps\\stepDivision pada kategori onboarding.",
        "tags": [
          "Component",
          "onboarding"
        ]
      },
      {
        "name": "StepFullname",
        "file": "steps/StepFullName/StepFullName.tsx",
        "sourcePath": "@/features/auth/components/Onboarding/steps/StepFullName/StepFullName.tsx",
        "description": "Komponen Steps\\stepFullname pada kategori onboarding.",
        "tags": [
          "Component",
          "onboarding"
        ]
      },
      {
        "name": "StepPosition",
        "file": "steps/StepPosition/StepPosition.tsx",
        "sourcePath": "@/features/auth/components/Onboarding/steps/StepPosition/StepPosition.tsx",
        "description": "Komponen Steps\\stepPosition pada kategori onboarding.",
        "tags": [
          "Component",
          "onboarding"
        ]
      },
      {
        "name": "StepPreparing",
        "file": "steps/StepPreparing/StepPreparing.tsx",
        "sourcePath": "@/features/auth/components/Onboarding/steps/StepPreparing/StepPreparing.tsx",
        "description": "Komponen Steps\\stepPreparing pada kategori onboarding.",
        "tags": [
          "Component",
          "onboarding"
        ]
      },
      {
        "name": "StepReady",
        "file": "steps/StepReady/StepReady.tsx",
        "sourcePath": "@/features/auth/components/Onboarding/steps/StepReady/StepReady.tsx",
        "description": "Komponen Steps\\stepReady pada kategori onboarding.",
        "tags": [
          "Component",
          "onboarding"
        ]
      },
      {
        "name": "StepSplash",
        "file": "steps/StepSplash/StepSplash.tsx",
        "sourcePath": "@/features/auth/components/Onboarding/steps/StepSplash/StepSplash.tsx",
        "description": "Komponen Steps\\stepSplash pada kategori onboarding.",
        "tags": [
          "Component",
          "onboarding"
        ]
      },
      {
        "name": "StepWelcome",
        "file": "steps/StepWelcome/StepWelcome.tsx",
        "sourcePath": "@/features/auth/components/Onboarding/steps/StepWelcome/StepWelcome.tsx",
        "description": "Komponen Steps\\stepWelcome pada kategori onboarding.",
        "tags": [
          "Component",
          "onboarding"
        ]
      },
      {
        "name": "StepWhatsapp",
        "file": "steps/StepWhatsapp/StepWhatsapp.tsx",
        "sourcePath": "@/features/auth/components/Onboarding/steps/StepWhatsapp/StepWhatsapp.tsx",
        "description": "Komponen Steps\\stepWhatsapp pada kategori onboarding.",
        "tags": [
          "Component",
          "onboarding"
        ]
      }
    ]
  }
];
