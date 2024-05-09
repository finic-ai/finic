"use client";
/*
 * Documentation:
 * Slider — https://app.subframe.com/library?component=Slider_f4092874-0320-449e-a0c5-b435987c4cfb
 */

import React from "react";
import * as SubframeCore from "@subframe/core";

interface RangeProps
  extends React.ComponentProps<typeof SubframeCore.Slider.Range> {
  className?: string;
}

const Range = React.forwardRef<HTMLElement, RangeProps>(function Range(
  { className, ...otherProps }: RangeProps,
  ref
) {
  return (
    <SubframeCore.Slider.Range asChild={true} {...otherProps}>
      <div
        className={SubframeCore.twClassNames(
          "flex h-full flex-col items-start rounded-full bg-brand-600",
          className
        )}
        ref={ref as any}
      />
    </SubframeCore.Slider.Range>
  );
});

interface ThumbProps
  extends React.ComponentProps<typeof SubframeCore.Slider.Thumb> {
  className?: string;
}

const Thumb = React.forwardRef<HTMLElement, ThumbProps>(function Thumb(
  { className, ...otherProps }: ThumbProps,
  ref
) {
  return (
    <SubframeCore.Slider.Thumb asChild={true} {...otherProps}>
      <div
        className={SubframeCore.twClassNames(
          "flex h-5 w-5 items-center gap-2 rounded-full bg-brand-600",
          className
        )}
        ref={ref as any}
      />
    </SubframeCore.Slider.Thumb>
  );
});

interface TrackProps
  extends React.ComponentProps<typeof SubframeCore.Slider.Track> {
  className?: string;
}

const Track = React.forwardRef<HTMLElement, TrackProps>(function Track(
  { className, ...otherProps }: TrackProps,
  ref
) {
  return (
    <SubframeCore.Slider.Track asChild={true} {...otherProps}>
      <div
        className={SubframeCore.twClassNames(
          "flex h-1.5 w-full flex-col items-start gap-2 rounded-full bg-neutral-200",
          className
        )}
        ref={ref as any}
      >
        <Slider.Range />
      </div>
    </SubframeCore.Slider.Track>
  );
});

interface SliderRootProps
  extends React.ComponentProps<typeof SubframeCore.Slider.Root> {
  className?: string;
}

const SliderRoot = React.forwardRef<HTMLElement, SliderRootProps>(
  function SliderRoot({ className, ...otherProps }: SliderRootProps, ref) {
    return (
      <SubframeCore.Slider.Root asChild={true} {...otherProps}>
        <div
          className={SubframeCore.twClassNames(
            "flex h-5 w-full cursor-pointer flex-col items-start justify-center gap-2",
            className
          )}
          ref={ref as any}
        >
          <Track />
          <Thumb />
        </div>
      </SubframeCore.Slider.Root>
    );
  }
);

export const Slider = Object.assign(SliderRoot, {
  Range,
  Thumb,
  Track,
});
