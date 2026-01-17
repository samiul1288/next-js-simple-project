export default function Footer() {
  return (
    <footer className="border-t">
      <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-gray-600">
        © {new Date().getFullYear()} NextItems — Next.js App Router + Express
        API
      </div>
    </footer>
  );
}
