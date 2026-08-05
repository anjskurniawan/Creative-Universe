import type { ReactNode } from "react";
import { ButtonNavigation } from "./button-navigation";
import { Title } from "./title";

type HeaderSectionProps = {
  title: ReactNode;
  mobileTitle?: ReactNode;
  showBackButton?: boolean;
};

export function HeaderSection({
  title,
  mobileTitle = "Detail Task",
  showBackButton = true,
}: HeaderSectionProps) {
  return (
    <div className="flex w-full items-center gap-3">
      <Title className="!py-0 flex-1" mobileChildren={mobileTitle}>
        {title}
      </Title>
      {showBackButton && <ButtonNavigation>Kembali</ButtonNavigation>}
    </div>
  );
}
