"use client";

import {
  Skeleton as BoneyardSkeleton,
  configureBoneyard,
} from "boneyard-js/react";
import type { SkeletonProps as BoneyardSkeletonProps } from "boneyard-js/react";

type SkeletonProps = {
  className?: string;
  children?: React.ReactNode;
  loading?: boolean;
  name?: string;
  fallback?: React.ReactNode;
  color?: string;
  darkColor?: string;
  animate?: "pulse" | "shimmer" | "solid";
  stagger?: number | boolean;
  transition?: number | boolean;
  boneClass?: string;
  style?: React.CSSProperties;
};

function Skeleton({
  className,
  children,
  loading,
  name,
  fallback,
  color,
  darkColor,
  animate,
  stagger,
  transition,
  boneClass,
  style,
  ...props
}: SkeletonProps) {
  if (loading === undefined && !children) {
    return (
      <div
        className={className}
        style={{
          background:
            "linear-gradient(90deg, rgba(39,39,42,1) 25%, rgba(63,63,70,1) 50%, rgba(39,39,42,1) 75%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.5s ease-in-out infinite",
          borderRadius: "0.375rem",
          ...style,
        }}
        {...props}
      />
    );
  }

  return (
    <BoneyardSkeleton
      loading={loading ?? true}
      name={name}
      fallback={fallback}
      color={color}
      darkColor={darkColor}
      animate={animate}
      stagger={stagger}
      transition={transition}
      boneClass={boneClass}
      className={className}
    >
      {children}
    </BoneyardSkeleton>
  );
}

export { Skeleton, configureBoneyard };
