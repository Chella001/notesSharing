document.addEventListener('DOMContentLoaded', () => {
    // Determine Theme colors for charts
    const isDark = document.body.classList.contains('dark');
    const textColor = isDark ? '#a1a1aa' : '#64748b';
    const gridColor = isDark ? '#27272a' : '#e2e8f0';
    const tooltipBg = isDark ? '#18181b' : '#ffffff';
    
    // 1. Patient Demographics (Donut Chart)
    const demographicOptions = {
        series: [44, 55, 41, 17, 15],
        chart: {
            type: 'donut',
            height: 280,
            fontFamily: 'Inter, sans-serif',
            background: 'transparent',
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 800,
                dynamicAnimation: { enabled: true, speed: 350 }
            }
        },
        labels: ['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'General'],
        colors: ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6'],
        plotOptions: {
            pie: {
                donut: { size: '70%', labels: { show: true, name: { color: textColor }, value: { color: isDark ? '#fafafa' : '#0f172a' } } }
            }
        },
        dataLabels: { enabled: false },
        stroke: { show: true, colors: 'transparent', width: 2 },
        theme: { mode: isDark ? 'dark' : 'light' },
        tooltip: { theme: isDark ? 'dark' : 'light', fillSeriesColor: false },
        legend: { position: 'bottom', labels: { colors: textColor } }
    };
    
    const demoChartContainer = document.querySelector("#demographicsChart");
    if (demoChartContainer) {
        const demoChart = new ApexCharts(demoChartContainer, demographicOptions);
        demoChart.render();
    }

    // 2. Revenue & Appointments Trend (Area Chart)
    const trendOptions = {
        series: [{
            name: 'Revenue (₹)',
            data: [31000, 40000, 28000, 51000, 42000, 109000, 100000]
        }, {
            name: 'Appointments',
            data: [110, 132, 95, 142, 120, 152, 145]
        }],
        chart: {
            height: 280,
            type: 'area',
            fontFamily: 'Inter, sans-serif',
            background: 'transparent',
            toolbar: { show: false }
        },
        colors: ['#10b981', '#6366f1'],
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: 2 },
        xaxis: {
            categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            labels: { style: { colors: textColor } },
            axisBorder: { show: false },
            axisTicks: { show: false }
        },
        yaxis: [
            { labels: { style: { colors: textColor }, formatter: (value) => { return value / 1000 + "k" } } },
            { opposite: true, labels: { style: { colors: textColor } } }
        ],
        grid: { borderColor: gridColor, strokeDashArray: 4 },
        theme: { mode: isDark ? 'dark' : 'light' },
        legend: { position: 'top', horizontalAlign: 'right', labels: { colors: textColor } }
    };

    const trendChartContainer = document.querySelector("#trendChart");
    if (trendChartContainer) {
        const trendChart = new ApexCharts(trendChartContainer, trendOptions);
        trendChart.render();
    }
});
