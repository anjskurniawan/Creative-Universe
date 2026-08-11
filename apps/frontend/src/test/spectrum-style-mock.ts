export function style(input: { font?: string }) {
  return input.font ? "spectrum-" + input.font : "";
}
