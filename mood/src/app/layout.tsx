import "./globals.css";
import { ReactNode } from "react";
import Header from "./components/header";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <body>
        <header>
          <Header />
        </header>

        <main>{children}</main>
      </body>
    </html>
  );
}
