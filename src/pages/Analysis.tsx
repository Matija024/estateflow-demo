import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { EmptyState } from "@/components/ui/empty-state";
import { useToast } from "@/hooks/use-toast";
import { getMarketAnalysis, loadPortfolio, MarketData, PortfolioData } from "@/lib/api/analysis";
import { formatCurrency, formatPercentage } from "@/lib/api/base";
import { 
  TrendingUp, 
  Building, 
  Percent, 
  MapPin, 
  BarChart3,
  FolderOpen,
  CheckCircle,
  AlertCircle,
  Clock
} from "lucide-react";

export default function Analysis() {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [isLoadingMarket, setIsLoadingMarket] = useState(false);
  const [isLoadingPortfolio, setIsLoadingPortfolio] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const [marketFilters, setMarketFilters] = useState({
    region: "Süddeutschland",
    assetClass: "Büroimmobilien",
  });

  const handleLoadMarketAnalysis = async () => {
    try {
      setError(null);
      setIsLoadingMarket(true);
      
      const data = await getMarketAnalysis(marketFilters.region, marketFilters.assetClass);
      setMarketData(data);
      
      toast({
        title: "Marktanalyse geladen",
        description: "Aktuelle Marktdaten sind verfügbar.",
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Fehler beim Laden der Marktdaten"));
    } finally {
      setIsLoadingMarket(false);
    }
  };

  const handleLoadPortfolio = async () => {
    try {
      setError(null);
      setIsLoadingPortfolio(true);
      
      const data = await loadPortfolio();
      setPortfolioData(data);
      
      toast({
        title: "Portfolio geladen", 
        description: "Portfolio-Daten sind verfügbar.",
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Fehler beim Laden des Portfolios"));
    } finally {
      setIsLoadingPortfolio(false);
    }
  };

  const retryOperation = () => {
    setError(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-success" />;
      case 'maintenance': return <Clock className="w-4 h-4 text-warning" />;
      case 'vacant': return <AlertCircle className="w-4 h-4 text-destructive" />;
      default: return <CheckCircle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Aktiv';
      case 'maintenance': return 'Wartung';
      case 'vacant': return 'Leerstand';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Analysen</h1>
        <p className="text-muted-foreground">
          Analysieren Sie Markttrends und Portfolio-Performance mit interaktiven Dashboards.
        </p>
      </div>

      <Tabs defaultValue="market" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="market">Markt</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
        </TabsList>

        <ErrorBoundary error={error} onRetry={retryOperation} className="mb-6" />

        <TabsContent value="market" className="space-y-6">
          {/* Market Filters */}
          <Card className="estate-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Marktanalyse
              </CardTitle>
              <CardDescription>
                Analysieren Sie Markttrends für verschiedene Regionen und Asset-Klassen.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Region</label>
                  <Select 
                    value={marketFilters.region}
                    onValueChange={(value) => setMarketFilters(prev => ({...prev, region: value}))}
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
                  <label className="text-sm font-medium">Asset-Klasse</label>
                  <Select 
                    value={marketFilters.assetClass}
                    onValueChange={(value) => setMarketFilters(prev => ({...prev, assetClass: value}))}
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

                <div className="flex items-end">
                  <Button 
                    onClick={handleLoadMarketAnalysis}
                    disabled={isLoadingMarket}
                    className="w-full estate-gradient"
                  >
                    {isLoadingMarket ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Lädt...
                      </>
                    ) : (
                      "Analyse laden"
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Market Results */}
          {!marketData ? (
            <EmptyState
              icon={BarChart3}
              title="Noch keine Marktdaten geladen"
              description="Wählen Sie Filter aus und laden Sie die Marktanalyse."
            />
          ) : (
            <div className="space-y-6">
              {/* Market KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="estate-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <Building className="w-8 h-8 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Durchschnittsmiete</p>
                        <p className="text-2xl font-bold text-foreground">
                          {marketData.averageRent.toFixed(2)} €/m²
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="estate-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-8 h-8 text-success" />
                      <div>
                        <p className="text-sm text-muted-foreground">Preiswachstum</p>
                        <p className="text-2xl font-bold text-success">
                          +{formatPercentage(marketData.priceGrowth)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="estate-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <Percent className="w-8 h-8 text-warning" />
                      <div>
                        <p className="text-sm text-muted-foreground">Leerstand</p>
                        <p className="text-2xl font-bold text-foreground">
                          {formatPercentage(marketData.vacancy)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Simple Line Chart Placeholder */}
              <Card className="estate-card">
                <CardHeader>
                  <CardTitle>Mietpreis-Entwicklung</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-end justify-between gap-2 p-4">
                    {marketData.chartData.map((item, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div 
                          className="w-full bg-success rounded-t-md min-h-[2rem]"
                          style={{ 
                            height: `${(item.rent / 15) * 100}%`,
                            minHeight: '2rem'
                          }}
                        />
                        <span className="text-sm text-muted-foreground mt-2">
                          {item.period.split(' ')[1]}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-6">
          {/* Portfolio Load */}
          <Card className="estate-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5" />
                Portfolio Analyse
              </CardTitle>
              <CardDescription>
                Analysieren Sie die Performance Ihres Immobilien-Portfolios.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleLoadPortfolio}
                disabled={isLoadingPortfolio}
                className="estate-gradient"
                size="lg"
              >
                {isLoadingPortfolio ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Portfolio wird geladen...
                  </>
                ) : (
                  "Portfolio laden"
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Portfolio Results */}
          {!portfolioData ? (
            <EmptyState
              icon={FolderOpen}
              title="Noch kein Portfolio geladen"
              description="Klicken Sie auf 'Portfolio laden' um Ihre Portfolio-Daten zu analysieren."
            />
          ) : (
            <div className="space-y-6">
              {/* Portfolio KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="estate-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <Building className="w-8 h-8 text-accent" />
                      <div>
                        <p className="text-sm text-muted-foreground">Gesamtwert</p>
                        <p className="text-2xl font-bold text-foreground">
                          {formatCurrency(portfolioData.totalValue)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="estate-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <Percent className="w-8 h-8 text-success" />
                      <div>
                        <p className="text-sm text-muted-foreground">Durchschnittsrendite</p>
                        <p className="text-2xl font-bold text-success">
                          {formatPercentage(portfolioData.averageYield)}
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
                        <p className="text-sm text-muted-foreground">Belegungsquote</p>
                        <p className="text-2xl font-bold text-foreground">
                          {formatPercentage(portfolioData.occupancyRate)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Portfolio Properties Table */}
              <Card className="estate-card">
                <CardHeader>
                  <CardTitle>Portfolio Immobilien</CardTitle>
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
                          <th className="text-left py-3 px-4 font-semibold">Belegung</th>
                          <th className="text-left py-3 px-4 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {portfolioData.properties.map((property) => (
                          <tr key={property.id} className="border-b border-border last:border-b-0">
                            <td className="py-3 px-4 font-medium">{property.name}</td>
                            <td className="py-3 px-4 text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {property.city}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-success font-semibold">
                              {formatPercentage(property.yield)}
                            </td>
                            <td className="py-3 px-4 font-semibold">
                              {formatCurrency(property.value)}
                            </td>
                            <td className="py-3 px-4">
                              {formatPercentage(property.occupancy)}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(property.status)}
                                <span className="text-sm">{getStatusText(property.status)}</span>
                              </div>
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
        </TabsContent>
      </Tabs>
    </div>
  );
}