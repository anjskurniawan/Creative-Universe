import { Content, Heading, InlineAlert } from "@/components/spectrum/InlineAlert";

export function SpectrumInlineAlertPreview() {
  return <div className="w-full max-w-xl"><InlineAlert variant="informative"><Heading>Account update</Heading><Content>Your profile information is ready to review.</Content></InlineAlert></div>;
}
