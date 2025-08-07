import Header from "@/components/header";
import OrderForm from "@/components/order-form";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-background">
      <Header />
      <main className="p-4 sm:p-6 lg:p-8">
        <OrderForm />
      </main>
    </div>
  );
}
