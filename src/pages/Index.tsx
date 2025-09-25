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
import UserMenu from "@/components/UserMenu";
import { assertEnv } from "@/lib/env";

assertEnv();

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
              <Link to="/register" className="text-muted-foreground hover:text-foreground transition-colors">
                Área Profissional
              </Link>
              <UserMenu />
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
                  Sistema Hospitalar Profissional
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg leading-tight">
                  Skin One
                  <span className="block text-accent drop-shadow-lg">Plataforma</span>
                  de Classificação
                </h1>
                <p className="text-xl text-white drop-shadow-md leading-relaxed">
                  Sistema especializado para estomatoterapeutas classificarem lesões de pele 
                  seguindo protocolos NPUAP. Faça upload de imagens e obtenha classificações 
                  precisas para seus pacientes.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    <Stethoscope className="w-5 h-5 mr-2" />
                    Entrar no Sistema
                    <ChevronRight className="w-4 h-4 ml-2" />
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

      {/* Video Demo Section */}
      <section id="video-demo" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Como Usar o Sistema
              </h2>
              <p className="text-xl text-muted-foreground">
                Veja na prática como funciona o processo de upload e classificação de lesões
              </p>
            </div>
            <div className="aspect-video rounded-xl overflow-hidden shadow-medical bg-muted">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Demonstração Skin One - Upload e Classificação"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Project Motivation */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Motivação do Projeto
              </h2>
              <p className="text-xl text-muted-foreground">
                Por que desenvolvemos o Skin One
              </p>
            </div>
            
            <div className="space-y-8">
              <Card className="shadow-medical bg-card/95 backdrop-blur-sm border border-border/50 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl text-foreground">
                    <Heart className="w-6 h-6 text-destructive hover-scale transition-transform duration-300" />
                    O Problema
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-foreground leading-relaxed">
                  <p className="mb-4">
                    No Brasil, mais de <strong className="text-destructive">3 milhões de pessoas</strong> desenvolvem lesões por pressão anualmente, 
                    principalmente em ambiente hospitalar. A classificação inadequada dessas lesões resulta em:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-foreground/90">
                    <li>Tratamentos inadequados e prolongados</li>
                    <li>Custos hospitalares elevados (até R$ 50.000 por paciente)</li>
                    <li>Sofrimento desnecessário dos pacientes</li>
                    <li>Falta de padronização entre equipes médicas</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="shadow-medical bg-card/95 backdrop-blur-sm border border-border/50 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl text-foreground">
                    <Target className="w-6 h-6 text-success hover-scale transition-transform duration-300" />
                    Nossa Solução
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-foreground leading-relaxed">
                  <p className="mb-4">
                    O Skin One oferece uma plataforma centralizada onde estomatoterapeutas podem:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-foreground/90">
                    <li>Receber imagens padronizadas de lesões de pele</li>
                    <li>Classificar seguindo protocolos NPUAP/EPUAP internacionais</li>
                    <li>Gerar relatórios detalhados para as equipes médicas</li>
                    <li>Acompanhar a evolução do tratamento</li>
                    <li>Manter histórico digital organizado</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="shadow-medical bg-card/95 backdrop-blur-sm border border-border/50 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl text-foreground">
                    <BarChart3 className="w-6 h-6 text-primary hover-scale transition-transform duration-300" />
                    Impacto Esperado
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-foreground leading-relaxed">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Para Hospitais:</h4>
                      <ul className="list-disc pl-6 space-y-1 text-sm text-foreground/90">
                        <li>Redução de 40% no tempo de classificação</li>
                        <li>Padronização de protocolos</li>
                        <li>Diminuição de custos com tratamentos</li>
                        <li>Melhoria na qualidade do atendimento</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Para Pacientes:</h4>
                      <ul className="list-disc pl-6 space-y-1 text-sm text-foreground/90">
                        <li>Tratamentos mais precisos e rápidos</li>
                        <li>Menor tempo de internação</li>
                        <li>Redução de complicações</li>
                        <li>Melhor qualidade de vida</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
              <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                Acesse o Sistema Agora
              </h2>
              <p className="text-xl text-white drop-shadow-md max-w-2xl mx-auto">
                Faça login para começar a usar o Skin One. Upload de imagens e 
                classificação disponíveis apenas para profissionais autenticados.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button variant="secondary" size="lg">
                  <Stethoscope className="w-5 h-5 mr-2" />
                  Fazer Login
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
