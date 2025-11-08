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
        "flex flex-col items-center justify-center gap-1.5 p-2 md:p-4 rounded-lg border border-border bg-card hover:bg-muted hover:border-primary transition-all duration-300 hover:scale-105 active:scale-95 min-h-[80px] md:min-h-[100px] w-full",
        className
      )}
    >
      <span className="text-2xl md:text-4xl">{icon}</span>
      <span className="text-[10px] md:text-sm font-medium text-foreground text-center leading-tight break-words px-1">{label}</span>
      {count !== undefined && (
        <span className="text-[10px] text-muted-foreground">{count} listings</span>
      )}
    </button>
  );
};

export default CategoryCard;
