import Footer from "@/shared/layout/footer";
import { Header } from "@/shared/layout/header";

export default async function RootLayout({
  children,
}: LayoutProps<"/[locale]">) {
  return (
    <main className="flex-1">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </main>
  );
}
