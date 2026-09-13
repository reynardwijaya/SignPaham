import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ErrorState from "@/components/ui/ErrorState";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-cream">
      <Navbar />
      <main className="flex-1">
        <ErrorState variant="notFound" />
      </main>
      <Footer />
    </div>
  );
}
