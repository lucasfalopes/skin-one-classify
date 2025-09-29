import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Home, Info, LogOut, Eye, User, HelpCircle, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api, endpoints, ClassifyRequest, ClassifyResponse } from "@/lib/api";
import { clearAuthToken } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { listImages } from "@/lib/images";
import { Skeleton } from "@/components/ui/skeleton";

const Classification = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [classification, setClassification] = useState("");
  const [observationsEnabled, setObservationsEnabled] = useState(false);
  const [observations, setObservations] = useState("");
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [isFirstClassification, setIsFirstClassification] = useState(true);

  const { data: images = [], isLoading: isLoadingImages, isError: isImagesError } = useQuery({
    queryKey: ["images"],
    queryFn: listImages,
  });

  useEffect(() => {
    // Verificar se usuário está logado, respeitando bypass em dev
    const bypass = import.meta.env.VITE_BYPASS_AUTH === 'true';
    if (bypass) return;
    const user = localStorage.getItem("skinone-user");
    if (!user) {
      navigate("/register");
    }
  }, [navigate]);

  const handleLogout = () => {
    clearAuthToken();
    localStorage.removeItem("skinone-user");
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado do sistema.",
    });
    navigate("/");
  };

  const handleClassification = async () => {
    if (!classification) {
      toast({
        variant: "destructive",
        title: "Classificação necessária",
        description: "Por favor, selecione uma classificação para continuar.",
      });
      return;
    }

    if (images.length === 0) {
      // Demo mode: sem backend, apenas simula sucesso
      toast({ title: "Classificação salva (demo)", description: `Imagem classificada como: ${classification}${observationsEnabled && observations ? ` • Obs: ${observations}` : ""}` });
    } else {
      try {
        const current = imageList[currentImageIndex];
        const payload: ClassifyRequest = {
          image_id: String(current.id),
          stage: classification as ClassifyRequest["stage"],
          observations: observationsEnabled && observations ? observations : undefined,
        };
        const _response = await api.post<ClassifyResponse>(endpoints.classify(), payload);
        toast({ title: "Classificação salva!", description: `Imagem classificada como: ${classification}` });
      } catch (error: any) {
        toast({ variant: "destructive", title: "Falha ao salvar", description: error?.message ?? "Tente novamente." });
        return;
      }
    }

    // Mostrar formulário de feedback na primeira classificação
    if (isFirstClassification) {
      setShowFeedbackForm(true);
      setIsFirstClassification(false);
    }

    // Próxima imagem
    if (currentImageIndex < imageList.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
      setClassification("");
      setObservations("");
    } else {
      toast({
        title: "Todas as imagens foram classificadas!",
        description: "Obrigado pelo seu trabalho.",
      });
    }
  };

  const hasBackendImages = images.length > 0;
  const imageList = hasBackendImages
    ? images
    : [
        { id: "sample-1", url: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop", patient: "Paciente A" },
        { id: "sample-2", url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=400&fit=crop", patient: "Paciente B" },
        { id: "sample-3", url: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&h=400&fit=crop", patient: "Paciente C" },
      ];
  const currentImage = imageList[currentImageIndex];

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
              <Badge variant="outline" className="ml-4">
                <User className="w-4 h-4 mr-1" />
                Dr. Maria Silva
              </Badge>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Classificação de Lesões</h1>
              <p className="text-muted-foreground">
                Imagem {currentImageIndex + 1} de {imageList.length} • {currentImage.patient}
              </p>
            </div>
            
            {/* Tutorial Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Info className="w-4 h-4 mr-2" />
                  Tutorial
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle className="text-xl">Como Classificar Lesões de Pele</DialogTitle>
                  <DialogDescription>
                    Guia rápido para classificação de estágios de lesões
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-3 rounded-lg bg-muted">
                      <h3 className="font-semibold text-success">Estágio 1</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Eritema não branqueável em pele íntegra
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted">
                      <h3 className="font-semibold text-warning">Estágio 2</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Perda parcial da pele com exposição da derme
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted">
                      <h3 className="font-semibold text-destructive">Estágio 3</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Perda total da pele com exposição do tecido subcutâneo
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-3 rounded-lg bg-muted">
                      <h3 className="font-semibold text-destructive">Estágio 4</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Perda total da pele com exposição de músculos/ossos
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted">
                      <h3 className="font-semibold text-muted-foreground">Inexistente</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Não há lesão visível na imagem
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted">
                      <h3 className="font-semibold text-muted-foreground">Indefinido</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Imagem unclear ou necessita avaliação adicional
                      </p>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Display */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Imagem para Classificação
                </CardTitle>
                <CardDescription>{currentImage.patient}</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingImages ? (
                  <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                    <Skeleton className="w-full h-full" />
                  </div>
                ) : (
                  <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                    <img
                      src={currentImage.url}
                      alt="Lesão para classificação"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="mt-4 flex justify-center">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Visualizar em Tela Cheia
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Classification Panel */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Classificação da Lesão</CardTitle>
                <CardDescription>
                  Selecione o estágio apropriado baseado na sua avaliação clínica
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <RadioGroup value={classification} onValueChange={setClassification}>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted">
                      <RadioGroupItem value="estagio1" id="estagio1" />
                      <Label htmlFor="estagio1" className="flex-1 cursor-pointer">
                        <span className="font-medium text-success">Estágio 1</span>
                        <span className="block text-sm text-muted-foreground">
                          Eritema não branqueável
                        </span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted">
                      <RadioGroupItem value="estagio2" id="estagio2" />
                      <Label htmlFor="estagio2" className="flex-1 cursor-pointer">
                        <span className="font-medium text-warning">Estágio 2</span>
                        <span className="block text-sm text-muted-foreground">
                          Perda parcial da pele
                        </span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted">
                      <RadioGroupItem value="estagio3" id="estagio3" />
                      <Label htmlFor="estagio3" className="flex-1 cursor-pointer">
                        <span className="font-medium text-destructive">Estágio 3</span>
                        <span className="block text-sm text-muted-foreground">
                          Perda total da pele
                        </span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted">
                      <RadioGroupItem value="estagio4" id="estagio4" />
                      <Label htmlFor="estagio4" className="flex-1 cursor-pointer">
                        <span className="font-medium text-destructive">Estágio 4</span>
                        <span className="block text-sm text-muted-foreground">
                          Exposição de músculos/ossos
                        </span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted">
                      <RadioGroupItem value="nao_classificavel" id="nao_classificavel" />
                      <Label htmlFor="nao_classificavel" className="flex-1 cursor-pointer">
                        <span className="font-medium flex items-center gap-2">
                          <HelpCircle className="w-4 h-4" />
                          Não classificável
                        </span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted">
                      <RadioGroupItem value="dtpi" id="dtpi" />
                      <Label htmlFor="dtpi" className="flex-1 cursor-pointer">
                        <span className="font-medium">DTPI</span>
                        <span className="block text-sm text-muted-foreground">
                          Lesão por pressão de tecido profundo
                        </span>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="obs-toggle" className="cursor-pointer">Adicionar observações</Label>
                    <Switch id="obs-toggle" checked={observationsEnabled} onCheckedChange={setObservationsEnabled} />
                  </div>
                  {observationsEnabled && (
                    <div className="space-y-2">
                      <Label htmlFor="observations">Observações (opcional)</Label>
                      <Textarea
                        id="observations"
                        value={observations}
                        onChange={(e) => setObservations(e.target.value)}
                        placeholder="Notas clínicas adicionais, contexto, dúvidas..."
                        rows={4}
                      />
                    </div>
                  )}
                </div>

                <Button 
                  variant="medical" 
                  size="lg" 
                  className="w-full"
                  onClick={handleClassification}
                  disabled={isLoadingImages}
                >
                  Confirmar Classificação
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Feedback Form Dialog */}
      <Dialog open={showFeedbackForm} onOpenChange={setShowFeedbackForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-warning" />
              Feedback do Sistema
            </DialogTitle>
            <DialogDescription>
              Como podemos melhorar o app para facilitar suas classificações?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Compartilhe sugestões sobre interface, funcionalidades, qualidade das imagens, ou qualquer melhoria que facilitaria seu trabalho..."
              rows={4}
            />
            <div className="flex gap-2">
              <Button variant="medical" className="flex-1">
                Enviar Feedback
              </Button>
              <Button variant="outline" onClick={() => setShowFeedbackForm(false)}>
                Pular
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Classification;