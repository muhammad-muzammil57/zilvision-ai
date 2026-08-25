export default function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-display text-3xl font-700 mb-2">{title}</h1>
      <p className="text-mist text-sm mb-10">Last updated: {updated}</p>
      <div className="prose prose-invert max-w-none space-y-6 text-sm sm:text-[15px] leading-relaxed text-mist [&_h2]:text-paper [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-700 [&_h2]:pt-4 [&_strong]:text-paper">
        {children}
      </div>
    </div>
  );
}
