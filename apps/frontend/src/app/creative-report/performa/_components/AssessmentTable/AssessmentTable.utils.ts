export function calculateHrdScore(absence: number, late: number) {

  const absencePenalty = Math.min(absence, 2) * 3 + Math.max(absence - 2, 0) * 5;
  const latePenalty = Math.min(late, 2) + Math.max(late - 2, 0) * 2;
  return 20 - absencePenalty - latePenalty;
}

export function formatDateShort(dateStr: string) {
  const parts = dateStr.split("-");
  if (parts.length === 3) return `${parts[2]}/${parts[1]}`;
  return dateStr;
}
