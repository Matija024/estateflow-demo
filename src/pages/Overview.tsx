import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { 
  FileText, 
  Upload, 
  BarChart3, 
  MessageCircle,
  CheckCircle,
  TrendingUp,
  Shield,
  Zap,
  Users
} from "lucide-react";

const features = [
  {
    title: "Reports",
    description: "Erstellen Sie detaillierte Immobilien-Reports mit KPIs, Marktdaten und Portfolio-Analysen.",
    icon: FileText,
    path: "/reports",
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    title: "Dokumenten-Abruf", 
    description: "Laden Sie Dokumente hoch und durchsuchen Sie diese intelligent nach relevanten Informationen.",
    icon: Upload,
    path: "/documents",
    color: "text-green-600", 
    bgColor: "bg-green-50"
  },
  {
    title: "Analysen",
    description: "Analysieren Sie Markttrends und Portfolio-Performance mit interaktiven Dashboards.",
    icon: BarChart3,
    path: "/analysis",
    color: "text-purple-600",
    bgColor: "bg-purple-50"
  },
  {
    title: "Fragen & Antworten",
    description: "Stellen Sie kontextuelle Fragen zu Ihren Dokumenten und erhalten Sie KI-basierte Antworten.",
    icon: MessageCircle, 
    path: "/chat",
    color: "text-orange-600",
    bgColor: "bg-orange-50"
  }
];

const capabilities = [
  { icon: TrendingUp, text: "Automatisierte Marktanalysen und Trend-Erkennung" },
  { icon: Shield, text: "Sichere Dokumentenverwaltung und -suche" },
  { icon: Zap, text: "Schnelle Report-Generierung mit aktuellen KPIs" },
  { icon: Users, text: "Kollaborative Workspace für Asset Manager" },
  { icon: CheckCircle, text: "KI-gestützte Datenanalyse und Insights" }
];

export default function Overview() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Willkommen bei EstateFlow
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Ihre zentrale Plattform für Immobilien-Analytics, Dokumentenmanagement 
          und intelligente Datenanalyse.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature) => (
          <Card key={feature.title} className="estate-card hover:shadow-lg group">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </div>
              <CardDescription className="text-base leading-relaxed">
                {feature.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate(feature.path)}
                className="w-full estate-gradient hover:opacity-90"
                size="lg"
              >
                Los geht's
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* What's Possible Section */}
      <Card className="estate-card estate-gradient-subtle">
        <CardHeader>
          <CardTitle className="text-2xl text-center mb-6">
            Was ist mit EstateFlow möglich?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {capabilities.map((capability, index) => (
              <div key={index} className="flex items-start gap-3">
                <capability.icon className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <p className="text-sm text-foreground leading-relaxed">
                  {capability.text}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}