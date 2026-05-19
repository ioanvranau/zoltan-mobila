import Image, { ImageProps } from "next/image";
import { cn } from "@/lib/cn";

const FALLBACK_BLUR =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiMxQzE4MTQiLz48L3N2Zz4=";

type Props = Omit<ImageProps, "placeholder" | "blurDataURL"> & {
  blurDataURL?: string;
};

export function BlurImage({ className, blurDataURL, ...rest }: Props) {
  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <Image
      {...rest}
      placeholder="blur"
      blurDataURL={blurDataURL ?? FALLBACK_BLUR}
      className={cn(className)}
    />
  );
}
