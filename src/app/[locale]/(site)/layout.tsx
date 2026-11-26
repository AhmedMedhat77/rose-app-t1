import Footer from "@/shared/layout/footer";
import { Header } from "@/shared/layout/header";

export default async function RootLayout({
  children,
}: LayoutProps<"/[locale]">) {
  return (
    <section className="flex-1">
      <Header />
      <section className="flex-1">{children}</section>
      <Footer />
    </section>
  );
}
