import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

const salesData = [
    { month: "Jan", sales: 4200 },
    { month: "Feb", sales: 5100 },
    { month: "Mar", sales: 4800 },
    { month: "Apr", sales: 6500 },
    { month: "May", sales: 7000 },
    { month: "Jun", sales: 8200 },
    { month: "Jul", sales: 7600 },
    { month: "Aug", sales: 9100 },
    { month: "Sep", sales: 8800 },
    { month: "Oct", sales: 10350 },
    { month: "Nov", sales: 9600 },
    { month: "Dec", sales: 11800 },
];

const chartConfig = {
    sales: {
        label: "Sales",
        color: "hsl(var(--chart-1))",
    },
};

const SalesReportChart = () => {
    return (
        <Card className="shadow-sm">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-3">
                    <CardTitle className="text-sm text-muted-foreground">Sales report</CardTitle>
                    <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-600">
                        +18.2%
                    </span>
                </div>
            </CardHeader>
            <CardContent>
                <div className="mb-3 flex items-end justify-between">
                    <div>
                        <p className="text-3xl font-bold">₹1,18,000</p>
                        <p className="text-xs text-muted-foreground">Revenue this year</p>
                    </div>
                    <p className="text-xs text-muted-foreground">Last 12 months</p>
                </div>

                <ChartContainer config={chartConfig} className="h-[260px] w-full">
                    <BarChart data={salesData} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `₹${value / 1000}k`}
                        />
                        <ChartTooltip
                            cursor={{ fill: "rgba(148, 163, 184, 0.08)" }}
                            content={<ChartTooltipContent formatter={(value) => `₹${Number(value).toLocaleString()}`} />}
                        />
                        <Bar dataKey="sales" radius={[6, 6, 0, 0]} fill="var(--color-sales)" />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
};

export default SalesReportChart;
