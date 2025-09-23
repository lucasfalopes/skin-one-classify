import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  Users, 
  Target, 
  Shield, 
  ChevronRight, 
  Stethoscope,
  Eye,
  CheckCircle2,
  Activity,
  Heart,
  BarChart3
} from "lucide-react";
import heroImage from "@/assets/hero-medical.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50 shadow-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">S1</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Skin One
              </span>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/upload" className="text-muted-foreground hover:text-foreground transition-colors">
                Upload
              </Link>
              <Link to="/register" className="text-muted-foreground hover:text-foreground transition-colors">
                Área Profissional
              </Link>
              <Link to="/register">
                <Button variant="medical" size="sm">
                  <Stethoscope className="w-4 h-4 mr-2" />
                  Entrar
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="outline" className="border-white/20 text-white bg-white/10">
                  <Activity className="w-4 h-4 mr-1" />
                  Tecnologia Médica Avançada
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                  Classificação
                  <span className="block text-accent">Inteligente</span>
                  de Lesões de Pele
                </h1>
                <p className="text-xl text-white/90 leading-relaxed">
                  Plataforma hospitalar para acompanhamento e classificação profissional 
                  de doenças de pele com precisão e eficiência.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/upload">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    <Upload className="w-5 h-5 mr-2" />
                    Enviar Imagens
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10">
                    <Users className="w-5 h-5 mr-2" />
                    Acesso Profissional
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-medical bg-white/10 backdrop-blur-sm">
                <img
                  src={heroImage}
                  alt="Profissional médico analisando lesões de pele"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Como Funciona o Skin One
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Processo simples e seguro para análise profissional de lesões de pele
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center shadow-card bg-gradient-card border-0">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl">1. Upload Seguro</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Envie imagens das lesões seguindo as orientações médicas. 
                  Sistema criptografado e LGPD compliance.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center shadow-card bg-gradient-card border-0">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-8 h-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl">2. Análise Profissional</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Estomatoterapeutas certificados avaliam e classificam 
                  as lesões em estágios específicos.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center shadow-card bg-gradient-card border-0">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl">3. Acompanhamento</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Relatórios detalhados e evolução das lesões para 
                  melhor tomada de decisão clínica.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Medical Info Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Classificação de Lesões de Pele
              </h2>
              <p className="text-xl text-muted-foreground">
                Sistema baseado em diretrizes médicas internacionais
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-success">
                    <CheckCircle2 className="w-5 h-5" />
                    Estágios Iniciais (1-2)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-success/10 rounded-lg">
                    <h4 className="font-semibold text-success mb-2">Estágio 1</h4>
                    <p className="text-sm text-muted-foreground">
                      Eritema não branqueável em pele íntegra. Pode apresentar 
                      alterações na temperatura, consistência e sensibilidade.
                    </p>
                  </div>
                  <div className="p-4 bg-warning/10 rounded-lg">
                    <h4 className="font-semibold text-warning mb-2">Estágio 2</h4>
                    <p className="text-sm text-muted-foreground">
                      Perda parcial da espessura da pele com exposição da derme. 
                      Apresenta-se como úlcera superficial com leito vermelho-rosado.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-destructive">
                    <Target className="w-5 h-5" />
                    Estágios Avançados (3-4)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-destructive/10 rounded-lg">
                    <h4 className="font-semibold text-destructive mb-2">Estágio 3</h4>
                    <p className="text-sm text-muted-foreground">
                      Perda da espessura total da pele com exposição do tecido 
                      subcutâneo. Pode apresentar esfacelos e/ou escara.
                    </p>
                  </div>
                  <div className="p-4 bg-destructive/10 rounded-lg">
                    <h4 className="font-semibold text-destructive mb-2">Estágio 4</h4>
                    <p className="text-sm text-muted-foreground">
                      Perda da espessura total dos tecidos com exposição de 
                      músculos, tendões, ligamentos, cartilagem e/ou osso.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Pronto para Começar?
              </h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Faça parte da revolução no cuidado de lesões de pele. 
                Tecnologia e expertise médica trabalhando juntas.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/upload">
                <Button variant="secondary" size="lg">
                  <Upload className="w-5 h-5 mr-2" />
                  Enviar Primeira Imagem
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
                  <Heart className="w-5 h-5 mr-2" />
                  Sou Profissional de Saúde
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">S1</span>
              </div>
              <span className="text-xl font-bold text-foreground">Skin One</span>
            </div>
            <p className="text-muted-foreground">
              Plataforma hospitalar para classificação profissional de lesões de pele
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4" />
              <span>Dados protegidos • LGPD compliance • Certificado médico</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;