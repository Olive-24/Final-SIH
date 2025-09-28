import { TrendingUp, Thermometer, Droplets, Activity, Globe } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from "recharts";
import { Input } from "@/components/ui/input";

const Dashboard = () => {
  const stats = [
    {
      title: "Active Floats",
      value: "3,847",
      change: "+12",
      icon: Activity,
      color: "text-primary"
    },
    {
      title: "Global Coverage",
      value: "96.2%",
      change: "+2.1%",
      icon: Globe,
      color: "text-secondary"
    },
    {
      title: "Avg Temperature",
      value: "4.2°C",
      change: "+0.3°C",
      icon: Thermometer,
      color: "text-orange-500"
    },
    {
      title: "Data Quality",
      value: "98.7%",
      change: "+0.4%",
      icon: Droplets,
      color: "text-blue-500"
    }
  ];

  const recentProfiles = [
    { id: "4902916", location: "North Atlantic", depth: "2000m", time: "2 hours ago", quality: "Excellent" },
    { id: "4902917", location: "Pacific Ocean", depth: "1500m", time: "4 hours ago", quality: "Good" },
    { id: "4902918", location: "Indian Ocean", depth: "1800m", time: "6 hours ago", quality: "Excellent" },
    { id: "4902919", location: "Southern Ocean", depth: "2200m", time: "8 hours ago", quality: "Fair" },
  ];

  // Mock data for charts
  const tempTrends = Array.from({ length: 12 }).map((_, i) => {
    const month = i + 1;
    return {
      month: new Date(2025, i, 1).toLocaleString('default', { month: 'short' }),
      sst: 27 + Math.sin(i / 12 * Math.PI * 2) * 1.2 + Math.random() * 0.2,
      t200: 15 + Math.sin(i / 12 * Math.PI * 2 + 0.5) * 0.6 + Math.random() * 0.2,
      t1000: 3.5 + Math.sin(i / 12 * Math.PI * 2 + 1.0) * 0.2 + Math.random() * 0.1,
    };
  });

  // Alert configuration (mean + thresholds in °C)
  const [meanTemp, setMeanTemp] = useState<number>(28.0 as unknown as number);
  const [yellowThresh, setYellowThresh] = useState<number>(0.5 as unknown as number);
  const [orangeThresh, setOrangeThresh] = useState<number>(1.0 as unknown as number);
  const [redThresh, setRedThresh] = useState<number>(1.5 as unknown as number);

  const latestSst = tempTrends[tempTrends.length - 1]?.sst ?? 0;
  const sstDelta = latestSst - meanTemp;
  const sstDeltaAbs = Math.abs(sstDelta);
  const alertLevel = sstDeltaAbs >= redThresh ? 'red' : sstDeltaAbs >= orangeThresh ? 'orange' : sstDeltaAbs >= yellowThresh ? 'yellow' : 'green';
  const alertText = alertLevel === 'red' ? 'RED alert: SST far from mean' : alertLevel === 'orange' ? 'ORANGE alert: SST moderately far from mean' : alertLevel === 'yellow' ? 'YELLOW alert: SST slightly away from mean' : 'Normal: SST near mean';
  const alertColor = alertLevel === 'red' ? 'text-red-600' : alertLevel === 'orange' ? 'text-orange-500' : alertLevel === 'yellow' ? 'text-yellow-500' : 'text-green-600';

  const salinityByDepth = [
    { depth: 0, psu: 35.4 },
    { depth: 50, psu: 35.2 },
    { depth: 100, psu: 35.0 },
    { depth: 200, psu: 34.9 },
    { depth: 500, psu: 34.7 },
    { depth: 1000, psu: 34.6 },
  ];

  const floatStatus = [
    { name: 'Active', value: 3220, color: 'hsl(var(--primary))' },
    { name: 'Inactive', value: 410, color: 'hsl(var(--muted-foreground))' },
    { name: 'Service', value: 217, color: 'hsl(var(--secondary))' },
  ];

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-background to-accent/10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Overview of global oceanographic data</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Export Report</Button>
          <Button variant="ocean">Generate Insights</Button>
        </div>
      </div>

      {/* Alerts and Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Temperature Alert</span>
            <span className={`text-sm font-semibold ${alertColor}`}>{alertText}</span>
          </CardTitle>
          <CardDescription>
            Latest SST: {latestSst.toFixed(2)}°C · Delta vs mean: {sstDelta >= 0 ? '+' : ''}{sstDelta.toFixed(2)}°C
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Mean SST (°C)</label>
              <Input type="number" step="0.1" value={meanTemp} onChange={(e) => setMeanTemp(parseFloat(e.target.value))} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Yellow threshold (±°C)</label>
              <Input type="number" step="0.1" value={yellowThresh} onChange={(e) => setYellowThresh(parseFloat(e.target.value))} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Orange threshold (±°C)</label>
              <Input type="number" step="0.1" value={orangeThresh} onChange={(e) => setOrangeThresh(parseFloat(e.target.value))} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Red threshold (±°C)</label>
              <Input type="number" step="0.1" value={redThresh} onChange={(e) => setRedThresh(parseFloat(e.target.value))} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-ocean transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.change}</span> from last week
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Temperature Trends */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Global Temperature Trends
            </CardTitle>
            <CardDescription>
              Average ocean temperature at different depths over the past year
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={tempTrends} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                  <XAxis dataKey="month" />
                  <YAxis unit="°C" />
                  <Tooltip formatter={(v) => `${(v as number).toFixed(2)}°C`} />
                  <Legend />
                  <Line type="monotone" dataKey="sst" name="SST (0 m)" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="t200" name="200 m" stroke="hsl(var(--secondary))" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="t1000" name="1000 m" stroke="#8884d8" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Profiles</CardTitle>
            <CardDescription>Latest data from ARGO floats</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProfiles.map((profile, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-background rounded-lg border">
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{profile.id}</p>
                    <p className="text-xs text-muted-foreground">{profile.location}</p>
                    <p className="text-xs text-muted-foreground">{profile.time}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm font-medium">{profile.depth}</p>
                    <Badge variant={
                      profile.quality === 'Excellent' ? 'default' : 
                      profile.quality === 'Good' ? 'secondary' : 'destructive'
                    } className="text-xs">
                      {profile.quality}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Salinity Distribution</CardTitle>
            <CardDescription>Global salinity levels by depth</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salinityByDepth} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                  <defs>
                    <linearGradient id="salinityGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                  <XAxis dataKey="psu" tickFormatter={(v) => `${v} PSU`} />
                  <YAxis dataKey="depth" reversed tickFormatter={(v) => `${v} m`} />
                  <Tooltip formatter={(v, n) => n === 'psu' ? [`${v} PSU`, 'Salinity'] : [`${v} m`, 'Depth']} />
                  <Area type="monotone" dataKey="psu" stroke="hsl(var(--secondary))" fillOpacity={1} fill="url(#salinityGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Float Status Overview</CardTitle>
            <CardDescription>Global fleet health monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={floatStatus} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                    {floatStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;