"use client";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-espresso">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <p className="text-center text-xs text-cream-soft/60 font-medium tracking-wide">
          © {currentYear} SignPaham{" "}
          <span className="text-cream-soft/40 font-normal">
            · Dibuat oleh Reynard Wijaya
          </span>
        </p>
      </div>
    </footer>
  );
}
