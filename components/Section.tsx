export default function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="py-12 border-b">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-3">{title}</h2>
        <div className="text-gray-700 leading-relaxed">{children}</div>
      </div>
    </section>
  );
}
