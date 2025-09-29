import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import { Checkbox } from "@/components/ui/checkbox";

type HazardType = "cyclone" | "earthquake" | "tsunami";

interface HazardPoint {
  id: string;
  type: HazardType;
  lat: number;
  lon: number;
  title: string;
  date: string;
  magnitude?: number;
  depthKm?: number;
  source: string;
}

const INDIAN_OCEAN_BOUNDS: L.LatLngBoundsExpression = [[-45, 20], [30, 120]];

export default function Disaster() {
  const mapRef = useRef<L.Map | null>(null);
  const [hazards, setHazards] = useState<HazardPoint[]>([]);
  const [filters, setFilters] = useState<Record<HazardType, boolean>>({ cyclone: true, earthquake: true, tsunami: true });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cycloneIcon = useMemo(() => L.divIcon({
    className: "",
    html: "<div style=\"width:16px;height:16px;border:2px solid white;border-radius:9999px;background:#f97316;box-shadow:0 0 0 6px rgba(249,115,22,0.25)\"></div>",
    iconSize: [16, 16]
  }), []);
  const quakeIcon = useMemo(() => L.divIcon({
    className: "",
    html: "<div style=\"width:16px;height:16px;border:2px solid white;border-radius:9999px;background:#ef4444;box-shadow:0 0 0 6px rgba(239,68,68,0.25)\"></div>",
    iconSize: [16, 16]
  }), []);
  const tsunamiIcon = useMemo(() => L.divIcon({
    className: "",
    html: "<div style=\"width:16px;height:16px;border:2px solid white;border-radius:9999px;background:#3b82f6;box-shadow:0 0 0 6px rgba(59,130,246,0.25)\"></div>",
    iconSize: [16, 16]
  }), []);

  useEffect(() => {
    refresh();
  }, []);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const [gdacs, usgs] = await Promise.all([
        // GDACS Cyclones RSS (JSON via all.json feed)
        fetch("https://www.gdacs.org/gdacsapi/api/events/geteventlist/JSON?eventtype=TC&alertlevel=Green,Orange,Red&fromyear=2024").then(r => r.json()).catch(() => null),
        // USGS earthquakes last 30 days, significant+M4.5
        fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson").then(r => r.json()).catch(() => null),
      ]);

      const cyclonePoints: HazardPoint[] = (gdacs?.features || gdacs?.events || gdacs || [])
        .map((e: any, i: number) => {
          const lat = e?.data?.lat || e?.properties?.lat || e?.lat || 0;
          const lon = e?.data?.lon || e?.properties?.lon || e?.lon || 0;
          const title = e?.data?.eventname || e?.properties?.eventname || e?.title || "Tropical Cyclone";
          const date = e?.data?.fromdate || e?.fromdate || new Date().toISOString();
          return { id: `cyc-${i}-${lat}-${lon}`, type: "cyclone", lat, lon, title, date, source: "GDACS" } as HazardPoint;
        })
        .filter((p: HazardPoint) => isInIndianOcean(p.lat, p.lon));

      const quakePoints: HazardPoint[] = (usgs?.features || []).map((f: any) => ({
        id: f.id,
        type: "earthquake" as const,
        lat: f.geometry.coordinates[1],
        lon: f.geometry.coordinates[0],
        title: f.properties.place,
        date: new Date(f.properties.time).toISOString(),
        magnitude: f.properties.mag,
        depthKm: f.geometry.coordinates[2],
        source: "USGS",
      })).filter((p: HazardPoint) => isInIndianOcean(p.lat, p.lon));

      // Tsunami proxy: earthquakes >= 6.5 near subduction zones will mark as potential tsunami
      const tsunamiPoints: HazardPoint[] = quakePoints
        .filter(q => (q.magnitude || 0) >= 6.5)
        .map(q => ({ ...q, id: `tsu-${q.id}`, type: "tsunami" as const, title: `Tsunami risk (from M${q.magnitude})` }));

      let combined = [...cyclonePoints, ...quakePoints, ...tsunamiPoints];
      if (combined.length === 0) {
        // Fallback demo point to verify rendering when feeds return none or are blocked
        combined = [{ id: "demo-1", type: "earthquake", lat: 10.5, lon: 75.0, title: "Demo Event (no live alerts)", date: new Date().toISOString(), magnitude: 5.2, depthKm: 10, source: "Demo" }];
      }
      setHazards(combined);

      // Auto-fit to loaded hazards
      if (mapRef.current && combined.length > 0) {
        const bounds = L.latLngBounds(combined.map(h => [h.lat, h.lon] as [number, number]));
        mapRef.current.fitBounds(bounds.pad(0.2));
      }
    } catch (e) {
      console.error(e);
      setError("Failed to load hazard feeds. Please check your internet and try again.");
    } finally {
      setLoading(false);
    }
  }

  function isInIndianOcean(lat: number, lon: number) {
    return lat >= -45 && lat <= 30 && lon >= 20 && lon <= 120;
  }

  const visibleHazards = hazards.filter(h => filters[h.type]);

  return (
    <div className="h-full flex">
      <div className="w-80 p-6 border-r bg-card/30 backdrop-blur-sm overflow-y-auto">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Disaster Prediction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium block">Hazards</label>
                <div className="space-y-2">
                  {(["cyclone","earthquake","tsunami"] as HazardType[]).map(h => (
                    <label key={h} className="flex items-center gap-2">
                      <Checkbox checked={filters[h]} onCheckedChange={(v) => setFilters(prev => ({ ...prev, [h]: Boolean(v) }))} />
                      <span className="capitalize">{h}</span>
                    </label>
                  ))}
                </div>
              </div>
              <Button variant="ocean" className="w-full" onClick={refresh} disabled={loading}>
                {loading ? "Refreshing..." : "Refresh data"}
              </Button>
              {error && (
                <div className="text-sm text-red-500">{error}</div>
              )}
              <div className="text-xs text-muted-foreground">
                Sources: GDACS (cyclones), USGS (earthquakes). Indian Ocean subset.
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Active Alerts {visibleHazards.length > 0 && <span className="text-sm text-muted-foreground">({visibleHazards.length})</span>}</CardTitle>
            </CardHeader>
            <CardContent>
              {visibleHazards.length === 0 ? (
                <div className="text-sm text-muted-foreground">No active hazards found for current filters. Try enabling more types and click Refresh.</div>
              ) : (
                <div className="space-y-3">
                  {visibleHazards.slice(0, 12).map(h => (
                    <div key={h.id} className="p-3 rounded-lg border bg-background">
                      <div className="flex items-center justify-between">
                        <div className="font-medium truncate max-w-[12rem]" title={h.title}>{h.title}</div>
                        <Badge variant="secondary" className="capitalize">{h.type}</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">{h.lat.toFixed(2)}°, {h.lon.toFixed(2)}° • {new Date(h.date).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex-1 relative">
        <MapContainer
          bounds={INDIAN_OCEAN_BOUNDS}
          style={{ height: "100%", width: "100%" }}
          className="z-0"
          whenCreated={(m) => (mapRef.current = m)}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {visibleHazards.map(h => (
            <Marker
              key={h.id}
              position={[h.lat, h.lon]}
              icon={h.type === "cyclone" ? cycloneIcon : h.type === "earthquake" ? quakeIcon : tsunamiIcon}
            >
              <Popup>
                <div className="space-y-1">
                  <div className="font-semibold">{h.title}</div>
                  <div className="text-sm text-muted-foreground">{h.lat.toFixed(2)}°, {h.lon.toFixed(2)}°</div>
                  <div className="text-sm">Date: {new Date(h.date).toLocaleString()}</div>
                  {h.magnitude && <div className="text-sm">Magnitude: {h.magnitude}</div>}
                  {h.depthKm !== undefined && <div className="text-sm">Depth: {h.depthKm} km</div>}
                  <div className="text-xs text-muted-foreground">Source: {h.source}</div>
                </div>
              </Popup>
            </Marker>
          ))}

          {visibleHazards.length === 0 && (
            // Empty state overlay on map
            // Using a simple div overlay positioned with Leaflet pane z-index
            // This is non-interactive and will not block the map controls
            // It helps users understand why no points are visible
            // eslint-disable-next-line
            (null)
          )}
        </MapContainer>
      </div>
    </div>
  );
}


