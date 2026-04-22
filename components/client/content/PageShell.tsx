import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description: string;
  children?: ReactNode;
};

type PageSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-client-primary-900 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_38%)]" />
      <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-client-primary-500/20 blur-3xl" />
      <div className="absolute -right-24 bottom-0 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="container relative mx-auto px-4 py-18 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          {eyebrow ? (
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-client-primary-200">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-200 md:text-xl">
            {description}
          </p>
          {children ? <div className="mt-8">{children}</div> : null}
        </div>
      </div>
    </section>
  );
}

export function PageSection({
  title,
  description,
  children,
  className,
}: PageSectionProps) {
  return (
    <section className={cn("py-14 md:py-16", className)}>
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 max-w-3xl">
            <div className="mb-4 h-1 w-16 rounded-full bg-client-primary-500" />
            <h2 className="text-3xl font-bold tracking-tight text-gray-950 md:text-4xl">
              {title}
            </h2>
            {description ? (
              <p className="mt-3 text-base leading-7 text-gray-700 md:text-lg">
                {description}
              </p>
            ) : null}
          </div>
          {children}
        </div>
      </div>
    </section>
  );
}
