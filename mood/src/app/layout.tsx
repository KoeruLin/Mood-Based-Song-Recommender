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
      {/* The primary structure of the app's layout is defined here. */}
      <body>
        {/* Header Section containing the Header component. */}
        <header>
          <Header />{" "}
          {/* Header Component - Likely contains the site's navigation or branding. */}
        </header>

        {/* Main Section where child components or pages are rendered dynamically. */}
        <main>{children}</main>
      </body>
    </html>
  );
}
