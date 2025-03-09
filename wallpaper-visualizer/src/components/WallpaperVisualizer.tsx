import React, { useState, useEffect, useRef } from "react";
import Konva from "konva";
import { Stage, Layer, Image } from "react-konva";

interface WallpaperVisualizerProps {
  wallWidth: number;
  wallHeight: number;
  selectedWallpaper: string;
}

const WallpaperVisualizer: React.FC<WallpaperVisualizerProps> = ({ wallWidth, wallHeight, selectedWallpaper }) => {
  const [wallpaperImage, setWallpaperImage] = useState<Konva.Image | null>(null);
  const [offsetX, setOffsetX] = useState(0);
  const maxStageWidth = 1000;
  const maxStageHeight = 800;
  const layerRef = useRef<Konva.Layer>(null);
  const scaleRef = useRef(1);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);

  useEffect(() => {
    if (selectedWallpaper) {
      const image = new window.Image();
      image.src = selectedWallpaper;
      image.onload = () => {
        setWallpaperImage(new Konva.Image({ image: image }));
      };
    } else {
      setWallpaperImage(null);
    }
  }, [selectedWallpaper]);

  const renderWallpaper = () => {
    if (!wallpaperImage || !layerRef.current) return;

    const layer = layerRef.current;

    const wallpaperWidth = wallpaperImage.image().width;
    const wallpaperHeight = wallpaperImage.image().height;
    const scaleX = wallWidth > maxStageWidth ? maxStageWidth / wallWidth : 1;
    const scaleY = wallHeight > maxStageHeight ? maxStageHeight / wallHeight : 1;
    scaleRef.current = Math.min(scaleX, scaleY);
    const scaledWallpaperWidth = wallpaperWidth * (wallHeight / wallpaperHeight) * scaleRef.current;

    // Oblicz dynamicznie liczbę powtórzeń
    const visibleWidth = wallWidth * scaleRef.current;
    const requiredRepetitions = Math.ceil(visibleWidth / scaledWallpaperWidth) + 4;

    layer.destroyChildren();

    const initialOffsetX = (wallWidth * scaleRef.current - scaledWallpaperWidth) / 2;

    console.log("renderWallpaper:", {
      wallWidth,
      wallHeight,
      wallpaperWidth,
      wallpaperHeight,
      scaleRef: scaleRef.current,
      scaledWallpaperWidth,
      requiredRepetitions,
      initialOffsetX,
    });

    for (let i = -2; i < requiredRepetitions - 2; i++) {
      layer.add(
        wallpaperImage.clone({
          x: i * scaledWallpaperWidth + offsetX * scaleRef.current + initialOffsetX,
          y: 0,
          width: scaledWallpaperWidth,
          height: wallHeight * scaleRef.current,
        })
      );
    }
  };

  const handleDragStart = (e: Konva.KonvaEventObject<MouseEvent>) => {
    isDraggingRef.current = true;
    dragStartXRef.current = e.evt.clientX;
  };

  const handleDragMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!isDraggingRef.current || !wallpaperImage) return;

    const dragCurrentX = e.evt.clientX;
    const dragDeltaX = dragCurrentX - dragStartXRef.current;
    const newOffsetX = offsetX + dragDeltaX;

    const minOffsetX = -(
      wallpaperImage.image().width *
      (wallHeight / wallpaperImage.image().height) *
      scaleRef.current
    );
    const maxOffsetX = wallpaperImage.image().width * (wallHeight / wallpaperImage.image().height) * scaleRef.current;

    console.log("handleDragMove:", {
      offsetX,
      newOffsetX,
      minOffsetX,
      maxOffsetX,
      dragDeltaX,
      scaleRef: scaleRef.current,
    });

    if (newOffsetX >= minOffsetX && newOffsetX <= maxOffsetX) {
      setOffsetX(newOffsetX);
      dragStartXRef.current = dragCurrentX;
    }
  };

  const handleDragEnd = () => {
    isDraggingRef.current = false;
  };

  const stageWidth = Math.min(wallWidth, maxStageWidth);
  const stageHeight = Math.min(wallHeight, maxStageHeight);

  useEffect(() => {
    renderWallpaper();
  }, [wallpaperImage, wallWidth, wallHeight, offsetX]);

  return (
    <Stage width={stageWidth} height={stageHeight}>
      <Layer
        ref={layerRef}
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
      ></Layer>
    </Stage>
  );
};

export default WallpaperVisualizer;
