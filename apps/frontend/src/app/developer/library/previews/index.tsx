import React from "react";
import { DefaultPreviewPlaceholder } from "./placeholder";
import { MaterialIconPreview, SpinningWheelPreview, StatCardPreview, ActionCardPreview, ConfirmModalPreview, CustomDatePickerPreview, ToastPreview } from "./ui/index";
import { HeaderTitlePreview, HeroHeadingPreview } from "./typography/index";
import { UniversalErrorViewPreview, ErrorTetrisGamePreview } from "./feedback/index";
import { ProfileCardPreview, ContentPreview, BreadcrumbPreview, SidebarPreview } from "./layout.preview";
import { AccessDeniedPreview, ButtonActionPreview, ContentTitlePreview, LogoPreview, PrimaryActionLinkPreview, ButtonPreview, InputPreview } from "./ui/basic.preview";
import { DropdownMenuPreview, ModalPreview, AuthCardPreview, AuthCardHeaderPreview, AuthCardFooterPreview } from "./forms.preview";
import { DefaultStatsGridPreview, QuickActionsSectionPreview, SystemStatusGridPreview, GroupAccordionPreview } from "./features.preview";
import { OddsGameboyFramePreview, OddsRichTextEditorPreview } from "./odds.preview";

export { DefaultPreviewPlaceholder };
export const PREVIEW_REGISTRY: Record<string, React.ReactNode> = {
  MaterialIcon: <MaterialIconPreview />, SpinningWheel: <SpinningWheelPreview />, StatCard: <StatCardPreview />, ActionCard: <ActionCardPreview />,
  HeaderTitle: <HeaderTitlePreview />, HeroHeading: <HeroHeadingPreview />, UniversalErrorView: <UniversalErrorViewPreview />, ErrorTetrisGame: <ErrorTetrisGamePreview />,
  ProfileCard: <ProfileCardPreview />, ConfirmModal: <ConfirmModalPreview />, CustomDatePicker: <CustomDatePickerPreview />, Toast: <ToastPreview />,
  AccessDenied: <AccessDeniedPreview />, ButtonAction: <ButtonActionPreview />, ContentTitle: <ContentTitlePreview />, Logo: <LogoPreview />,
  PrimaryActionLink: <PrimaryActionLinkPreview />, Button: <ButtonPreview />, Input: <InputPreview />,
  DropdownMenu: <DropdownMenuPreview />, Modal: <ModalPreview />, AuthCard: <AuthCardPreview />,
  AuthCardHeader: <AuthCardHeaderPreview />, AuthCardFooter: <AuthCardFooterPreview />,
  Content: <ContentPreview />, Breadcrumb: <BreadcrumbPreview />, Sidebar: <SidebarPreview />,
  DefaultStatsGrid: <DefaultStatsGridPreview />, QuickActionsSection: <QuickActionsSectionPreview />,
  SystemStatusGrid: <SystemStatusGridPreview />, GroupAccordion: <GroupAccordionPreview />,
  OddsGameboyFrame: <OddsGameboyFramePreview />, OddsRichTextEditor: <OddsRichTextEditorPreview />,
};
