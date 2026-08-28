"use client";

import { useRef, useState, type PointerEvent, type WheelEvent } from "react";
import { Button, Text } from "@react-spectrum/s2/Button";
import { CustomDialog } from "@react-spectrum/s2/CustomDialog";
import { DialogContainer } from "@react-spectrum/s2/Dialog";
import { Content } from "@react-spectrum/s2/Content";
import { Heading } from "@react-spectrum/s2/Heading";
import { Slider } from "@react-spectrum/s2/Slider";
import type { ImageCropDialogProps } from "./ImageCropDialog.types";

export function ImageCropDialog({ source, kind, onCancel, onComplete }: ImageCropDialogProps) {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const dragRef = useRef<{ x: number; y: number; offsetX: number; offsetY: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const isBanner = kind === "banner";
  const aspectClass = isBanner ? "aspect-[3/1]" : "aspect-square rounded-full";

  function move(x: number, y: number) {
    setOffset({ x: Math.max(-100, Math.min(100, x)), y: Math.max(-100, Math.min(100, y)) });
  }
  function pointerDown(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { x: event.clientX, y: event.clientY, offsetX: offset.x, offsetY: offset.y };
  }
  function pointerMove(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (drag) move(drag.offsetX + (event.clientX - drag.x) / 1.6, drag.offsetY + (event.clientY - drag.y) / 1.6);
  }
  function wheel(event: WheelEvent<HTMLDivElement>) {
    event.preventDefault();
    setZoom((value) => Math.max(1, Math.min(3, value + (event.deltaY > 0 ? -0.08 : 0.08))));
  }
  async function apply() {
    const image = imageRef.current;
    if (!image) return;
    const width = isBanner ? 1200 : 512;
    const height = isBanner ? 400 : 512;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) return;
    const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight) * zoom;
    const drawnWidth = image.naturalWidth * scale;
    const drawnHeight = image.naturalHeight * scale;
    context.drawImage(image, (width - drawnWidth) / 2 + (offset.x / 100) * Math.max(0, (drawnWidth - width) / 2), (height - drawnHeight) / 2 + (offset.y / 100) * Math.max(0, (drawnHeight - height) / 2), drawnWidth, drawnHeight);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.92));
    if (!blob) return;
    const file = new File([blob], isBanner ? "banner.jpg" : "avatar.jpg", { type: "image/jpeg" });
    onComplete(file, URL.createObjectURL(blob));
  }

  return (
    <DialogContainer onDismiss={onCancel}>
      <CustomDialog size="L" isDismissible>
        <Heading>{isBanner ? "Sesuaikan Banner" : "Sesuaikan Foto Profil"}</Heading>
        <Content>
          <div className={`mx-auto mt-4 w-full max-w-xl overflow-hidden bg-cu-panel-soft ${aspectClass}`} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={() => { dragRef.current = null; }} onPointerCancel={() => { dragRef.current = null; }} onWheel={wheel}>
            <img ref={imageRef} src={source} alt="Preview crop" className="size-full select-none object-cover" style={{ transform: `scale(${zoom}) translate(${offset.x / 2}%, ${offset.y / 2}%)` }} draggable={false} />
          </div>
          <Slider label="Zoom" minValue={1} maxValue={3} step={0.01} value={zoom} onChange={(value) => setZoom(Number(value))} />
        </Content>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onPress={onCancel}><Text>Batal</Text></Button>
          <Button variant="primary" onPress={() => void apply()}><Text>Gunakan {isBanner ? "Banner" : "Foto Profil"}</Text></Button>
        </div>
      </CustomDialog>
    </DialogContainer>
  );
}
