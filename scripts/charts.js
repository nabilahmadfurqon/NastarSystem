/* =============================================
   TOKO NASTAR NOTED - CHART FUNCTIONS
   Advanced Data Visualization
   ============================================= */

class ChartManager {
    constructor() {
        this.charts = new Map();
        this.defaultColors = {
            primary: '#f57c00',
            secondary: '#5d4037',
            success: '#4caf50',
            danger: '#f44336',
            warning: '#ff9800',
            info: '#2196f3'
        };
    }

    // Initialize all charts
    initializeAllCharts() {
        this.initializeDashboardCharts();
        this.initializeReportCharts();
        this.initializeCustomerChart();
        this.initializeInventoryChart();
    }

    // Dashboard Charts
    initializeDashboardCharts() {
        this.createSalesChart();
        this.createSizeChart();
        this.createMiniSalesChart();
    }

    // Create Sales Chart
    createSalesChart() {
        const ctx = document.getElementById('salesChart');
        if (!ctx) return;

        const data = this.getSalesData(30);
        
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Penjualan (Rp)',
                    data: data.values,
                    borderColor: this.defaultColors.primary,
                    backgroundColor: this.hexToRgba(this.defaultColors.primary, 0.1),
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: this.defaultColors.primary,
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        titleFont: { size: 12 },
                        bodyFont: { size: 12 },
                        padding: 10,
                        callbacks: {
                            label: function(context) {
                                return `Rp ${context.parsed.y.toLocaleString('id-ID')}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: 11
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            borderDash: [3, 3]
                        },
                        ticks: {
                            font: {
                                size: 11
                            },
                            callback: function(value) {
                                if (value >= 1000000) {
                                    return 'Rp ' + (value/1000000).toFixed(1) + 'jt';
                                } else if (value >= 1000) {
                                    return 'Rp ' + (value/1000).toFixed(0) + 'k';
                                }
                                return 'Rp ' + value;
                            }
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'nearest'
                },
                animations: {
                    tension: {
                        duration: 1000,
                        easing: 'linear'
                    }
                }
            }
        });

        this.charts.set('salesChart', chart);
    }

    // Create Size Distribution Chart
    createSizeChart() {
        const ctx = document.getElementById('sizeChart');
        if (!ctx) return;

        const data = this.getSizeDistribution();
        
        const chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Kecil (250g)', 'Sedang (500g)', 'Besar (1000g)'],
                datasets: [{
                    data: [data.kecil, data.sedang, data.besar],
                    backgroundColor: [
                        this.hexToRgba(this.defaultColors.primary, 0.8),
                        this.defaultColors.primary,
                        this.hexToRgba(this.defaultColors.primary, 0.6)
                    ],
                    borderColor: '#ffffff',
                    borderWidth: 2,
                    hoverOffset: 15
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            padding: 20,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((context.parsed / total) * 100);
                                return `${context.label}: ${context.parsed} toples (${percentage}%)`;
                            }
                        }
                    }
                },
                cutout: '70%',
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            }
        });

        this.charts.set('sizeChart', chart);
    }

    // Create Mini Sales Chart
    createMiniSalesChart() {
        const ctx = document.getElementById('miniSalesChart');
        if (!ctx) return;

        const data = this.getSalesData(7);
        
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.values,
                    borderColor: '#ffffff',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: { display: false },
                    y: { display: false }
                },
                elements: {
                    point: {
                        radius: 0
                    }
                }
            }
        });

        this.charts.set('miniSalesChart', chart);
    }

    // Report Charts
    initializeReportCharts() {
        // Will be called when report page is loaded
    }

    // Create Report Sales Chart
    createReportSalesChart(data, type = 'sales') {
        const ctx = document.getElementById('reportSalesChart');
        if (!ctx) return;

        // Destroy existing chart
        if (this.charts.has('reportSalesChart')) {
            this.charts.get('reportSalesChart').destroy();
        }

        let datasets = [];
        
        if (type === 'sales') {
            datasets = [{
                label: 'Penjualan',
                data: data.values,
                borderColor: this.defaultColors.primary,
                backgroundColor: this.hexToRgba(this.defaultColors.primary, 0.1),
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }];
        } else if (type === 'profit') {
            datasets = [{
                label: 'Keuntungan',
                data: data.profitValues,
                borderColor: this.defaultColors.success,
                backgroundColor: this.hexToRgba(this.defaultColors.success, 0.1),
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }];
        }

        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                if (value >= 1000000) {
                                    return 'Rp ' + (value/1000000).toFixed(1) + 'jt';
                                } else if (value >= 1000) {
                                    return 'Rp ' + (value/1000).toFixed(0) + 'k';
                                }
                                return 'Rp ' + value;
                            }
                        }
                    }
                }
            }
        });

        this.charts.set('reportSalesChart', chart);
    }

    // Create Report Size Chart
    createReportSizeChart(data) {
        const ctx = document.getElementById('reportSizeChart');
        if (!ctx) return;

        // Destroy existing chart
        if (this.charts.has('reportSizeChart')) {
            this.charts.get('reportSizeChart').destroy();
        }

        const chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Kecil', 'Sedang', 'Besar'],
                datasets: [{
                    label: 'Penjualan (Rp)',
                    data: [data.kecil, data.sedang, data.besar],
                    backgroundColor: [
                        this.hexToRgba(this.defaultColors.primary, 0.8),
                        this.defaultColors.primary,
                        this.hexToRgba(this.defaultColors.primary, 0.6)
                    ],
                    borderColor: '#ffffff',
                    borderWidth: 1,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                if (value >= 1000000) {
                                    return 'Rp ' + (value/1000000).toFixed(1) + 'jt';
                                } else if (value >= 1000) {
                                    return 'Rp ' + (value/1000).toFixed(0) + 'k';
                                }
                                return 'Rp ' + value;
                            }
                        }
                    }
                }
            }
        });

        this.charts.set('reportSizeChart', chart);
    }

    // Customer Chart
    initializeCustomerChart() {
        const ctx = document.getElementById('customerChart');
        if (!ctx) return;

        const data = this.getCustomerData();
        
        const chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Total Belanja',
                    data: data.values,
                    backgroundColor: this.hexToRgba(this.defaultColors.info, 0.8),
                    borderColor: this.defaultColors.info,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                if (value >= 1000000) {
                                    return 'Rp ' + (value/1000000).toFixed(1) + 'jt';
                                } else if (value >= 1000) {
                                    return 'Rp ' + (value/1000).toFixed(0) + 'k';
                                }
                                return 'Rp ' + value;
                            }
                        }
                    }
                }
            }
        });

        this.charts.set('customerChart', chart);
    }

    // Inventory Chart
    initializeInventoryChart() {
        const ctx = document.getElementById('inventoryChart');
        if (!ctx) return;

        const data = this.getInventoryData();
        
        const chart = new Chart(ctx, {
            type: 'polarArea',
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.values,
                    backgroundColor: [
                        this.hexToRgba(this.defaultColors.primary, 0.8),
                        this.hexToRgba(this.defaultColors.success, 0.8),
                        this.hexToRgba(this.defaultColors.warning, 0.8),
                        this.hexToRgba(this.defaultColors.info, 0.8),
                        this.hexToRgba(this.defaultColors.danger, 0.8)
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    }
                },
                scales: {
                    r: {
                        ticks: {
                            display: false
                        }
                    }
                }
            }
        });

        this.charts.set('inventoryChart', chart);
    }

    // Data Generation Methods
    getSalesData(days = 30) {
        const labels = [];
        const values = [];
        const today = new Date();
        
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateString = date.toISOString().split('T')[0];
            
            // Format label
            const dayLabel = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
            labels.push(dayLabel);
            
            // Calculate sales for this day
            const daySales = orders
                .filter(order => order.date === dateString)
                .reduce((sum, order) => sum + order.total, 0);
            
            values.push(daySales);
        }
        
        return { labels, values };
    }

    getSizeDistribution() {
        const distribution = { kecil: 0, sedang: 0, besar: 0 };
        
        orders.forEach(order => {
            if (distribution[order.size] !== undefined) {
                distribution[order.size] += order.total;
            }
        });
        
        return distribution;
    }

    getCustomerData() {
        const topCustomers = [...customers]
            .sort((a, b) => b.totalSpent - a.totalSpent)
            .slice(0, 5);
        
        return {
            labels: topCustomers.map(c => c.name.split(' ')[0]),
            values: topCustomers.map(c => c.totalSpent)
        };
    }

    getInventoryData() {
        const topMaterials = [...materials]
            .slice(0, 5);
        
        return {
            labels: topMaterials.map(m => m.name),
            values: topMaterials.map(m => m.stock)
        };
    }

    // Update Charts with New Data
    updateCharts() {
        if (currentPage === 'dashboard') {
            this.updateDashboardCharts();
        } else if (currentPage === 'reports') {
            this.updateReportCharts();
        }
    }

    updateDashboardCharts() {
        const salesData = this.getSalesData(30);
        const sizeData = this.getSizeDistribution();
        const miniData = this.getSalesData(7);

        if (this.charts.has('salesChart')) {
            const chart = this.charts.get('salesChart');
            chart.data.labels = salesData.labels;
            chart.data.datasets[0].data = salesData.values;
            chart.update();
        }

        if (this.charts.has('sizeChart')) {
            const chart = this.charts.get('sizeChart');
            chart.data.datasets[0].data = [sizeData.kecil, sizeData.sedang, sizeData.besar];
            chart.update();
        }

        if (this.charts.has('miniSalesChart')) {
            const chart = this.charts.get('miniSalesChart');
            chart.data.labels = miniData.labels;
            chart.data.datasets[0].data = miniData.values;
            chart.update();
        }
    }

    updateReportCharts() {
        // Get report data based on current filters
        const period = document.getElementById('reportPeriod').value;
        const reportType = document.getElementById('reportType').value;
        const reportData = calculateReportData(period);
        
        // Update sales chart
        const salesData = this.getReportSalesData(reportData.orders);
        this.createReportSalesChart(salesData, reportType);
        
        // Update size chart
        const sizeData = this.getReportSizeData(reportData.orders);
        this.createReportSizeChart(sizeData);
    }

    getReportSalesData(filteredOrders) {
        // Group orders by date
        const grouped = {};
        
        filteredOrders.forEach(order => {
            if (!grouped[order.date]) {
                grouped[order.date] = 0;
            }
            grouped[order.date] += order.total;
        });
        
        // Sort by date
        const sortedDates = Object.keys(grouped).sort();
        
        return {
            labels: sortedDates.map(date => {
                const d = new Date(date);
                return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
            }),
            values: sortedDates.map(date => grouped[date]),
            profitValues: sortedDates.map(date => grouped[date] * 0.4) // 40% margin
        };
    }

    getReportSizeData(filteredOrders) {
        const distribution = { kecil: 0, sedang: 0, besar: 0 };
        
        filteredOrders.forEach(order => {
            if (distribution[order.size] !== undefined) {
                distribution[order.size] += order.total;
            }
        });
        
        return distribution;
    }

    // Utility Methods
    hexToRgba(hex, alpha = 1) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    generateColorGradient(baseColor, steps) {
        const colors = [];
        for (let i = 0; i < steps; i++) {
            const alpha = 0.2 + (i * (0.8 / steps));
            colors.push(this.hexToRgba(baseColor, alpha));
        }
        return colors;
    }

    // Destroy all charts
    destroyAllCharts() {
        this.charts.forEach(chart => {
            chart.destroy();
        });
        this.charts.clear();
    }

    // Export chart as image
    exportChart(chartId, filename = 'chart.png') {
        const chart = this.charts.get(chartId);
        if (!chart) {
            console.error('Chart not found:', chartId);
            return;
        }

        const link = document.createElement('a');
        link.download = filename;
        link.href = chart.toBase64Image();
        link.click();
    }

    // Print chart
    printChart(chartId) {
        const chart = this.charts.get(chartId);
        if (!chart) return;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Print Chart</title>
                    <style>
                        body { margin: 0; padding: 20px; }
                        img { max-width: 100%; height: auto; }
                    </style>
                </head>
                <body>
                    <img src="${chart.toBase64Image()}">
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    }
}

// Create global instance
const chartManager = new ChartManager();

// Initialize charts when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for data to load
    setTimeout(() => {
        chartManager.initializeAllCharts();
    }, 1000);
});

// Export functions
window.updateCharts = function() {
    chartManager.updateCharts();
};

window.exportChart = function(chartId, filename) {
    chartManager.exportChart(chartId, filename);
};

window.printChart = function(chartId) {
    chartManager.printChart(chartId);
};