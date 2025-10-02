import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, BarChart3, Stethoscope } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";

const Professional = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card shadow-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">S1</span>
                </div>
                <span className="text-xl font-bold text-foreground">Skin One</span>
              </Link>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-3">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                  <Stethoscope className="w-8 h-8 text-primary-foreground" />
                </div>
              </div>
              <h1 className="text-3xl font-bold">Área Profissional</h1>
              <p className="text-muted-foreground">O que você deseja fazer agora?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <Card className="shadow-card hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2">
                    <Upload className="w-5 h-5" /> Enviar Imagens
                  </CardTitle>
                  <CardDescription>Faça upload de novas imagens para classificação</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Link to="/upload">
                    <Button variant="medical">Ir para Upload</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="shadow-card hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2">
                    <BarChart3 className="w-5 h-5" /> Classificar Imagens
                  </CardTitle>
                  <CardDescription>Classifique imagens pendentes</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Link to="/classification">
                    <Button variant="medical">Ir para Classificação</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default Professional;
