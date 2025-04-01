// app/layout.tsx
import "../globals.css";

export const metadata = {
  title: "MyFitCoach.AI",
  description: "Votre coach fitness intelligent",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
