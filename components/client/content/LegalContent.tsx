import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type LegalArticleProps = {
  id?: string;
  title: string;
  children: ReactNode;
  className?: string;
};

type LegalTableProps = {
  headers: string[];
  rows: string[][];
};

export function LegalIntro({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-300 bg-white p-6 shadow-sm md:p-8">
      <div className="prose prose-gray max-w-none text-gray-700">{children}</div>
    </div>
  );
}

export function LegalArticle({
  id,
  title,
  children,
  className,
}: LegalArticleProps) {
  return (
    <article
      id={id}
      className={cn(
        "rounded-2xl border border-gray-300 bg-white p-6 shadow-sm md:p-8",
        className
      )}
    >
      <div className="mb-5 flex items-start gap-4">
        <div className="mt-2 h-10 w-1 rounded-full bg-client-primary-500" />
        <h3 className="text-2xl font-bold tracking-tight text-gray-950">{title}</h3>
      </div>
      <div className="prose prose-gray max-w-none text-gray-700 prose-p:leading-7 prose-li:leading-7">
        {children}
      </div>
    </article>
  );
}

export function LegalTable({ headers, rows }: LegalTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-300">
      <table className="min-w-full divide-y divide-gray-300 bg-white text-left text-sm">
        <thead className="bg-gray-100">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                className="px-4 py-3 font-semibold uppercase tracking-wide text-gray-700"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {rows.map((row, index) => (
            <tr key={`${row[0]}-${index}`}>
              {row.map((cell, cellIndex) => (
                <td key={`${cellIndex}-${cell}`} className="px-4 py-3 align-top text-gray-700">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
