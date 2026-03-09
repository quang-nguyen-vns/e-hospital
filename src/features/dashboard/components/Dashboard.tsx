import React, { useState, useEffect } from "react";
import {
    FileText,
    AlertCircle,
    CheckCircle2,
    Clock,
    Download,
    ChevronRight,
    Star,
    AlertTriangle,
    TrendingUp,
    PlusCircle,
} from "lucide-react";
import { motion } from "motion/react";
import ReactECharts from 'echarts-for-react';
import { Announcement } from "@/types";
import { storageService } from "@/services/storageService";
import { Button, Card, Badge } from "@/components/ui";

export const Dashboard = ({ onSearchClick }: { onSearchClick: () => void }) => {
    const [stats, setStats] = useState<any>(null);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);

    useEffect(() => {
        storageService.getDashboardData().then((data) => {
            setStats(data.stats);
            setAnnouncements(data.announcements);
        });
    }, []);

    if (!stats) return <div className="p-8">Loading...</div>;

    // --- Mock chart data ---
    const claimTypeChart = {
        tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
        legend: { bottom: '0%', left: 'center', itemGap: 12, textStyle: { fontSize: 11 } },
        color: ['#3b82f6', '#8b5cf6', '#f97316', '#10b981'],
        series: [{
            name: 'Claim Types',
            type: 'pie',
            radius: ['45%', '72%'],
            center: ['50%', '44%'],
            avoidLabelOverlap: false,
            label: { show: false },
            emphasis: { label: { show: true, fontSize: 14, fontWeight: 'bold' } },
            data: [
                { value: 142, name: 'OPD' },
                { value: 95, name: 'IPD' },
                { value: 61, name: 'ER' },
                { value: 41, name: 'Dental' },
            ],
        }],
    };

    const monthlyTrendChart = {
        tooltip: { trigger: 'axis' },
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: { type: 'category', boundaryGap: false, data: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'], axisLine: { lineStyle: { color: '#e2e8f0' } }, axisLabel: { color: '#94a3b8', fontSize: 11 } },
        yAxis: { type: 'value', axisLabel: { color: '#94a3b8', fontSize: 11 }, splitLine: { lineStyle: { color: '#f1f5f9' } } },
        color: ['#ef4444', '#3b82f6'],
        series: [
            { name: 'Submitted', type: 'line', smooth: true, areaStyle: { opacity: 0.08 }, data: [48, 62, 55, 71, 83, 62], lineStyle: { width: 2 }, symbol: 'circle', symbolSize: 6 },
            { name: 'Approved', type: 'line', smooth: true, areaStyle: { opacity: 0.08 }, data: [40, 55, 48, 64, 75, 58], lineStyle: { width: 2 }, symbol: 'circle', symbolSize: 6 },
        ],
        legend: { data: ['Submitted', 'Approved'], bottom: 0, textStyle: { fontSize: 11 } },
    };

    const vipCasesChart = {
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: { type: 'category', data: ['OPD', 'IPD', 'ER', 'Dental'], axisLabel: { color: '#94a3b8', fontSize: 11 }, axisLine: { lineStyle: { color: '#e2e8f0' } } },
        yAxis: { type: 'value', axisLabel: { color: '#94a3b8', fontSize: 11 }, splitLine: { lineStyle: { color: '#f1f5f9' } } },
        color: ['#f59e0b'],
        series: [{ name: 'VIP Cases', type: 'bar', barWidth: '50%', data: [18, 34, 12, 5], itemStyle: { borderRadius: [6, 6, 0, 0] } }],
        legend: { data: ['VIP Cases'], bottom: 0, textStyle: { fontSize: 11 } },
    };

    const overSlaChart = {
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        grid: { left: '3%', right: '8%', bottom: '3%', containLabel: true },
        xAxis: { type: 'value', axisLabel: { color: '#94a3b8', fontSize: 11 }, splitLine: { lineStyle: { color: '#f1f5f9' } } },
        yAxis: { type: 'category', data: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'], axisLabel: { color: '#94a3b8', fontSize: 11 }, axisLine: { lineStyle: { color: '#e2e8f0' } } },
        color: ['#ef4444'],
        series: [{ name: 'Over-SLA', type: 'bar', barWidth: '50%', data: [7, 12, 5, 9, 4], itemStyle: { borderRadius: [0, 6, 6, 0] }, label: { show: true, position: 'right', color: '#64748b', fontSize: 11 } }],
        legend: { data: ['Over-SLA'], bottom: 0, textStyle: { fontSize: 11 } },
    };

    const MotionCard = motion(Card);

    return (
        <div className="p-8 space-y-4">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Welcome back!</h1>
                    <p className="text-slate-500 mt-1">
                        Here's what's happening with your claims today.
                    </p>
                </div>
                <Button onClick={onSearchClick} variant="primary">
                    <PlusCircle className="w-5 h-5" />
                    New Claim Inquiry
                </Button>
            </header>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Total Claims", value: stats.total.count + 339, icon: FileText, trend: "+12% from last month", bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-500" },
                    { label: "Pending Review", value: stats.pending.count + 37, icon: Clock, trend: "Avg. 2.4h response", bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-500" },
                    { label: "Approved", value: stats.approved.count + 276, icon: CheckCircle2, trend: "94% success rate", bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-500" },
                    { label: "Rejected", value: stats.rejected.count + 26, icon: AlertCircle, trend: "-2% from last month", bg: "bg-red-50", text: "text-red-600", border: "border-red-500" },
                ].map((stat, i) => (
                    <MotionCard key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                        className={`relative group hover:shadow-xl transition-all duration-300 border-b-4 ${stat.border}`}>
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.text} group-hover:scale-110 transition-transform`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.trend}</span>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium mb-1">{stat.label}</p>
                            <p className="text-3xl font-bold text-slate-900 tracking-tight">{stat.value}</p>
                        </div>
                        <div className={`absolute -right-4 -bottom-4 w-24 h-24 ${stat.bg}/50 rounded-full blur-2xl group-hover:scale-150 transition-transform`}></div>
                    </MotionCard>
                ))}
            </div>

            {/* VIP & Over-SLA highlight cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="flex items-center gap-5 border-l-4 border-amber-400">
                    <div className="p-4 bg-amber-50 rounded-2xl"><Star className="w-7 h-7 text-amber-500" /></div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">VIP Cases (This Month)</p>
                        <p className="text-3xl font-bold text-amber-600">69</p>
                        <p className="text-xs text-slate-400 mt-0.5">+8 from last month</p>
                    </div>
                </Card>
                <Card className="flex items-center gap-5 border-l-4 border-red-400">
                    <div className="p-4 bg-red-50 rounded-2xl"><AlertTriangle className="w-7 h-7 text-red-500" /></div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Over-SLA Claims</p>
                        <p className="text-3xl font-bold text-red-600">37</p>
                        <p className="text-xs text-slate-400 mt-0.5">Target: &lt;10% of total</p>
                    </div>
                </Card>
                <Card className="flex items-center gap-5 border-l-4 border-teal-400">
                    <div className="p-4 bg-teal-50 rounded-2xl"><TrendingUp className="w-7 h-7 text-teal-500" /></div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Avg. Processing Time</p>
                        <p className="text-3xl font-bold text-teal-600">2.4h</p>
                        <p className="text-xs text-slate-400 mt-0.5">SLA target: 4h</p>
                    </div>
                </Card>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                    <h2 className="font-bold text-lg mb-1">Claim Types Distribution</h2>
                    <p className="text-xs text-slate-400 mb-4">Breakdown by claim category — last 30 days</p>
                    <ReactECharts option={claimTypeChart} style={{ height: 260 }} />
                </Card>
                <Card>
                    <h2 className="font-bold text-lg mb-1">Monthly Claims Trend</h2>
                    <p className="text-xs text-slate-400 mb-4">Submitted vs. Approved — last 6 months</p>
                    <ReactECharts option={monthlyTrendChart} style={{ height: 260 }} />
                </Card>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                    <h2 className="font-bold text-lg mb-1">VIP Cases by Type</h2>
                    <p className="text-xs text-slate-400 mb-4">VIP patient claims by claim category</p>
                    <ReactECharts option={vipCasesChart} style={{ height: 220 }} />
                </Card>
                <Card>
                    <h2 className="font-bold text-lg mb-1">Over-SLA Claims by Week</h2>
                    <p className="text-xs text-slate-400 mb-4">Claims exceeding 48h resolution — current month</p>
                    <ReactECharts option={overSlaChart} style={{ height: 220 }} />
                </Card>
            </div>

            {/* Announcements & Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Card noPadding>
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="font-bold text-lg">Recent Announcements</h2>
                            <button className="text-sm text-generali-red font-medium hover:underline">View All</button>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {announcements.map((ann, i) => (
                                <div key={i} className="p-6 hover:bg-slate-50 transition-colors cursor-pointer group">
                                    <div className="flex justify-between items-start mb-2">
                                        <Badge color={ann.type === "Maintenance" ? "amber" : "blue"}>{ann.type}</Badge>
                                        <span className="text-xs text-slate-400">{new Date(ann.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <h3 className="font-bold text-slate-800 group-hover:text-generali-red transition-colors">{ann.title}</h3>
                                    <p className="text-sm text-slate-600 mt-1 line-clamp-2">{ann.content}</p>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="bg-generali-red text-white" noPadding={false}>
                        <h2 className="font-bold text-lg mb-2">Need Help?</h2>
                        <p className="text-sm mb-6 text-red-100">Access our training videos and user manuals to get the most out of the system.</p>
                        <div className="space-y-3">
                            <button className="w-full bg-white/20 hover:bg-white/30 py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-between transition-all">User Guide (PDF)<Download className="w-4 h-4" /></button>
                            <button className="w-full bg-white/20 hover:bg-white/30 py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-between transition-all">Training Videos<ChevronRight className="w-4 h-4" /></button>
                        </div>
                    </Card>
                    <Card>
                        <h2 className="font-bold text-lg mb-4">System Status</h2>
                        <div className="space-y-4">
                            {[['Claim Backend', true], ['Policy DB', true], ['MFA Service', true]].map(([name, ok]) => (
                                <div key={String(name)} className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600">{String(name)}</span>
                                    <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>ONLINE
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
