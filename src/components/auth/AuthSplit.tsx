import Image from "next/image";
import Link from "next/link";
import { BookMarked } from "lucide-react";

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
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/25 to-transparent" />
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
        className={`flex min-h-screen items-center justify-center p-6 sm:p-10 ${
          imageOnRight ? "lg:order-1" : ""
        }`}
      >
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary text-primary-foreground text-2xl font-bold shadow-md transition-transform hover:scale-105"
            >
              M
            </Link>
            <h1 className="mt-4 font-serif text-2xl font-bold text-foreground">
              MSSN UI Library
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Muslim Students Society of Nigeria
            </p>
          </div>

          {children}

          <p className="mt-6 text-center text-xs text-muted-foreground">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-primary"
            >
              <BookMarked className="h-3.5 w-3.5" />
              Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
