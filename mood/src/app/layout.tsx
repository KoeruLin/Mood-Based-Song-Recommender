"use client";
import "./globals.css";
import { ReactNode } from "react";
import Header from "./components/header";

/**
 * RootLayout Component - Defines the overall structure of the application, including the HTML framework,
 * header, and dynamically rendered content.
 * @param children - ReactNode passed to the layout, representing content rendered within the layout's `main` section.
 */
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
