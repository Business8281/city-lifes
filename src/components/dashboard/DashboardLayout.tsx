import { ReactNode } from "react";

interface DashboardLayoutProps {
    children: ReactNode;
    title?: string;
    actions?: ReactNode;
}

export function DashboardLayout({ children, title = "Dashboard", actions }: DashboardLayoutProps) {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
                <div className="flex items-center space-x-2">
                    {actions}
                </div>
            </div>
            <div className="space-y-4">
                {children}
            </div>
        </div>
    );
}
