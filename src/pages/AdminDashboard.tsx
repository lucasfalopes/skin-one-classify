import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api, endpoints, AdminMetrics, AdminUserSummary } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";
import { Calendar as CalendarIcon, Home, Users, Image as ImageIcon, BarChart3, Download, ShieldAlert } from "lucide-react";
import { format } from "date-fns";

function isAdminUser(): boolean {
  try {
    const bypass = import.meta.env.VITE_BYPASS_AUTH === "true";
    if (bypass) return true;
    const user = JSON.parse(localStorage.getItem("skinone-user") || "null");
    const envEmails = (import.meta.env.VITE_ADMIN_EMAILS || "") as string;
    const adminEmails = envEmails
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
    return Boolean(user?.is_admin || (user?.email && adminEmails.includes(String(user.email).toLowerCase())));
  } catch {
    return false;
  }
}

type DateRange = { from?: Date; to?: Date };

const AdminDashboard = () => {
  const [search, setSearch] = useState("");
  const [range, setRange] = useState<DateRange>({});

  const useMocks = import.meta.env.VITE_USE_MOCKS === 'true';
  const { data: metrics, isLoading, refetch } = useQuery<AdminMetrics>({
    queryKey: ["admin-metrics", range.from?.toISOString(), range.to?.toISOString()],
    queryFn: async () => {
      if (useMocks) {
        // minimal mock for dev preview
        return {
          total_users: 3,
          total_images: 120,
          classified_images_count: 90,
          unclassified_images_count: 30,
          classifications_per_category: { estagio1: 40, estagio2: 25, estagio3: 15, estagio4: 5, nao_classificavel: 3, dtpi: 2 },
          classifications_by_user: [
            { id: '1', name: 'Dr. A', email: 'a@a.com', classification_count: 50, last_active: new Date().toISOString() },
            { id: '2', name: 'Dr. B', email: 'b@b.com', classification_count: 25 },
            { id: '3', name: 'Dra. C', email: 'c@c.com', classification_count: 15 },
          ],
          daily_classifications: Array.from({ length: 7 }).map((_, i) => ({ date: format(new Date(Date.now() - (6 - i) * 86400000), 'yyyy-MM-dd'), count: Math.floor(Math.random() * 20) + 1 })),
        } satisfies AdminMetrics;
      }
      const from = range.from ? format(range.from, "yyyy-MM-dd") : undefined;
      const to = range.to ? format(range.to, "yyyy-MM-dd") : undefined;
      return api.get<AdminMetrics>(endpoints.admin.metrics({ from, to }));
    },
  });

  const filteredUsers: AdminUserSummary[] = useMemo(() => {
    const list = metrics?.classifications_by_user ?? [];
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  }, [metrics, search]);

  const categories = useMemo(
    () => Object.entries(metrics?.classifications_per_category ?? {}).map(([stage, total]) => ({ stage, total })),
    [metrics],
  );

  const quickSetDays = (days: number) => {
    const to = new Date();
    const from = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    setRange({ from, to });
  };

  const handleExportCSV = () => {
    const header = ["id", "name", "email", "classification_count", "last_active"]; 
    const rows = filteredUsers.map((u) => [u.id, u.name, u.email, u.classification_count, u.last_active || "" ]);
    const csv = [header, ...rows]
      .map((r) => r.map((v) => `"${String(v).replaceAll('"', '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `usuarios-classificacoes-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isAdminUser()) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md shadow-card">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                <ShieldAlert className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-xl">Acesso restrito ao administrador</CardTitle>
            <CardDescription>Peça permissão a um administrador para acessar este painel.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Link to="/">
                <Button variant="outline" className="w-full">Voltar ao início</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              <Badge variant="outline" className="ml-2">Admin</Badge>
            </div>
            <Link to="/">
              <Button variant="outline" size="sm">
                <Home className="w-4 h-4 mr-2" />
                Início
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Title & Filters */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard Administrativo</h1>
              <p className="text-muted-foreground">Acompanhe usuários, imagens e classificações</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => quickSetDays(7)}>Últimos 7 dias</Button>
              <Button variant="outline" size="sm" onClick={() => quickSetDays(30)}>Últimos 30 dias</Button>
              <Button variant="outline" size="sm" onClick={() => setRange({})}>
                <CalendarIcon className="w-4 h-4 mr-2" /> Limpar período
              </Button>
              <Button variant="ghost" size="sm" onClick={() => void refetch()}>Atualizar</Button>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="shadow-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Usuários</CardTitle>
              </CardHeader>
              <CardContent className="flex items-end justify-between">
                <div className="text-3xl font-bold">{metrics?.total_users ?? (isLoading ? "--" : 0)}</div>
                <Users className="w-5 h-5 text-muted-foreground" />
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Imagens</CardTitle>
              </CardHeader>
              <CardContent className="flex items-end justify-between">
                <div className="text-3xl font-bold">{metrics?.total_images ?? (isLoading ? "--" : 0)}</div>
                <ImageIcon className="w-5 h-5 text-muted-foreground" />
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Classificadas</CardTitle>
              </CardHeader>
              <CardContent className="flex items-end justify-between">
                <div className="text-3xl font-bold">{metrics?.classified_images_count ?? (isLoading ? "--" : 0)}</div>
                <BarChart3 className="w-5 h-5 text-muted-foreground" />
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Pendentes</CardTitle>
              </CardHeader>
              <CardContent className="flex items-end justify-between">
                <div className="text-3xl font-bold">{metrics?.unclassified_images_count ?? (isLoading ? "--" : 0)}</div>
                <BarChart3 className="w-5 h-5 text-muted-foreground" />
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Classificações por Categoria</CardTitle>
                <CardDescription>Distribuição entre estágios</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{ bar: { color: "hsl(var(--primary))", label: "Total" } }} className="h-80">
                  <BarChart data={categories}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="stage" />
                    <YAxis allowDecimals={false} />
                    <ChartTooltip content={<ChartTooltipContent nameKey="stage" />} />
                    <Bar dataKey="total" fill="var(--color-bar)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Classificações Diárias</CardTitle>
                <CardDescription>Atividade por dia</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{ bar: { color: "hsl(var(--primary))", label: "#" } }} className="h-80">
                  <BarChart data={(metrics?.daily_classifications ?? []).map((d) => ({ ...d, label: d.date }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis allowDecimals={false} />
                    <ChartTooltip content={<ChartTooltipContent nameKey="label" />} />
                    <Bar dataKey="count" fill="var(--color-bar)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Users table */}
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Usuários</CardTitle>
                <CardDescription>Classificações por profissional</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Input placeholder="Buscar por nome ou email" value={search} onChange={(e) => setSearch(e.target.value)} className="w-64" />
                <Button variant="outline" size="sm" onClick={handleExportCSV}>
                  <Download className="w-4 h-4 mr-2" /> Exportar CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="text-right"># Classificações</TableHead>
                      <TableHead className="text-right">Última Atividade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell className="font-medium">{u.name}</TableCell>
                        <TableCell className="text-muted-foreground">{u.email}</TableCell>
                        <TableCell className="text-right">{u.classification_count}</TableCell>
                        <TableCell className="text-right">{u.last_active ? new Date(u.last_active).toLocaleString() : "—"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {filteredUsers.length === 0 && (
                  <div className="text-sm text-muted-foreground text-center py-6">Nenhum usuário encontrado</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
