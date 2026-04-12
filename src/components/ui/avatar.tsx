"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface AvatarProps {
  className?: string;
  children?: React.ReactNode;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
);
Avatar.displayName = "Avatar";

interface AvatarImageProps {
  className?: string;
  src?: string | null;
  alt?: string;
}

// Detect external/non-optimizable URLs
function isExternalOrUnoptimized(src: string): boolean {
  return (
    src.startsWith("http") ||
    src.startsWith("//") ||
    src.includes("dicebear.com") ||
    src.includes("googleusercontent.com") ||
    src.includes("githubusercontent.com")
  );
}

const AvatarImage = React.forwardRef<HTMLDivElement, AvatarImageProps>(
  ({ className, src, alt, ...props }, ref) => {
    const [error, setError] = React.useState(false);

    // Reset error state when src changes
    React.useEffect(() => {
      setError(false);
    }, [src]);

    if (error || !src) return null;

    return (
      <div
        ref={ref}
        className="absolute inset-0"
        {...(props as React.HTMLAttributes<HTMLDivElement>)}
      >
        <Image
          src={src}
          alt={alt || ""}
          fill
          sizes="48px"
          className={cn("aspect-square h-full w-full object-cover", className)}
          onError={() => setError(true)}
          unoptimized={isExternalOrUnoptimized(src)}
          referrerPolicy="no-referrer"
        />
      </div>
    );
  },
);
AvatarImage.displayName = "AvatarImage";

interface AvatarFallbackProps {
  className?: string;
  children?: React.ReactNode;
}

// No delay – show fallback immediately when image fails or is absent
const AvatarFallback = React.forwardRef<HTMLDivElement, AvatarFallbackProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white font-semibold",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
);
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };
