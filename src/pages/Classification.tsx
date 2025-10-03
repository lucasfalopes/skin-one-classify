import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Home, Info, LogOut, Eye, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api, endpoints, ClassifyRequest, ClassifyResponse } from "@/lib/api";
import { clearAuthToken } from "@/lib/auth";
// Removed react-query usage for this screen; we fetch directly
import { Skeleton } from "@/components/ui/skeleton";

const Classification = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [classification, setClassification] = useState("");
  const [observationsEnabled, setObservationsEnabled] = useState(false);
  const [observations, setObservations] = useState("");
  // Feedback disabled temporarily
  // const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  // const [isFirstClassification, setIsFirstClassification] = useState(true);
  const [showBatchDone, setShowBatchDone] = useState(false);

  const [backendImages, setBackendImages] = useState<Array<{ id: string; url: string }>>([]);
  const [loadingBackendImages, setLoadingBackendImages] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [showNoImages, setShowNoImages] = useState(false);

  const fetchBackendImages = async (): Promise<Array<{ id: string; url: string }>> => {
    const rawUser = localStorage.getItem("skinone-user");
    const user = rawUser ? JSON.parse(rawUser) : null;
    const search = new URLSearchParams(location.search);
    const batchId = search.get("id");
    const userId = batchId ?? user?.id ?? user?.pk ?? user?.uuid ?? user?.email ?? "unknown";
    // header must include user id
    const headers: Record<string, string> = { "X-User-ID": String(userId) };
    return api.getWithHeaders<Array<{ id: string; url: string }>>(endpoints.classificationImages(String(userId)), headers);
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoadingBackendImages(true);
      setFetchError(null);
      try {
        const items = await fetchBackendImages();
        if (mounted) {
          const list = items ?? [];
          setBackendImages(list);
          if (list.length === 0) {
            setShowNoImages(true);
          }
        }
      } catch (e: any) {
        if (mounted) setFetchError(e?.message ?? "Falha ao carregar imagens para classificação");
      } finally {
        if (mounted) setLoadingBackendImages(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

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

    if (totalImages === 0) {
      // Demo mode: sem backend, apenas simula sucesso
      toast({ title: "Classificação salva (demo)", description: `Imagem classificada como: ${classification}${observationsEnabled && observations ? ` • Obs: ${observations}` : ""}` });
    } else {
      try {
        const current = backendImages[currentImageIndex];
        const payload: ClassifyRequest = {
          image_id: String(current.id),
          stage: classification as ClassifyRequest["stage"],
          observations: observationsEnabled && observations ? observations : undefined,
        };
        // enviar header com id do usuário
        const rawUser = localStorage.getItem("skinone-user");
        const user = rawUser ? JSON.parse(rawUser) : null;
        const userId = user?.id ?? user?.pk ?? user?.uuid ?? user?.email ?? "unknown";
        const headers: Record<string, string> = { "X-User-ID": String(userId) };
        const _response = await api.postWithHeaders<ClassifyResponse>(endpoints.classify(), payload, headers);
        toast({ title: "Classificação salva!", description: `Imagem classificada como: ${classification}` });
      } catch (error: any) {
        toast({ variant: "destructive", title: "Falha ao salvar", description: error?.message ?? "Tente novamente." });
        return;
      }
    }

    // Feedback disabled temporarily
    // if (isFirstClassification) {
    //   setShowFeedbackForm(true);
    //   setIsFirstClassification(false);
    // }

    // Próxima imagem
    if (currentImageIndex < totalImages - 1) {
      setCurrentImageIndex(prev => prev + 1);
      setClassification("");
      setObservations("");
    } else {
      setShowBatchDone(true);
    }
  };

  // Sempre usar o lote vindo do backend; quando vazio, mostrar estado vazio
  const totalImages = backendImages.length;
  const currentImage = totalImages > 0 ? backendImages[currentImageIndex] : null;

  // Clamp do índice quando o lote muda
  useEffect(() => {
    setCurrentImageIndex((prev) => {
      if (totalImages === 0) return 0;
      return Math.min(prev, totalImages - 1);
    });
  }, [totalImages]);

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
                {totalImages > 0 ? (
                  <>Imagem {Math.min(currentImageIndex + 1, totalImages)} de {totalImages}</>
                ) : (
                  <>Nenhuma imagem para classificar</>
                )}
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
                <CardDescription>
                  {totalImages > 0 ? `Total no lote: ${totalImages}` : "Aguardando imagens"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingBackendImages ? (
                  <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                    <Skeleton className="w-full h-full" />
                  </div>
                ) : currentImage ? (
                  <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                    <img src={currentImage.url} alt="Lesão para classificação" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="aspect-square bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                    Nenhuma imagem disponível
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
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="relative">
                      <RadioGroupItem value="stage1" id="estagio1" className="peer sr-only" />
                      <Label htmlFor="estagio1" className="block p-3 border rounded-lg text-center cursor-pointer select-none peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5">
                        <span className="font-medium text-success">Estágio 1</span>
                        <span className="block text-xs text-muted-foreground">Eritema não branqueável</span>
                      </Label>
                    </div>
                    <div className="relative">
                      <RadioGroupItem value="stage2" id="estagio2" className="peer sr-only" />
                      <Label htmlFor="estagio2" className="block p-3 border rounded-lg text-center cursor-pointer select-none peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5">
                        <span className="font-medium text-warning">Estágio 2</span>
                        <span className="block text-xs text-muted-foreground">Perda parcial da pele</span>
                      </Label>
                    </div>
                    <div className="relative">
                      <RadioGroupItem value="stage3" id="estagio3" className="peer sr-only" />
                      <Label htmlFor="estagio3" className="block p-3 border rounded-lg text-center cursor-pointer select-none peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5">
                        <span className="font-medium text-destructive">Estágio 3</span>
                        <span className="block text-xs text-muted-foreground">Perda total da pele</span>
                      </Label>
                    </div>
                    <div className="relative">
                      <RadioGroupItem value="stage4" id="estagio4" className="peer sr-only" />
                      <Label htmlFor="estagio4" className="block p-3 border rounded-lg text-center cursor-pointer select-none peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5">
                        <span className="font-medium text-destructive">Estágio 4</span>
                        <span className="block text-xs text-muted-foreground">Músculos/ossos expostos</span>
                      </Label>
                    </div>
                    <div className="relative">
                      <RadioGroupItem value="not_classifiable" id="nao_classificavel" className="peer sr-only" />
                      <Label htmlFor="nao_classificavel" className="block p-3 border rounded-lg text-center cursor-pointer select-none peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5">
                        <span className="font-medium">Não classificável</span>
                        <span className="block text-xs text-muted-foreground">Indeterminado</span>
                      </Label>
                    </div>
                    <div className="relative">
                      <RadioGroupItem value="dtpi" id="dtpi" className="peer sr-only" />
                      <Label htmlFor="dtpi" className="block p-3 border rounded-lg text-center cursor-pointer select-none peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5">
                        <span className="font-medium">DTPI</span>
                        <span className="block text-xs text-muted-foreground">Tecido profundo</span>
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
                  disabled={loadingBackendImages || totalImages === 0}
                >
                  Confirmar Classificação
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/** Feedback disabled temporarily */}
      {/**
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
      */}

      {/* Batch Completed Dialog */}
      <Dialog open={showBatchDone} onOpenChange={setShowBatchDone}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Parabéns!</DialogTitle>
            <DialogDescription>
              O lote foi classificado com sucesso. Obrigado por ajudar na classificação.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <Button
              variant="medical"
              className="flex-1"
              onClick={() => {
                setShowBatchDone(false);
                // Recarrega a página de classificação para buscar novo lote
                navigate(`/classification`);
              }}
            >
              Continuar classificando
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setShowBatchDone(false);
                navigate(`/professional`);
              }}
            >
              Voltar à Área Profissional
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* No Images Available Dialog */}
      <Dialog open={showNoImages} onOpenChange={setShowNoImages}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Obrigado!</DialogTitle>
            <DialogDescription>
              Todas as imagens disponíveis já foram classificadas no momento. Volte mais tarde ou faça novos uploads.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end mt-4">
            <Button
              variant="medical"
              onClick={() => {
                setShowNoImages(false);
                navigate(`/professional`);
              }}
            >
              Ir para Área Profissional
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Classification;