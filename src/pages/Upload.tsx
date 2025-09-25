import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload as UploadIcon, Info, Home, Image, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api, endpoints, UploadResponse } from "@/lib/api";

const Upload = () => {
  const [uploadedImages, setUploadedImages] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    const validFiles: File[] = [];
    const maxBytes = 10 * 1024 * 1024; // 10MB
    for (const file of Array.from(files)) {
      if (file.size > maxBytes) {
        toast({ variant: "destructive", title: "Arquivo muito grande", description: `${file.name} excede 10MB.` });
        continue;
      }
      validFiles.push(file);
    }
    if (validFiles.length === 0) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      for (const file of validFiles) {
        formData.append("images", file);
      }
      const response = await api.post<UploadResponse>(endpoints.upload(), formData);
      setUploadedImages(prev => prev + (response?.uploaded ?? validFiles.length));
      toast({ title: "Upload concluído", description: `${response?.uploaded ?? validFiles.length} imagens enviadas.` });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Falha no upload", description: error?.message ?? "Tente novamente." });
    } finally {
      setIsUploading(false);
      // Reset file input to allow re-upload same files
      try { event.currentTarget.value = ""; } catch {}
    }
  };

  const handleIngest = () => {
    if (uploadedImages > 0) {
      toast({ title: "Imagens prontas", description: "Redirecionando para classificação." });
      window.location.href = "/classification";
    }
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
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-foreground">Upload de Imagens</h1>
            <p className="text-muted-foreground">
              Envie imagens de lesões de pele para análise e classificação profissional
            </p>
          </div>

          {/* Upload Tutorial Dialog */}
          <div className="flex justify-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="lg">
                  <Info className="w-5 h-5 mr-2" />
                  Como fazer upload adequado
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-xl">Guia para Upload de Imagens</DialogTitle>
                  <DialogDescription className="text-base">
                    Siga estas orientações para garantir a melhor qualidade na análise
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-success">✓ Faça assim:</h3>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Boa iluminação natural ou LED branco</li>
                        <li>• Imagem focada na lesão</li>
                        <li>• Distância de 15-30cm da lesão</li>
                        <li>• Pele limpa e seca</li>
                        <li>• Múltiplos ângulos da mesma lesão</li>
                        <li>• Formato JPG, PNG ou HEIC</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-destructive">✗ Evite:</h3>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Flash direto ou luz muito forte</li>
                        <li>• Imagens desfocadas ou tremidas</li>
                        <li>• Muito distante da lesão</li>
                        <li>• Reflexos ou sombras excessivas</li>
                        <li>• Presença de cremes ou curativos</li>
                        <li>• Arquivos muito comprimidos</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Upload Area */}
          <Card className="bg-gradient-card shadow-card">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <UploadIcon className="w-6 h-6" />
                Área de Upload
              </CardTitle>
              <CardDescription>
                Selecione as imagens das lesões de pele para envio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center space-y-4"
                >
                  <Image className="w-12 h-12 text-muted-foreground" />
                  <div className="space-y-1">
                    <p className="text-lg font-medium">Clique para selecionar imagens</p>
                    <p className="text-sm text-muted-foreground">
                      Ou arraste e solte aqui (máximo 10MB por imagem)
                    </p>
                  </div>
                  <Button variant="medical" disabled={isUploading}>
                    {isUploading ? "Enviando..." : "Selecionar Arquivos"}
                  </Button>
                </label>
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Fazendo upload das imagens...</p>
                  <Progress value={75} className="w-full" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Imagens Enviadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold">{uploadedImages}</span>
                  <Badge variant={uploadedImages > 0 ? "default" : "secondary"}>
                    {uploadedImages > 0 ? "Prontas" : "Nenhuma"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  {uploadedImages > 0 ? (
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-muted-foreground" />
                  )}
                  <span className="font-medium">
                    {uploadedImages > 0 ? "Pronto para ingestão" : "Aguardando upload"}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Ação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  variant="success"
                  size="sm"
                  onClick={handleIngest}
                  disabled={uploadedImages === 0}
                  className="w-full"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Finalizar Envio
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Upload;