import { ActionButton } from "@react-spectrum/s2/ActionButton";
import { Avatar } from "@react-spectrum/s2/Avatar";
import { CardPreview, Content, Text, UserCard } from "@react-spectrum/s2/Card";
import {
  Header,
  Heading,
  Menu,
  MenuItem,
  MenuSection,
  MenuTrigger,
  Text as MenuText,
} from "@react-spectrum/s2/Menu";
import Image from "@react-spectrum/s2/icons/Image";
import type { ProfileCardProps } from "./ProfileCard.types";

const previewClassName =
  "h-32 w-full bg-gradient-to-r from-[#7c3aed] via-[#a855f7] to-[#ec4899]";

export function ProfileCard({
  name,
  role,
  avatarSrc,
  bannerSrc,
  onChangeAvatar,
  onChangeBanner,
}: ProfileCardProps) {
  return (
    <UserCard
      size="XL"
      variant="primary"
      UNSAFE_style={{ height: "auto", width: "100%" }}
    >
      <CardPreview>
        <div
          className={previewClassName}
          aria-hidden="true"
          style={
            bannerSrc
              ? {
                  backgroundImage: `url(${bannerSrc})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : undefined
          }
        />
      </CardPreview>
      <Avatar src={avatarSrc ?? undefined} alt={`Foto profil ${name}`} />
      <Content>
        <div className="flex flex-row justify-between">
          <div>
            <Text slot="title">{name}</Text>
            <Text slot="description">{role}</Text>
          </div>
          <MenuTrigger align="end">
            <ActionButton>Edit</ActionButton>
            <Menu size="L">
              <MenuSection>
                <Header>
                  <Heading>Edit profile appearance</Heading>
                  <MenuText slot="description">
                    Update your profile photo or banner.
                  </MenuText>
                </Header>
                <MenuItem
                  textValue="Ganti Foto Profil"
                  onAction={onChangeAvatar}
                >
                  <Image />
                  <Text slot="label">Ganti Foto Profil</Text>
                  <Text slot="description">Unggah foto profil baru.</Text>
                </MenuItem>
                <MenuItem textValue="Ganti Banner" onAction={onChangeBanner}>
                  <Image />
                  <Text slot="label">Ganti Banner</Text>
                  <Text slot="description">Ubah gambar banner profil.</Text>
                </MenuItem>
              </MenuSection>
            </Menu>
          </MenuTrigger>
        </div>
      </Content>
    </UserCard>
  );
}
