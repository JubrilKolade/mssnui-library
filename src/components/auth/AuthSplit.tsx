import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface AuthSplitProps {
  image: string;
  imageAlt: string;
  imageSide?: "left" | "right";
  quote?: string;
  cite?: string;
  children: React.ReactNode;
}

export function AuthSplit({
  image,
  imageAlt,
  imageSide = "left",
  quote,
  cite,
  children,
}: AuthSplitProps) {
  const imageOnRight = imageSide === "right";

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Image panel */}
      <div
        className={`relative hidden lg:block ${
          imageOnRight ? "order-2" : "order-1"
        }`}
      >
        <Image
          src={image}
          alt={imageAlt}
          fill
          priority
          sizes="(max-width: 1024px) 0px, 50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-emerald-950/90 via-emerald-950/25 to-transparent" />
        {quote && (
          <figure className="absolute inset-x-10 bottom-10 text-white">
            <blockquote className="font-serif text-xl italic leading-relaxed drop-shadow-md">
              &ldquo;{quote}&rdquo;
            </blockquote>
            {cite && (
              <figcaption className="mt-2 text-sm text-white/70">
                {cite}
              </figcaption>
            )}
          </figure>
        )}
      </div>

      {/* Form panel */}
      <div
        className={`relative flex min-h-screen items-center justify-center p-6 sm:p-10 ${
          imageOnRight ? "lg:order-1" : ""
        }`}
      >
        <Link
          href="/"
          aria-label="Back to home"
          className="absolute left-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:border-primary hover:text-primary sm:left-6 sm:top-6"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>

        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}