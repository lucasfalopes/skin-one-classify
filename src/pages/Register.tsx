import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Home, UserPlus, LogIn, Stethoscope } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api, endpoints, LoginResponse } from "@/lib/api";
import { setAuthToken } from "@/lib/auth";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [specialty] = useState("enfermagem");

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData(event.currentTarget);
      const password = String(formData.get("password"));
      const confirm = String(formData.get("confirm-password"));
      if (password !== confirm) {
        toast({ variant: "destructive", title: "Senhas não conferem", description: "As senhas informadas são diferentes." });
        setIsLoading(false);
        return;
      }
      const payload = {
        name: String(formData.get("name")),
        email: String(formData.get("email")),
        password,
        coren: String(formData.get("coren")),
        specialty: "enfermagem",
      };
      console.log(payload);
      try { console.log("[DEBUG] /auth/register payload:", { ...payload, password: "***" }); } catch {}
      await api.post(endpoints.register(), payload);
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Você pode agora fazer login no sistema.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Falha no cadastro",
        description: error?.message ?? "Verifique os dados e tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData(event.currentTarget);
      const email = String(formData.get("login-email"));
      const password = String(formData.get("login-password"));
      try { console.log("[DEBUG] /auth/login payload:", { email, password: "***" }); } catch {}
      const response = await api.post<LoginResponse>(endpoints.login(), { email, password });
      setAuthToken(response.token);
      try { localStorage.setItem("skinone-user", JSON.stringify(response.user)); } catch {}
      toast({
        title: "Login realizado com sucesso!",
        description: "Redirecionando para a área de classificação...",
      });
      navigate("/classification");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Falha no login",
        description: error?.message ?? "Credenciais inválidas.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credential: string) => {
    try {
      const response = await api.post<LoginResponse>(endpoints.loginWithGoogle(), { id_token: credential });
      setAuthToken(response.token);
      try { localStorage.setItem("skinone-user", JSON.stringify(response.user)); } catch {}
      toast({ title: "Login com Google realizado!", description: "Redirecionando..." });
      navigate("/classification");
    } catch (error: any) {
      toast({ variant: "destructive", title: "Falha no Google Login", description: error?.message ?? "Tente novamente." });
    }
  };

  const onGoogleLoginSuccess = (credentialResponse: any) => {
    const cred = credentialResponse?.credential;
    if (cred) {
      void handleGoogleSuccess(cred);
    } else {
      toast({ variant: "destructive", title: "Google", description: "Credencial ausente." });
    }
  };

  const onGoogleLoginError = () => {
    toast({ variant: "destructive", title: "Google", description: "Falha na autenticação." });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">S1</span>
                </div>
                <span className="text-xl font-bold text-foreground">Skin One</span>
              </Link>
            </div>
            <Link to="/">
              <Button variant="outline" size="sm">
                <Home className="w-4 h-4 mr-2" />
                Voltar ao Início
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto space-y-8">
          {/* Page Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                <Stethoscope className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-foreground">Área Profissional</h1>
            <p className="text-muted-foreground">
              Acesso exclusivo para estomatoterapeutas certificados
            </p>
          </div>

          {/* Auth Tabs */}
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" className="flex items-center gap-2">
                <LogIn className="w-4 h-4" />
                Login
              </TabsTrigger>
              <TabsTrigger value="register" className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Cadastro
              </TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
              <Card className="shadow-card bg-gradient-card">
                <CardHeader>
                  <CardTitle>Fazer Login</CardTitle>
                  <CardDescription>
                    Entre com suas credenciais para acessar o sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="seu@email.com"
                        name="login-email"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Senha</Label>
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="Sua senha"
                        name="login-password"
                        required
                      />
                    </div>
                    <Button type="submit" variant="medical" className="w-full" disabled={isLoading}>
                      {isLoading ? "Entrando..." : "Entrar"}
                    </Button>
                  </form>
                </CardContent>
                {/* Google login removido */}
              </Card>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register">
              <Card className="shadow-card bg-gradient-card">
                <CardHeader>
                  <CardTitle>Novo Cadastro</CardTitle>
                  <CardDescription>
                    Registre-se como estomaoterapeuta para usar o sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Completo</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Seu nome completo"
                        name="name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        name="email"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="coren">COREN</Label>
                      <Input
                        id="coren"
                        type="text"
                        placeholder="Número do COREN"
                        name="coren"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Especialização</Label>
                      <Input value="Enfermagem" disabled />
                    </div>
                    {/* Campo Instituição removido */}
                    <div className="space-y-2">
                      <Label htmlFor="password">Senha</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Crie uma senha segura"
                        name="password"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirmar Senha</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Confirme sua senha"
                        name="confirm-password"
                        required
                      />
                    </div>
                    <Button type="submit" variant="medical" className="w-full" disabled={isLoading}>
                      {isLoading ? "Cadastrando..." : "Criar Conta"}
                    </Button>
                  </form>
                </CardContent>
                {/* Google cadastro removido */}
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Register;