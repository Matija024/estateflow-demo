import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { EmptyState } from "@/components/ui/empty-state";
import { useToast } from "@/hooks/use-toast";
import { generateReport, saveReportAsPdf, Report } from "@/lib/api/reports";
import { formatCurrency, formatPercentage } from "@/lib/api/base";
import { FileText, Download, TrendingUp, Building, Percent } from "lucide-react";

export default function Reports() {
  const [report, setReport] = useState<Report | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    period: "Q4 2024",
    region: "Süddeutschland", 
    assetClass: "Büroimmobilien",
    includeKpis: true,
  });

  const handleGenerateReport = async () => {
    try {
      setError(null);
      setIsGenerating(true);
      
      const newReport = await generateReport(formData);
      setReport(newReport);
      
      toast({
        title: "Report erfolgreich generiert",
        description: "Ihr Report ist bereit zur Ansicht.",
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unbekannter Fehler"));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveAsPdf = async () => {
    if (!report) return;

    try {
      setIsSaving(true);
      const result = await saveReportAsPdf(report.id);
      
      toast({
        title: "PDF gespeichert",
        description: `Report als ${result.filename} gespeichert.`,
      });
    } catch (err) {
      toast({
        title: "Fehler beim Speichern",
        description: "PDF konnte nicht erstellt werden.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const retryGeneration = () => {
    setError(null);
    handleGenerateReport();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Reports</h1>
        <p className="text-muted-foreground">
          Erstellen Sie detaillierte Immobilien-Reports mit aktuellen KPIs und Marktdaten.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Generator Form */}
        <div className="lg:col-span-1">
          <Card className="estate-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Report Konfiguration
              </CardTitle>
              <CardDescription>
                Wählen Sie die Parameter für Ihren Report aus.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="period">Zeitraum</Label>
                <Select 
                  value={formData.period} 
                  onValueChange={(value) => setFormData(prev => ({...prev, period: value}))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Q4 2024">Q4 2024</SelectItem>
                    <SelectItem value="Q3 2024">Q3 2024</SelectItem>
                    <SelectItem value="Jahr 2024">Jahr 2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <Select 
                  value={formData.region} 
                  onValueChange={(value) => setFormData(prev => ({...prev, region: value}))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Süddeutschland">Süddeutschland</SelectItem>
                    <SelectItem value="Norddeutschland">Norddeutschland</SelectItem>
                    <SelectItem value="Ostdeutschland">Ostdeutschland</SelectItem>
                    <SelectItem value="Westdeutschland">Westdeutschland</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="assetClass">Asset-Klasse</Label>
                <Select 
                  value={formData.assetClass} 
                  onValueChange={(value) => setFormData(prev => ({...prev, assetClass: value}))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Büroimmobilien">Büroimmobilien</SelectItem>
                    <SelectItem value="Wohnimmobilien">Wohnimmobilien</SelectItem>
                    <SelectItem value="Einzelhandel">Einzelhandel</SelectItem>
                    <SelectItem value="Logistik">Logistik</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="includeKpis"
                  checked={formData.includeKpis}
                  onCheckedChange={(checked) => setFormData(prev => ({...prev, includeKpis: checked}))}
                />
                <Label htmlFor="includeKpis">Portfolio-KPIs einschließen</Label>
              </div>

              <div className="space-y-3 pt-4">
                <Button 
                  onClick={handleGenerateReport}
                  disabled={isGenerating}
                  className="w-full estate-gradient"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Report wird generiert...
                    </>
                  ) : (
                    "Report generieren"
                  )}
                </Button>

                <Button 
                  onClick={handleSaveAsPdf}
                  disabled={!report || isSaving}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  {isSaving ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Speichere PDF...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Als PDF speichern
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Report Results */}
        <div className="lg:col-span-2">
          <ErrorBoundary error={error} onRetry={retryGeneration} className="mb-6" />
          
          {!report && !error && (
            <EmptyState
              icon={FileText}
              title="Noch kein Report generiert"
              description="Konfigurieren Sie die Parameter links und generieren Sie Ihren ersten Report."
            />
          )}

          {report && (
            <div className="space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="estate-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <Percent className="w-8 h-8 text-success" />
                      <div>
                        <p className="text-sm text-muted-foreground">Rendite</p>
                        <p className="text-2xl font-bold text-success">
                          {formatPercentage(report.data.kpis.yield)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="estate-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-8 h-8 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Belegung</p>
                        <p className="text-2xl font-bold text-foreground">
                          {formatPercentage(report.data.kpis.occupancy)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="estate-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <Building className="w-8 h-8 text-accent" />
                      <div>
                        <p className="text-sm text-muted-foreground">Gesamtwert</p>
                        <p className="text-2xl font-bold text-foreground">
                          {formatCurrency(report.data.kpis.totalValue)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Simple Chart Placeholder */}
              <Card className="estate-card">
                <CardHeader>
                  <CardTitle>Rendite-Entwicklung</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-end justify-between gap-2 p-4">
                    {report.data.chartData.map((item, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div 
                          className="w-full bg-primary rounded-t-md min-h-[2rem]"
                          style={{ 
                            height: `${(item.value / 5) * 100}%`,
                            minHeight: '2rem'
                          }}
                        />
                        <span className="text-sm text-muted-foreground mt-2">
                          {item.month}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Properties Table */}
              <Card className="estate-card">
                <CardHeader>
                  <CardTitle>Portfolio Übersicht</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 font-semibold">Objekt</th>
                          <th className="text-left py-3 px-4 font-semibold">Stadt</th>
                          <th className="text-left py-3 px-4 font-semibold">Rendite</th>
                          <th className="text-left py-3 px-4 font-semibold">Wert</th>
                        </tr>
                      </thead>
                      <tbody>
                        {report.data.table.map((row, index) => (
                          <tr key={index} className="border-b border-border last:border-b-0">
                            <td className="py-3 px-4 font-medium">{row.property}</td>
                            <td className="py-3 px-4 text-muted-foreground">{row.city}</td>
                            <td className="py-3 px-4 text-success font-semibold">
                              {formatPercentage(row.yield)}
                            </td>
                            <td className="py-3 px-4 font-semibold">
                              {formatCurrency(row.value)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}