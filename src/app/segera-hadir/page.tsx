import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ErrorState from "@/components/ui/ErrorState";

export default function SegeraHadirPage() {
  return (
    <div className="flex flex-col min-h-screen bg-cream">
      <Navbar />
      <main className="flex-1">
        <ErrorState variant="maintenance" />
      </main>
      <Footer />
    </div>
  );
}
