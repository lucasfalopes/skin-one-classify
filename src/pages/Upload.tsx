import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload as UploadIcon, Info, Home, Image, CheckCircle2, AlertCircle, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api, endpoints, UploadResponse, UploadSingleResponse, UploadedImage, ClassifyRequest } from "@/lib/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const Upload = () => {
  const [uploadedImages, setUploadedImages] = useState(0); // batch counter
  const [isUploading, setIsUploading] = useState(false);

  // Single upload + classify state
  const [singleImage, setSingleImage] = useState<UploadedImage | null>(null);
  const [singleStage, setSingleStage] = useState<ClassifyRequest["stage"] | "">("");
  const [singleUploading, setSingleUploading] = useState(false);
  const [classifyingSingle, setClassifyingSingle] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureUrl, setCaptureUrl] = useState<string | null>(null);

  // Batch with stage state
  const [batchStage, setBatchStage] = useState<ClassifyRequest["stage"]>("estagio1");
  const { toast } = useToast();

  const handleBatchUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
      if (!response?.success) {
        const message = response?.error || "Falha desconhecida no upload.";
        toast({ variant: "destructive", title: "Falha no upload", description: message });
        return;
      }
      setUploadedImages(prev => prev + validFiles.length);
      toast({ title: "Upload concluído", description: `${validFiles.length} imagens enviadas.` });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Falha no upload", description: error?.message ?? "Tente novamente." });
    } finally {
      setIsUploading(false);
      // Reset file input to allow re-upload same files
      try { event.currentTarget.value = ""; } catch {}
    }
  };

  const handleSingleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast({ variant: "destructive", title: "Arquivo muito grande", description: `${file.name} excede 10MB.` });
      return;
    }
    setSingleUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const response = await api.post<UploadSingleResponse>(endpoints.uploadSingle(), formData);
      setSingleImage(response.image);
      toast({ title: "Upload concluído", description: `Imagem enviada. Selecione uma classificação.` });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Falha no upload", description: error?.message ?? "Tente novamente." });
    } finally {
      setSingleUploading(false);
      try { event.currentTarget.value = ""; } catch {}
    }
  };

  const handleOpenCamera = async () => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      // @ts-expect-error capture attribute widely supported on mobile
      input.capture = 'environment';
      input.onchange = (e: any) => void handleSingleUpload(e as React.ChangeEvent<HTMLInputElement>);
      input.click();
    } catch (e) {
      toast({ variant: 'destructive', title: 'Câmera', description: 'Não foi possível abrir a câmera.' });
    }
  };

  const handleClassifySingle = async () => {
    if (!singleImage || !singleStage) {
      toast({ variant: "destructive", title: "Selecione a classificação", description: "Escolha um estágio para continuar." });
      return;
    }
    setClassifyingSingle(true);
    try {
      await api.post(endpoints.classify(), { image_id: String(singleImage.id), stage: singleStage } satisfies ClassifyRequest);
      toast({ title: "Classificação salva", description: `Imagem classificada como ${singleStage}.` });
      setSingleImage(null);
      setSingleStage("");
    } catch (error: any) {
      toast({ variant: "destructive", title: "Falha ao classificar", description: error?.message ?? "Tente novamente." });
    } finally {
      setClassifyingSingle(false);
    }
  };

  const handleBatchWithStageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    const validFiles: File[] = [];
    const maxBytes = 10 * 1024 * 1024;
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
      for (const f of validFiles) formData.append("images", f);
      const res = await api.post<UploadResponse>(endpoints.uploadBatchWithStage(batchStage), formData);
      if (!res?.success) {
        const message = res?.error || "Falha desconhecida no upload/classificação.";
        toast({ variant: "destructive", title: "Falha no upload/classificação", description: message });
        return;
      }
      toast({ title: "Upload + classificação concluídos", description: `${validFiles.length} imagens como ${batchStage}.` });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Falha no upload/classificação", description: error?.message ?? "Tente novamente." });
    } finally {
      setIsUploading(false);
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

          {/* Upload Modes */}
          <Tabs defaultValue="batch" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="batch">Lote (Padrão)</TabsTrigger>
              <TabsTrigger value="single">Individual + Classificar</TabsTrigger>
              <TabsTrigger value="batchStage">Lote com Classificação</TabsTrigger>
            </TabsList>

            {/* Batch (existing) */}
            <TabsContent value="batch" className="space-y-6">
              <Card className="bg-gradient-card shadow-card">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2">
                    <UploadIcon className="w-6 h-6" />
                    Upload em Lote
                  </CardTitle>
                  <CardDescription>Selecione múltiplas imagens</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
                    <input type="file" multiple accept="image/*" onChange={handleBatchUpload} className="sr-only" id="file-upload-batch" />
                    <label htmlFor="file-upload-batch" className="cursor-pointer flex flex-col items-center space-y-4">
                      <Image className="w-12 h-12 text-muted-foreground" />
                      <div className="space-y-1">
                        <p className="text-lg font-medium">Clique para selecionar imagens</p>
                        <p className="text-sm text-muted-foreground">Ou arraste e solte aqui (máx 10MB)</p>
                      </div>
                      <Button asChild variant="medical" disabled={isUploading}>
                        <span>{isUploading ? "Enviando..." : "Selecionar Arquivos"}</span>
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="shadow-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Imagens Enviadas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold">{uploadedImages}</span>
                      <Badge variant={uploadedImages > 0 ? "default" : "secondary"}>{uploadedImages > 0 ? "Prontas" : "Nenhuma"}</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      {uploadedImages > 0 ? <CheckCircle2 className="w-5 h-5 text-success" /> : <AlertCircle className="w-5 h-5 text-muted-foreground" />}
                      <span className="font-medium">{uploadedImages > 0 ? "Pronto para ingestão" : "Aguardando upload"}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Ação</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button variant="success" size="sm" onClick={handleIngest} disabled={uploadedImages === 0} className="w-full">
                      <CheckCircle2 className="w-4 h-4 mr-2" /> Finalizar Envio
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Single + classify */}
            <TabsContent value="single" className="space-y-6">
              <Card className="shadow-card">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2">
                    <UploadIcon className="w-6 h-6" />
                    Upload Individual
                  </CardTitle>
                  <CardDescription>Envie uma imagem e classifique em seguida</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
                    <input type="file" accept="image/*" onChange={handleSingleUpload} className="sr-only" id="file-upload-single" />
                    <label htmlFor="file-upload-single" className="cursor-pointer flex flex-col items-center space-y-4">
                      <Image className="w-12 h-12 text-muted-foreground" />
                      <div className="space-y-1">
                        <p className="text-lg font-medium">Clique para selecionar uma imagem</p>
                        <p className="text-sm text-muted-foreground">Máximo 10MB</p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <Button onClick={handleOpenCamera} type="button" variant="outline" className="flex-1 sm:flex-none">
                          <Camera className="w-4 h-4 mr-2" /> Tirar foto agora
                        </Button>
                        <Button asChild variant="medical" disabled={singleUploading} className="flex-1 sm:flex-none">
                          <span>{singleUploading ? "Enviando..." : "Selecionar Arquivo"}</span>
                        </Button>
                      </div>
                    </label>
                  </div>

                  {singleImage && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card className="shadow-card">
                        <CardHeader>
                          <CardTitle>Pré-visualização</CardTitle>
                          <CardDescription>Imagem enviada</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                            <img src={singleImage.url} alt="Imagem enviada" className="w-full h-full object-cover" />
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="shadow-card">
                        <CardHeader>
                          <CardTitle>Classificação</CardTitle>
                          <CardDescription>Selecione o estágio</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <RadioGroup value={singleStage} onValueChange={(v) => setSingleStage(v as ClassifyRequest["stage"]) }>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted">
                                <RadioGroupItem value="estagio1" id="s1" />
                                <Label htmlFor="s1" className="flex-1 cursor-pointer">Estágio 1</Label>
                              </div>
                              <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted">
                                <RadioGroupItem value="estagio2" id="s2" />
                                <Label htmlFor="s2" className="flex-1 cursor-pointer">Estágio 2</Label>
                              </div>
                              <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted">
                                <RadioGroupItem value="estagio3" id="s3" />
                                <Label htmlFor="s3" className="flex-1 cursor-pointer">Estágio 3</Label>
                              </div>
                              <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted">
                                <RadioGroupItem value="estagio4" id="s4" />
                                <Label htmlFor="s4" className="flex-1 cursor-pointer">Estágio 4</Label>
                              </div>
                              <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted">
                                <RadioGroupItem value="nao_classificavel" id="snc" />
                                <Label htmlFor="snc" className="flex-1 cursor-pointer">Não classificável</Label>
                              </div>
                              <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted">
                                <RadioGroupItem value="dtpi" id="sdtpi" />
                                <Label htmlFor="sdtpi" className="flex-1 cursor-pointer">DTPI</Label>
                              </div>
                            </div>
                          </RadioGroup>
                          <Button variant="medical" className="w-full" onClick={handleClassifySingle} disabled={classifyingSingle}>
                            {classifyingSingle ? "Classificando..." : "Salvar Classificação"}
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Batch with pre-defined stage */}
            <TabsContent value="batchStage" className="space-y-6">
              <Card className="shadow-card">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2">
                    <UploadIcon className="w-6 h-6" />
                    Upload em Lote com Classificação
                  </CardTitle>
                  <CardDescription>Selecione o estágio e envie múltiplas imagens</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="mb-2 block">Classificação para todas as imagens</Label>
                    <RadioGroup value={batchStage} onValueChange={(v) => setBatchStage(v as ClassifyRequest["stage"]) }>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted"><RadioGroupItem value="estagio1" id="b1" /><span>Estágio 1</span></label>
                        <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted"><RadioGroupItem value="estagio2" id="b2" /><span>Estágio 2</span></label>
                        <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted"><RadioGroupItem value="estagio3" id="b3" /><span>Estágio 3</span></label>
                        <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted"><RadioGroupItem value="estagio4" id="b4" /><span>Estágio 4</span></label>
                        <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted"><RadioGroupItem value="nao_classificavel" id="bnc" /><span>Não classificável</span></label>
                        <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted"><RadioGroupItem value="dtpi" id="bdtpi" /><span>DTPI</span></label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
                    <input type="file" multiple accept="image/*" onChange={handleBatchWithStageUpload} className="sr-only" id="file-upload-batch-stage" />
                    <label htmlFor="file-upload-batch-stage" className="cursor-pointer flex flex-col items-center space-y-4">
                      <Image className="w-12 h-12 text-muted-foreground" />
                      <div className="space-y-1">
                        <p className="text-lg font-medium">Clique para selecionar imagens</p>
                        <p className="text-sm text-muted-foreground">Todas serão marcadas como {batchStage}</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full sm:w-auto">
                        <Button asChild variant="medical" disabled={isUploading} className="w-full">
                          <span>{isUploading ? "Enviando..." : "Selecionar Arquivos"}</span>
                        </Button>
                        <Button type="button" variant="outline" className="w-full" onClick={() => document.getElementById('file-upload-batch-stage')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))}>
                          Reabrir seletor
                        </Button>
                      </div>
                    </label>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Upload;