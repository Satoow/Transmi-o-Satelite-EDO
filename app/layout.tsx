import type { Metadata } from "next";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/jetbrains-mono/400.css";
import "katex/dist/katex.min.css";
import "./globals.css";
import Shell from "../components/v2/Shell";
export const metadata: Metadata = {
  title: "Apontamento — Laboratório orbital",
  description:
    "Explore a Terra e o TDRS em 3D. Simule o controle de apontamento e descubra a transformada de Laplace.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
