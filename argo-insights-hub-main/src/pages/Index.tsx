import { ArrowRight, Database, Globe, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-ocean.jpg";

const Index = () => {
  const features = [
    {
      icon: Database,
      title: "Real-time Data",
      description: "Access live oceanographic data from thousands of ARGO floats worldwide"
    },
    {
      icon: Globe,
      title: "Global Coverage",
      description: "Comprehensive ocean monitoring across all major ocean basins"
    },
    {
      icon: TrendingUp,
      title: "Advanced Analytics",
      description: "AI-powered insights and trend analysis for oceanographic research"
    },
    {
      icon: Users,
      title: "Collaborative Platform",
      description: "Connect with researchers and access shared datasets globally"
    }
  ];

  const stats = [
    { value: "4,000+", label: "Active Floats" },
    { value: "2.5M", label: "Profiles" },
    { value: "96%", label: "Ocean Coverage" },
    { value: "50+", label: "Countries" }
  ];

  return (
    <div className="min-h-full">
      {/* Hero Section */}
      <div 
        className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-secondary/60" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center text-primary-foreground">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 animate-fade-in">
            Explore the
            <span className="block bg-gradient-to-r from-primary-glow to-secondary bg-clip-text text-transparent">
              Ocean's Depths
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Advanced oceanographic data platform powered by the global ARGO float network. 
            Discover temperature profiles, salinity patterns, and marine insights through AI-driven analysis.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="xl" asChild>
              <Link to="/chat">
                Start Exploring
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button variant="wave" size="xl" asChild>
              <Link to="/map">
                View Global Map
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-card/50 backdrop-blur-sm border-y">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold text-primary">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Powerful Ocean Data Platform
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Harness the power of global oceanographic data with our advanced platform 
            designed for researchers, educators, and ocean enthusiasts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-ocean transition-all duration-300 group">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-ocean rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-depth text-primary-foreground">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Dive Deep?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of researchers exploring oceanographic data with our AI-powered platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" asChild>
              <Link to="/dashboard">
                View Dashboard
              </Link>
            </Button>
            <Button variant="wave" size="lg" asChild>
              <Link to="/about">
                Learn More
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Access */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h3 className="text-2xl font-bold text-center mb-8">Quick Access</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/chat">
            <Card className="hover:shadow-ocean transition-shadow cursor-pointer">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-ocean rounded-full flex items-center justify-center mx-auto mb-4">
                  <Database className="w-8 h-8 text-primary-foreground" />
                </div>
                <h4 className="font-semibold mb-2">AI Chat Assistant</h4>
                <p className="text-sm text-muted-foreground">
                  Ask natural language questions about ocean data
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/map">
            <Card className="hover:shadow-ocean transition-shadow cursor-pointer">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-surface rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-foreground" />
                </div>
                <h4 className="font-semibold mb-2">Interactive Map</h4>
                <p className="text-sm text-muted-foreground">
                  Explore float positions and real-time data
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/dashboard">
            <Card className="hover:shadow-ocean transition-shadow cursor-pointer">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-depth rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-primary-foreground" />
                </div>
                <h4 className="font-semibold mb-2">Analytics Dashboard</h4>
                <p className="text-sm text-muted-foreground">
                  View trends and statistical insights
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
