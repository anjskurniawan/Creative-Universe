"use client";

import { forwardRef, type ComponentRef } from "react";
import {
  AssetCard as SpectrumAssetCard,
  Card as SpectrumCard,
  CardPreview,
  CollectionCardPreview,
  Content,
  Footer,
  Image,
  ProductCard as SpectrumProductCard,
  Text,
  UserCard as SpectrumUserCard,
  type AssetCardProps,
  type CardPreviewProps,
  type CardProps,
  type ProductCardProps,
  type UserCardProps,
} from "@react-spectrum/s2/Card";

export { CardPreview, CollectionCardPreview, Content, Footer, Image, Text };
export type { AssetCardProps, CardPreviewProps, CardProps, ProductCardProps, UserCardProps };

type SpectrumCardRef = ComponentRef<typeof SpectrumCard>;

export const Card = forwardRef<SpectrumCardRef, CardProps>(function Card(props, ref) {
  return (
    <div className="spectrum-component">
      <SpectrumCard {...props} ref={ref} />
    </div>
  );
});

export const AssetCard = forwardRef<ComponentRef<typeof SpectrumAssetCard>, AssetCardProps>(function AssetCard(props, ref) {
  return (
    <div className="spectrum-component">
      <SpectrumAssetCard {...props} ref={ref} />
    </div>
  );
});

export const UserCard = forwardRef<ComponentRef<typeof SpectrumUserCard>, UserCardProps>(function UserCard(props, ref) {
  return (
    <div className="spectrum-component">
      <SpectrumUserCard {...props} ref={ref} />
    </div>
  );
});

export const ProductCard = forwardRef<ComponentRef<typeof SpectrumProductCard>, ProductCardProps>(function ProductCard(props, ref) {
  return (
    <div className="spectrum-component">
      <SpectrumProductCard {...props} ref={ref} />
    </div>
  );
});
