import { ReactNode } from "react";

export const metadata = {
  title: "user app",
  description: "user",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <body>
        <header>
          <h1>User App Header</h1>
        </header>
        <main>{children}</main>
        <footer>User App Footers</footer>
      </body>
    </html>
  );
}
