// app/layout.tsx
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
      <body>{children}</body>
    </html>
  );
}
