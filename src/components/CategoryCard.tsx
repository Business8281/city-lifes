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
        "flex flex-col items-center justify-center gap-2 p-4 rounded-lg border border-border bg-card hover:bg-muted hover:border-primary transition-all duration-300 hover:scale-105 active:scale-95",
        className
      )}
    >
      <span className="text-4xl">{icon}</span>
      <span className="text-sm font-medium text-foreground text-center">{label}</span>
      {count !== undefined && (
        <span className="text-xs text-muted-foreground">{count} listings</span>
      )}
    </button>
  );
};

export default CategoryCard;
