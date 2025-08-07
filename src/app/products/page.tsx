
import BannerCarousel from "@/components/banner-carousel";
import OrderForm from "@/components/order-form";
import DashboardLayout from "../dashboard-layout";

export default function ProductsPage() {
    return (
        <DashboardLayout>
            <div className="space-y-8">
                <BannerCarousel />
                <OrderForm />
            </div>
        </DashboardLayout>
    )
}
