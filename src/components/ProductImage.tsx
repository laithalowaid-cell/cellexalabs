"use client";

import { useCallback, useState } from "react";
import { PenRender } from "./PenRender";

/**
 * Renders a real product photo when available, and gracefully falls back to the
 * vector PenRender if the image is missing or fails to load. This lets us
 * pre-wire image filenames in the product data — the real photos appear the
 * moment the files are dropped into /public, with no broken-image states.
 */
export function ProductImage({
  src,
  name,
  dose,
  accent = "#c08a82",
  penWidth = 430,
  penClassName,
  imgClassName = "h-full w-full object-contain",
}: {
  src?: string;
  name: string;
  dose?: string;
  accent?: string;
  penWidth?: number;
  penClassName?: string;
  imgClassName?: string;
}) {
  // Failure is remembered per source, so switching variants starts fresh without an effect.
  const [failedSrc, setFailedSrc] = useState<string | undefined>();
  const failed = Boolean(src) && failedSrc === src;
  const setFailed = useCallback(() => setFailedSrc(src), [src]);
  // Catch images that already failed before React attached onError.
  const ref = useCallback(
    (el: HTMLImageElement | null) => {
      if (el && el.complete && el.naturalWidth === 0) setFailedSrc(src);
    },
    [src],
  );

  if (!src || failed) {
    return (
      <div className={penClassName}>
        <PenRender name={name} dose={dose} accent={accent} width={penWidth} />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={src}
      alt={`${name}${dose ? ` ${dose}` : ""} injection pen`}
      className={imgClassName}
      loading="lazy"
      onError={setFailed}
      onLoad={(e) => {
        if ((e.currentTarget as HTMLImageElement).naturalWidth === 0) setFailed();
      }}
    />
  );
}
