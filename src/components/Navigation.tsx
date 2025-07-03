
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, BarChart3, BookOpen } from "lucide-react";

export const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/analytics", icon: BarChart3, label: "Analytics" },
    { path: "/journal-history", icon: BookOpen, label: "Journal" },
  ];

  return (
    <nav className="bg-card border-b border-border/50 shadow-card">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-1">
            <h1 className="text-xl font-semibold text-primary">WellnessTracker</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Button
                  key={item.path}
                  asChild
                  variant={isActive ? "therapeutic" : "ghost"}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Link to={item.path}>
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </Link>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};
