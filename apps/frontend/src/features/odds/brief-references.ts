import type { OddsTaskAttachment } from "@/features/odds/api";

export type OddsBriefReference =
  | {
      type: "link";
      url: string;
      label: string;
    }
  | {
      type: "image";
      attachmentId: number;
      url: string;
      label: string;
      attachment?: OddsTaskAttachment;
    };

/**
 * Converts the structured references embedded by the ODDS brief editor into
 * card-ready data for detail, approval, and task views.
 */
export function extractOddsBriefReferences(
  html: string,
  attachments: OddsTaskAttachment[] = [],
): OddsBriefReference[] {
  if (!html || typeof DOMParser === "undefined") return [];

  const document = new DOMParser().parseFromString(html, "text/html");
  const references: OddsBriefReference[] = [];

  document.querySelectorAll<HTMLAnchorElement>('a[data-reference-type="link"][href]').forEach((anchor) => {
    references.push({
      type: "link",
      url: anchor.href,
      label: anchor.textContent?.trim() || anchor.href,
    });
  });

  document.querySelectorAll<HTMLElement>('figure[data-reference-type="image"][data-attachment-id]').forEach((figure) => {
    const attachmentId = Number(figure.dataset.attachmentId);
    const image = figure.querySelector<HTMLImageElement>("img");
    if (!Number.isInteger(attachmentId) || attachmentId < 1 || !image) return;

    const attachment = attachments.find((item) => item.id === attachmentId);
    references.push({
      type: "image",
      attachmentId,
      url: image.getAttribute("src") || `/api/v1/odds/uploads/${attachmentId}/content`,
      label: figure.querySelector("figcaption")?.textContent?.trim() || attachment?.name || image.alt || "Reference image",
      attachment,
    });
  });

  return references;
}

export function briefWithReferenceAliases(html: string): string {
  if (!html || typeof DOMParser === "undefined") return "";

  const document = new DOMParser().parseFromString(html, "text/html");
  let imageIndex = 0;
  let linkIndex = 0;

  document.querySelectorAll<HTMLElement>('figure[data-reference-type="image"]').forEach((figure) => {
    imageIndex += 1;
    figure.replaceWith(document.createTextNode(` [IMAGE-${imageIndex}] `));
  });

  document.querySelectorAll<HTMLAnchorElement>('a[data-reference-type="link"]').forEach((anchor) => {
    linkIndex += 1;
    anchor.replaceWith(document.createTextNode(` [LINK-${linkIndex}] `));
  });

  return (document.body.textContent || "").replace(/\s+/g, " ").trim();
}
