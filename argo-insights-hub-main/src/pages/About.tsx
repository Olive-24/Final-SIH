import { Waves, Users, Globe, Database, Lightbulb, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const About = () => {
  const features = [
    {
      icon: Waves,
      title: "ARGO Float Network",
      description: "Global array of autonomous profiling floats measuring temperature, salinity, and biogeochemical parameters"
    },
    {
      icon: Database,
      title: "Real-time Data",
      description: "Access to near real-time oceanographic data from over 4,000 active floats worldwide"
    },
    {
      icon: Globe,
      title: "Global Coverage",
      description: "Comprehensive ocean observation system providing data from all major ocean basins"
    },
    {
      icon: Lightbulb,
      title: "AI-Powered Insights",
      description: "Advanced analytics and natural language processing for intelligent data exploration"
    }
  ];

  const team = [
    {
      name: "Dr. Sarah Ocean",
      role: "Principal Oceanographer",
      expertise: "Physical Oceanography"
    },
    {
      name: "Dr. Michael Current",
      role: "Data Scientist", 
      expertise: "Machine Learning & Analytics"
    },
    {
      name: "Dr. Lisa Depth",
      role: "Biogeochemist",
      expertise: "Ocean Chemistry & BGC"
    }
  ];

  return (
    <div className="min-h-full">
      {/* Hero Section */}
      <div className="relative bg-gradient-depth text-primary-foreground">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-6xl mx-auto px-6 py-24">
          <div className="text-center">
            <div className="w-20 h-20 bg-primary-foreground/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Waves className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="text-5xl font-bold mb-6">Ocean ARGO Program</h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Advancing our understanding of the global ocean through autonomous profiling floats 
              and cutting-edge data analysis technologies.
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="secondary" size="lg">
                Explore Data
              </Button>
              <Button variant="wave" size="lg">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            To provide the global community with comprehensive, real-time oceanographic data 
            through innovative technology and collaborative research, advancing our understanding 
            of ocean processes and climate systems.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-ocean transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-ocean rounded-lg flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">4,000+</div>
            <div className="text-sm text-muted-foreground">Active Floats</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">2.5M</div>
            <div className="text-sm text-muted-foreground">Profiles Collected</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">50+</div>
            <div className="text-sm text-muted-foreground">Countries</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">24/7</div>
            <div className="text-sm text-muted-foreground">Data Collection</div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8">Our Team</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map((member, index) => (
              <Card key={index}>
                <CardContent className="text-center pt-6">
                  <div className="w-16 h-16 bg-gradient-surface rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-foreground" />
                  </div>
                  <h4 className="font-semibold mb-1">{member.name}</h4>
                  <p className="text-sm text-primary mb-2">{member.role}</p>
                  <Badge variant="secondary">{member.expertise}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Technology Stack */}
        <Card className="bg-gradient-to-r from-card to-accent/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Technology Stack
            </CardTitle>
            <CardDescription>
              Built with modern technologies for scalability and performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["React", "TypeScript", "Tailwind CSS", "Node.js", "PostgreSQL", "Python", "Machine Learning", "Cloud Infrastructure"].map((tech) => (
                <Badge key={tech} variant="outline" className="justify-center py-2">
                  {tech}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold mb-4">Join Our Mission</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Whether you're a researcher, educator, or ocean enthusiast, explore our data 
            and contribute to advancing oceanographic science.
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="ocean" size="lg">
              <Heart className="w-4 h-4" />
              Get Involved
            </Button>
            <Button variant="outline" size="lg">
              View Documentation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;