import { useMemo, useRef, useState } from "react";
import { Filter, Download, Play, Pause, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const MapView = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedParameter, setSelectedParameter] = useState("temperature");
  const [depthRange, setDepthRange] = useState([0, 2000]);
  const [searchText, setSearchText] = useState("");
  const mapRef = useRef(null as unknown as L.Map);
  const [selectedFloatId, setSelectedFloatId] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const mockFloats = [
    // Indian Ocean region expanded mock points (IDs are illustrative)
    { id: "2903456", lat: 12.1, lon: 72.4, temp: 28.2, psu: 35.5, oxy: 190, chl: 0.22, status: "active", last: "2025-09-18" },
    { id: "2901123", lat: 10.8, lon: 74.0, temp: 27.9, psu: 35.6, oxy: 188, chl: 0.20, status: "active", last: "2025-09-20" },
    { id: "2909981", lat: 14.5, lon: 70.2, temp: 28.6, psu: 35.4, oxy: 185, chl: 0.18, status: "inactive", last: "2025-08-30" },
    { id: "3902210", lat: -5.2, lon: 80.1, temp: 27.3, psu: 34.8, oxy: 200, chl: 0.25, status: "active", last: "2025-09-17" },
    { id: "3902211", lat: -12.3, lon: 76.8, temp: 26.7, psu: 34.9, oxy: 205, chl: 0.27, status: "active", last: "2025-09-12" },
    { id: "3902212", lat: 8.4, lon: 68.2, temp: 28.9, psu: 35.7, oxy: 186, chl: 0.19, status: "active", last: "2025-09-19" },
    { id: "3902213", lat: 16.2, lon: 66.7, temp: 28.1, psu: 35.6, oxy: 182, chl: 0.17, status: "active", last: "2025-09-18" },
    { id: "3902214", lat: 19.0, lon: 64.1, temp: 27.6, psu: 35.5, oxy: 180, chl: 0.16, status: "inactive", last: "2025-08-25" },
    { id: "3902215", lat: 6.5, lon: 78.3, temp: 28.8, psu: 35.3, oxy: 192, chl: 0.24, status: "active", last: "2025-09-21" },
    { id: "3902216", lat: 2.1, lon: 77.0, temp: 28.7, psu: 35.2, oxy: 195, chl: 0.23, status: "active", last: "2025-09-20" },
    { id: "3902217", lat: -1.3, lon: 73.9, temp: 28.9, psu: 35.1, oxy: 198, chl: 0.26, status: "active", last: "2025-09-22" },
    { id: "3902218", lat: -4.7, lon: 70.5, temp: 27.9, psu: 35.0, oxy: 202, chl: 0.28, status: "active", last: "2025-09-15" },
    { id: "3902219", lat: -9.8, lon: 68.0, temp: 27.1, psu: 34.9, oxy: 207, chl: 0.30, status: "inactive", last: "2025-08-19" },
    { id: "3902220", lat: -15.2, lon: 72.2, temp: 26.4, psu: 34.8, oxy: 210, chl: 0.29, status: "active", last: "2025-09-13" },
    { id: "3902221", lat: -18.9, lon: 76.4, temp: 25.9, psu: 34.7, oxy: 215, chl: 0.31, status: "active", last: "2025-09-11" },
    { id: "3902222", lat: -22.1, lon: 80.0, temp: 24.8, psu: 34.6, oxy: 220, chl: 0.33, status: "active", last: "2025-09-09" },
    { id: "3902223", lat: -25.5, lon: 74.3, temp: 24.1, psu: 34.5, oxy: 222, chl: 0.35, status: "active", last: "2025-09-10" },
    { id: "3902224", lat: -28.0, lon: 69.7, temp: 23.7, psu: 34.4, oxy: 225, chl: 0.34, status: "inactive", last: "2025-08-05" },
    { id: "3902225", lat: -12.7, lon: 84.2, temp: 26.8, psu: 34.9, oxy: 209, chl: 0.27, status: "active", last: "2025-09-16" },
    { id: "3902226", lat: -6.3, lon: 86.5, temp: 27.5, psu: 35.0, oxy: 205, chl: 0.26, status: "active", last: "2025-09-18" },
    { id: "3902227", lat: 4.2, lon: 83.1, temp: 28.4, psu: 35.4, oxy: 196, chl: 0.22, status: "active", last: "2025-09-20" },
    { id: "3902228", lat: 11.8, lon: 81.4, temp: 28.0, psu: 35.6, oxy: 190, chl: 0.21, status: "active", last: "2025-09-19" },
    { id: "3902229", lat: 18.6, lon: 78.9, temp: 27.2, psu: 35.5, oxy: 185, chl: 0.20, status: "active", last: "2025-09-14" },
  ];

  const activeIcon = useMemo(() => L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41]
  }), []);

  const inactiveIcon = useMemo(() => L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    className: "grayscale"
  }), []);

  function handleSearch() {
    const txt = searchText.trim();
    // Accept formats like: "12.1,72.4" or "12.1, 72.4" or "12.1 72.4"
    const match = txt.match(/(-?\d+\.?\d*)\s*(?:,|\s)\s*(-?-?\d+\.?\d*)/);
    if (match) {
      const lat = parseFloat(match[1]);
      const lon = parseFloat(match[2]);
      if (!isNaN(lat) && !isNaN(lon) && mapRef.current) {
        mapRef.current.flyTo([lat, lon], 6, { duration: 1.0 });
      }
    }
  }

  function handleExportCsv() {
    const header = ["id", "lat", "lon", "temp", "status"]; 
    const rows = mockFloats.map(f => [f.id, f.lat, f.lon, f.temp, f.status]);
    const csv = [header, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mock_floats_indian_ocean.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const regionPresets = [
    { name: "Arabian Sea", center: [15, 65], zoom: 5 },
    { name: "Bay of Bengal", center: [15, 90], zoom: 5 },
    { name: "Equatorial IO", center: [0, 80], zoom: 4 },
    { name: "South IO Gyre", center: [-30, 70], zoom: 4 }
  ] as { name: string; center: [number, number]; zoom: number }[];

  function openProfileModal(floatId: string) {
    setSelectedFloatId(floatId);
    setIsProfileOpen(true);
  }

  function generateMockProfile(): { depth: number; value: number }[] {
    // Simple decreasing temperature with depth
    const points: { depth: number; value: number }[] = [];
    for (let d = 0; d <= 1000; d += 100) {
      const surface = 28.5;
      const value = surface - (d / 1000) * 15 - Math.random() * 0.5;
      points.push({ depth: d, value: parseFloat(value.toFixed(2)) });
    }
    return points;
  }

  return (
    <div className="h-full flex">
      {/* Control Panel */}
      <div className="w-80 p-6 border-r bg-card/30 backdrop-blur-sm overflow-y-auto">
        <div className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Filter className="w-5 h-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Region presets</label>
                  <div className="grid grid-cols-2 gap-2">
                    {regionPresets.map((r) => (
                      <Button key={r.name} variant="outline" onClick={() => mapRef.current?.flyTo(r.center, r.zoom)}>
                        {r.name}
                      </Button>
                    ))}
                  </div>
                </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Go to coordinates</label>
                <div className="flex gap-2">
                  <Input
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="e.g. 12.1, 72.4"
                  />
                  <Button variant="secondary" onClick={handleSearch}>Go</Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Parameter</label>
                <Select value={selectedParameter} onValueChange={setSelectedParameter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="temperature">Temperature</SelectItem>
                    <SelectItem value="salinity">Salinity</SelectItem>
                    <SelectItem value="oxygen">Dissolved Oxygen</SelectItem>
                    <SelectItem value="chlorophyll">Chlorophyll</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Depth Range: {depthRange[0]}m - {depthRange[1]}m
                </label>
                <Slider
                  value={depthRange}
                  onValueChange={setDepthRange}
                  max={6000}
                  min={0}
                  step={100}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Time Range</label>
                <Select defaultValue="last-30-days">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last-7-days">Last 7 days</SelectItem>
                    <SelectItem value="last-30-days">Last 30 days</SelectItem>
                    <SelectItem value="last-90-days">Last 90 days</SelectItem>
                    <SelectItem value="last-year">Last year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Animation Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Animation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Button
                  variant={isPlaying ? "secondary" : "ocean"}
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex-1"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isPlaying ? 'Pause' : 'Play'}
                </Button>
                <Button variant="ghost" size="icon">
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                Animate float trajectories over time
              </div>
            </CardContent>
          </Card>

          {/* Active Floats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Active Floats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockFloats.map((float) => (
                  <div key={float.id} className="flex items-center justify-between p-3 bg-background rounded-lg border">
                    <div>
                      <div className="font-medium">{float.id}</div>
                      <div className="text-sm text-muted-foreground">
                        {float.lat}°, {float.lon}°
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={float.status === 'active' ? 'default' : 'secondary'}>
                        {float.status}
                      </Badge>
                      <div className="text-sm text-muted-foreground mt-1">
                        {float.temp}°C
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Export */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Export</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" onClick={handleExportCsv}>
                <Download className="w-4 h-4" />
                Download Data
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative">
        <MapContainer
          center={[10, 75]}
          zoom={4}
          style={{ height: "100%", width: "100%" }}
          worldCopyJump
          whenCreated={(map) => { mapRef.current = map; }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {mockFloats.map((f) => (
            <Marker
              key={f.id}
              position={[f.lat, f.lon]}
              icon={f.status === "active" ? activeIcon : inactiveIcon}
            >
              <Popup>
                <div className="space-y-1">
                  <div className="font-semibold">Float {f.id}</div>
                  <div className="text-sm text-muted-foreground">Lat {f.lat}°, Lon {f.lon}°</div>
                  <div className="text-sm">
                    {selectedParameter === "temperature" && `Temperature: ${f.temp}°C`}
                    {selectedParameter === "salinity" && `Salinity: ${f.psu} PSU`}
                    {selectedParameter === "oxygen" && `Oxygen: ${f.oxy} µmol/kg`}
                    {selectedParameter === "chlorophyll" && `Chlorophyll: ${f.chl} mg/m³`}
                  </div>
                  <div className="text-xs text-muted-foreground">Depth range: {depthRange[0]}–{depthRange[1]} m</div>
                  <div className="text-xs text-muted-foreground">Last profile: {f.last}</div>
                  <div className="pt-2">
                    <Button size="sm" variant="ocean" onClick={() => openProfileModal(f.id)}>View profile</Button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Float {selectedFloatId} — {selectedParameter === "temperature" ? "Temperature" : selectedParameter} profile</DialogTitle>
            </DialogHeader>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={generateMockProfile()} margin={{ left: 24, right: 8, top: 8, bottom: 8 }}>
                  <XAxis dataKey="value" type="number" tickFormatter={(v) => `${v}°`} domain={["dataMin", "dataMax"]} />
                  <YAxis dataKey="depth" type="number" reversed tickFormatter={(v) => `${v} m`} domain={[0, 1000]} />
                  <Tooltip formatter={(value, name, props) => [`${value}°C`, `Value`]} labelFormatter={() => "Depth"} />
                  <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </DialogContent>
        </Dialog>

        {/* Map Legend */}
        <div className="absolute top-6 left-6">
          <Card className="w-64">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Legend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-sm">Active Float</span>
              </div>
              <div className="flex items-center gap-2 opacity-60">
                <div className="w-3 h-3 rounded-full bg-muted" />
                <span className="text-sm">Inactive Float</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MapView;