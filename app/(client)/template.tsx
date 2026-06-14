import { PageTransition } from "@/components/shared/PageTransition";

export default function ClientTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageTransition>{children}</PageTransition>;
}
