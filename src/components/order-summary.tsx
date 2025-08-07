import type { Bill } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

interface OrderSummaryProps {
  bill: Bill;
}

export default function OrderSummary({ bill }: OrderSummaryProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatCurrency(bill.subtotal)}</span>
          </div>
          {bill.couponDiscount && (
            <div className="flex justify-between text-accent">
              <span className="text-muted-foreground">Coupon ({bill.couponDiscount.code})</span>
              <span>- {formatCurrency(bill.couponDiscount.amount)}</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between">
            <span className="text-muted-foreground">Taxable Amount</span>
            <span>{formatCurrency(bill.taxableAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">CGST (9%)</span>
            <span>{formatCurrency(bill.cgst)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">SGST (9%)</span>
            <span>{formatCurrency(bill.sgst)}</span>
          </div>
        </div>
        <Separator />
        <div className="flex justify-between text-lg font-bold">
          <span>Grand Total</span>
          <span>{formatCurrency(bill.grandTotal)}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
          Place Order
        </Button>
      </CardFooter>
    </Card>
  );
}
