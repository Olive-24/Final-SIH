import { useState } from "react";
import { Send, Mic, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "assistant",
      content: "Hello! I'm your Ocean ARGO data assistant. Ask me about temperature profiles, salinity data, or specific float locations. For example: 'Show temperature profile in the North Atlantic at 1000m depth'",
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const suggestedQueries = [
    "Show temperature trends in the Pacific Ocean",
    "Find floats near the Gulf Stream",
    "Display salinity profiles from last month",
    "Compare temperature at 500m vs 1000m depth",
    "Show BGC data for the Mediterranean Sea"
  ];

  function generateResponse(input) {
    const text = input.toLowerCase();
    const now = new Date().toISOString().split("T")[0];

    if (text.includes("nearest") || text.includes("near me") || text.includes("closest")) {
      return (
        "I can look up nearby ARGO floats. For the demo, here are mock nearby floats:\n" +
        "- ID 2903456 at 12.1°N, 72.4°E (last profile: 2025-09-18)\n" +
        "- ID 2901123 at 10.8°N, 74.0°E (last profile: 2025-09-20)\n" +
        "Tap the Map page to see markers you can click for details."
      );
    }

    if (text.includes("compare") && (text.includes("bgc") || text.includes("oxygen") || text.includes("chlorophyll"))) {
      return (
        "Comparison (mock) for BGC parameters in the Arabian Sea (last 6 months):\n" +
        "- Mean oxygen at 200m: 165 µmol/kg → 158 µmol/kg (−4%)\n" +
        "- Mean chlorophyll at surface: 0.22 mg/m³ → 0.19 mg/m³ (−14%)\n" +
        "- Nitrate proxy indicates mild decrease consistent with post-monsoon mixing."
      );
    }

    if ((text.includes("salinity") || text.includes("temperature")) && (text.includes("equator") || text.match(/\b0\s*°?\s*[ns]?\b/))) {
      return (
        "Equatorial profile hint (mock):\n" +
        "- Surface temp ~ 28.5°C, salinity ~ 34.8 PSU in March 2023\n" +
        "- Thermocline near 100–150 m with 6–8°C drop\n" +
        "- Halocline weak; seasonal variability dominated by rainfall and currents."
      );
    }

    if (text.includes("arabian sea")) {
      return (
        "Arabian Sea figures (mock but realistic):\n" +
        "- SST (last 30 days) mean: 27.9°C, range 26.4–29.2°C\n" +
        "- Surface salinity: 35.6±0.2 PSU; 200 m: 35.0 PSU\n" +
        "- 0–1000 m heat content anomaly: +0.4 GJ/m² vs. 5-yr mean"
      );
    }

    if (text.includes("bay of bengal")) {
      return (
        "Bay of Bengal figures (mock but realistic):\n" +
        "- SST (last 30 days) mean: 28.6°C, freshening after rainfall\n" +
        "- Surface salinity: 33.8±0.4 PSU; 50–100 m halocline strong\n" +
        "- Mixed layer depth: ~25 m (monsoon season)"
      );
    }

    if (text.includes("salinity") || text.includes("temperature") || text.includes("profile")) {
      return (
        "Profile recipe (demo):\n" +
        "1) Identify floats in region/time window\n" +
        "2) Fetch NetCDF variables (TEMP, PSAL, PRES)\n" +
        "3) Plot depth vs variable with QC filters.\n" +
        `Try: "Show ${text.includes("salinity") ? "salinity" : "temperature"} at 0–1000 m for Arabian Sea (last month)".`
      );
    }

    if (text.includes("sql") || text.includes("query")) {
      return (
        "In the full system, I translate your request to SQL over float metadata and time-series, and join with vector-retrieved context. For this PoC, I’m returning curated guidance."
      );
    }

    return (
      `I parsed your request on ${now}. For the demo, here’s how I’d proceed: 1) detect region/time/variables, 2) select matching floats, 3) render map + profiles. Try the Map page to click markers for details.`
    );
  }

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    const newMessage = {
      id: messages.length + 1,
      type: "user",
      content: message,
      timestamp: new Date()
    };
    
    setMessages([...messages, newMessage]);
    setMessage("");
    
    // Simulated intelligent response (rule-based for PoC)
    setIsTyping(true);
    setTimeout(() => {
      const responseText = generateResponse(newMessage.content);
      const response = {
        id: messages.length + 2,
        type: "assistant",
        content: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-background to-accent/10">
      {/* Header */}
      <div className="p-6 border-b bg-card/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">AI Data Assistant</h1>
          <p className="text-muted-foreground">
            Ask questions about oceanographic data in natural language
          </p>
        </div>
      </div>

      <div className="flex-1 flex max-w-4xl mx-auto w-full">
        {/* Suggestions Sidebar */}
        <div className="w-80 p-6 border-r">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Search className="w-5 h-5" />
                Suggested Queries
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {suggestedQueries.map((query, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start text-left h-auto p-3 whitespace-normal"
                  onClick={() => setMessage(query)}
                >
                  {query}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-md p-4 rounded-lg ${
                  msg.type === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-card border shadow-sm'
                }`}>
                  <p className="mb-2">{msg.content}</p>
                  <p className="text-xs opacity-70">
                    {msg.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-md p-4 rounded-lg bg-card border shadow-sm">
                  <p className="mb-2">Assistant is typing…</p>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-6 border-t bg-card/50">
            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask about oceanographic data..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} variant="ocean">
                <Send className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Mic className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {["Temperature", "Salinity", "Depth", "Location", "BGC"].map((tag) => (
                <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;