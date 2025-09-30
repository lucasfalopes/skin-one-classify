import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, LogOut, Upload, BarChart3, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { clearAuthToken, getAuthToken } from "@/lib/auth";

const UserMenu = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = getAuthToken();
      setIsLoggedIn(!!token);
    };

    checkAuthStatus();
    window.addEventListener('storage', checkAuthStatus);
    return () => window.removeEventListener('storage', checkAuthStatus);
  }, []);

  const handleLogout = () => {
    clearAuthToken();
    localStorage.removeItem("skinone-user");
    setIsLoggedIn(false);
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado do sistema.",
    });
    navigate("/");
  };

  if (!isLoggedIn) {
    return null;
  }

  const userIsAdmin = (() => {
    try {
      const user = JSON.parse(localStorage.getItem("skinone-user") || "null");
      const env = (import.meta.env.VITE_ADMIN_EMAILS || "") as string;
      const allow = env
        .split(",")
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);
      return Boolean(user?.is_admin || (user?.email && allow.includes(String(user.email).toLowerCase())));
    } catch {
      return false;
    }
  })();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuItem onClick={() => navigate("/upload")} className="cursor-pointer">
          <Upload className="mr-2 h-4 w-4" />
          <span>Upload de Imagens</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/classification")} className="cursor-pointer">
          <BarChart3 className="mr-2 h-4 w-4" />
          <span>Classificação</span>
        </DropdownMenuItem>
        {userIsAdmin && (
          <DropdownMenuItem onClick={() => navigate("/admin")} className="cursor-pointer">
            <Shield className="mr-2 h-4 w-4" />
            <span>Dashboard Admin</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;