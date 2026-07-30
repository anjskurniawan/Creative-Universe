const fs = require('fs');

function addImport(file, newImport) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace('import { OddsGameboyFrame } from "@/components/odds/odds-gameboy-frame";\n', 'import { OddsGameboyFrame } from "@/components/odds/odds-gameboy-frame";\n' + newImport + '\n');
    fs.writeFileSync(file, content);
}

addImport('src/app/odds/new/page.tsx', 'import { matchesSpecialization, designerSort, recommendDesigner, selectedDesignerName } from "@/components/odds/retro/utils";');
addImport('src/components/odds/retro/category-inventory-stage.tsx', 'import { primaryButtonClass, secondaryButtonClass } from "./constants";\nimport type { PointerEvent as ReactPointerEvent } from "react";');
addImport('src/components/odds/retro/designer-character-select-stage.tsx', 'import { primaryButtonClass, secondaryButtonClass } from "./constants";');
addImport('src/components/odds/retro/mission-brief-stage.tsx', 'import { primaryButtonClass, secondaryButtonClass } from "./constants";');
addImport('src/components/odds/retro/mission-scroll-review.tsx', 'import { extractOddsBriefReferences } from "@/features/odds/brief-references";');

console.log('Imports added!');
