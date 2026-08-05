import { catalogItems } from "../data/catalog-items";
import type { MenuItem } from "./menu-list";
import { ButtonNavigationPreview } from "../previews/button-navigation-preview";
import { HeaderSectionPreview } from "../previews/header-section-preview";
import { TabSectionPreview } from "../previews/tab-section-preview";
import { TitlePreview } from "../previews/title-preview";

type PlaygroundAreaProps = {
  activeItem: string;
};

export function PlaygroundArea({ activeItem }: PlaygroundAreaProps) {
  const showTitle = activeItem === "odds-detail-task-header-title";
  const showButton = activeItem === "odds-detail-task-back-button";
  const showHeaderSection = activeItem === "odds-detail-task-header-section";
  const showTabSection = activeItem === "odds-detail-task-tab-section";
  const breadcrumb = findBreadcrumb(catalogItems, activeItem);

  return (
    <main
      aria-label="Area konten component"
      className="ml-4 min-h-0 min-w-0 flex-1 overflow-auto rounded-2xl border border-[#ebebeb] bg-white p-6"
    >
      {showTitle && (
        <TitlePreview
          breadcrumb={
            breadcrumb.length > 1
              ? breadcrumb.slice(0, -1)
              : ["ODDS", "Detail Task"]
          }
        />
      )}
      {showButton && (
        <ButtonNavigationPreview
          breadcrumb={
            breadcrumb.length > 1
              ? breadcrumb.slice(0, -1)
              : ["ODDS", "Detail Task"]
          }
        />
      )}
      {showHeaderSection && (
        <HeaderSectionPreview
          breadcrumb={
            breadcrumb.length > 1
              ? breadcrumb.slice(0, -1)
              : ["ODDS", "Detail Task"]
          }
        />
      )}
      {showTabSection && (
        <TabSectionPreview
          breadcrumb={
            breadcrumb.length > 1
              ? breadcrumb.slice(0, -1)
              : ["ODDS", "Detail Task"]
          }
        />
      )}
    </main>
  );
}

function findBreadcrumb(
  items: MenuItem[],
  activeItem: string,
  parents: string[] = [],
): string[] {
  for (const item of items) {
    const nextParents = [...parents, item.label];
    if (item.id === activeItem) return nextParents;
    if (item.children) {
      const result = findBreadcrumb(item.children, activeItem, nextParents);
      if (result.length > 0) return result;
    }
  }
  return [];
}
