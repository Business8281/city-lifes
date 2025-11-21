import { cn } from "@/lib/utils";

interface PriceMarkerProps {
  price: number;
  priceType?: string;
  isSelected?: boolean;
  onClick?: () => void;
}

const PriceMarker = ({ price, priceType, isSelected, onClick }: PriceMarkerProps) => {
  const formatPrice = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;
    return `₹${amount}`;
  };

  const suffix = priceType === "monthly" ? "/mo" : priceType === "daily" ? "/day" : "";

  return (
    <div
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-full font-semibold text-sm shadow-lg cursor-pointer transition-all hover:scale-110 whitespace-nowrap border-2",
        isSelected
          ? "bg-primary text-primary-foreground border-primary-foreground scale-110"
          : "bg-background text-foreground border-border hover:border-primary"
      )}
    >
      {formatPrice(price)}
      {suffix}
    </div>
  );
};

export default PriceMarker;
