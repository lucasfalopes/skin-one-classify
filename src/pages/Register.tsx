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

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    
    // Simular registro
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Você pode agora fazer login no sistema.",
      });
    }, 2000);
  };

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    
    // Simular login
    setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem("skinone-user", "logged-in");
      toast({
        title: "Login realizado com sucesso!",
        description: "Redirecionando para a área de classificação...",
      });
      navigate("/classification");
    }, 1500);
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
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Senha</Label>
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="Sua senha"
                        required
                      />
                    </div>
                    <Button type="submit" variant="medical" className="w-full" disabled={isLoading}>
                      {isLoading ? "Entrando..." : "Entrar"}
                    </Button>
                  </form>
                </CardContent>
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
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="coren">COREN</Label>
                      <Input
                        id="coren"
                        type="text"
                        placeholder="Número do COREN"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specialty">Especialização</Label>
                      <Select required>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione sua especialização" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="estomaoterapeuta">Estomaoterapeuta</SelectItem>
                          <SelectItem value="dermatologia">Dermatologia</SelectItem>
                          <SelectItem value="enfermagem">Enfermagem</SelectItem>
                          <SelectItem value="cirurgia-plastica">Cirurgia Plástica</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="institution">Instituição</Label>
                      <Input
                        id="institution"
                        type="text"
                        placeholder="Hospital ou clínica"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Senha</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Crie uma senha segura"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirmar Senha</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Confirme sua senha"
                        required
                      />
                    </div>
                    <Button type="submit" variant="medical" className="w-full" disabled={isLoading}>
                      {isLoading ? "Cadastrando..." : "Criar Conta"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Register;