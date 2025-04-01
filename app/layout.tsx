// app/layout.tsx
import "../globals.css";

export const metadata = {
  title: "MyFitCoach.AI",
  description: "Votre coach fitness intelligent",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="font-inter bg-gray-50 text-gray-800">{children}</body>
    </html>
  );
}
