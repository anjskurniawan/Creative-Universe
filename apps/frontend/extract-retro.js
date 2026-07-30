const fs = require('fs');

const dir = 'src/components/odds/retro';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const content = fs.readFileSync('temp_extracted.tsx', 'utf8');
const lines = content.split('\n');

const components = {};
let currentComponent = null;

const startRegex = /^(export function|function|const) ([A-Z][a-zA-Z0-9_]+)/;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(startRegex);
    if (match) {
        currentComponent = match[2];
        components[currentComponent] = [];
    }
    
    if (currentComponent) {
        components[currentComponent].push(line);
    }
}

function writeComponentFile(filename, compNames, extraImports = '') {
    const header = `"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { gsap } from "gsap";
import { MaterialIcon } from "@/components/ui/material-icon";
import { OddsCategory, OddsDesignerProfile, OddsTaskAttachment } from "@/features/odds/api";
import { OddsGameboyFrame } from "@/components/odds/odds-gameboy-frame";
${extraImports}

`;
    let body = '';
    for (const name of compNames) {
        if (components[name]) {
            let compBody = components[name].join('\n');
            if (compBody.startsWith('function ' + name)) {
                compBody = compBody.replace('function ' + name, 'export function ' + name);
            } else if (compBody.startsWith('const ' + name)) {
                compBody = compBody.replace('const ' + name, 'export const ' + name);
            }
            body += compBody + '\n\n';
        } else {
            console.warn('Component missing:', name);
        }
    }
    fs.writeFileSync(dir + '/' + filename, header + body);
}

writeComponentFile('constants.ts', ['PIXEL_MASCOT'], '');
writeComponentFile('welcome-screen.tsx', ['WelcomeScreen'], 'import { PIXEL_MASCOT } from "./constants";');
writeComponentFile('request-type-select-stage.tsx', ['RequestTypeSelectStage', 'RetroRequestTypeIcon']);
writeComponentFile('category-inventory-stage.tsx', ['CategoryInventoryStage']);
writeComponentFile('designer-character-select-stage.tsx', ['DesignerCharacterSelectStage'], 'import { PIXEL_MASCOT } from "./constants";');
writeComponentFile('loadout-row.tsx', ['LoadoutRow']);
writeComponentFile('retro-hud-route.tsx', ['RetroHudRoute']);
writeComponentFile('mission-brief-stage.tsx', ['MissionBriefStage', 'RetroBriefEditor', 'RobotOperator', 'RetroDatePicker'], 'import { stripRichText } from "@/components/odds-rich-text-editor";\nimport { TaskForm } from "@/app/odds/new/types";');
writeComponentFile('panel.tsx', ['Panel', 'StepActions']);
writeComponentFile('mission-scroll-review.tsx', ['MissionScrollReview', 'BriefWithReferencePreviews', 'ReferenceAliasPreview', 'TextFileLine', 'EditMissionButton']);

console.log('Component files generated in', dir);
