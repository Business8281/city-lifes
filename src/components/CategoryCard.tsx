import { cn } from "@/lib/utils";

interface CategoryCardProps {
  icon: string;
  label: string;
  count?: number;
  onClick?: () => void;
  className?: string;
}

const CategoryCard = ({ icon, label, count, onClick, className }: CategoryCardProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-2 p-3 md:p-4 rounded-lg border border-border bg-card hover:bg-muted hover:border-primary transition-all duration-300 hover:scale-105 active:scale-95 min-h-[88px] md:min-h-[100px]",
        className
      )}
    >
      <span className="text-3xl md:text-4xl">{icon}</span>
      <span className="text-xs md:text-sm font-medium text-foreground text-center leading-tight">{label}</span>
      {count !== undefined && (
        <span className="text-xs text-muted-foreground">{count} listings</span>
      )}
    </button>
  );
};

export default CategoryCard;
