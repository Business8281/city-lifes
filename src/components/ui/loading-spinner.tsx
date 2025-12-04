import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
    className?: string;
    size?: number;
}

export const LoadingSpinner = ({ className, size = 24 }: LoadingSpinnerProps) => {
    return (
        <div className={cn("flex items-center justify-center min-h-[200px]", className)}>
            <Loader2 className="animate-spin text-primary" size={size} />
        </div>
    );
};
