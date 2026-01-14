/* =============================================
   TOKO NASTAR NOTED - MAIN JAVASCRIPT
   Premium Management System
   ============================================= */

// Error handler global
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    console.error('At file:', e.filename, 'line:', e.lineno, 'col:', e.colno);
    
    // Tampilkan toast error
    if (typeof showToast === 'function') {
        showToast(`Terjadi kesalahan: ${e.error?.message || 'Unknown error'}`, 'error');
    }
});

// Promise rejection handler
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
});

// Global Variables
let currentPage = 'dashboard';
let orders = [];
let materials = [];
let customers = [];
let currentUser = 'Admin Nastar';
let systemConfig = {};
let activeFilters = {
    orderStatus: 'all',
    paymentStatus: 'all',
    date: null
};

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    try {
        initializeSystem();
        setupEventListeners();
        loadInitialData();
        
        // Show loading screen for 2 seconds
        setTimeout(() => {
            hideLoadingScreen();
        }, 2000);
    } catch (error) {
        console.error('Error during DOMContentLoaded:', error);
    }
});

// Initialize System
function initializeSystem() {
    try {
        // Load configuration from localStorage
        const config = localStorage.getItem('nastarConfig');
        systemConfig = config ? JSON.parse(config) : {
            apiUrl: '',
            productName: 'Nastar Keju',
            prices: {
                kecil: 43000,
                sedang: 85000,
                besar: 165000
            },
            theme: 'default',
            animations: true
        };
        
        // Apply saved theme
        applyTheme(systemConfig.theme);
        
        // Update current user info
        const userNameElement = document.querySelector('.user-name');
        if (userNameElement) {
            userNameElement.textContent = currentUser;
        }
        
        // Set current date
        updateCurrentDate();
        
        // Initialize tooltips
        initializeTooltips();
        
    } catch (error) {
        console.error('Error initializing system:', error);
        // Fallback ke default config jika error
        systemConfig = {
            apiUrl: '',
            productName: 'Nastar Keju',
            prices: {
                kecil: 43000,
                sedang: 85000,
                besar: 165000
            },
            theme: 'default',
            animations: true
        };
    }
}

// Setup Event Listeners
function setupEventListeners() {
    try {
        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebarToggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', toggleSidebar);
        }
        
        // Sidebar menu clicks
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const page = this.getAttribute('data-page');
                if (page) showPage(page);
            });
        });
        
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }
        
        // Notification button
        const notificationBtn = document.getElementById('notificationBtn');
        if (notificationBtn) {
            notificationBtn.addEventListener('click', showNotifications);
        }
        
        // Search functionality
        const searchInput = document.querySelector('.search-box input');
        if (searchInput) {
            searchInput.addEventListener('input', function(e) {
                searchData(e.target.value);
            });
        }
        
        // Window resize
        window.addEventListener('resize', handleResize);
        
        // Settings navigation
        document.querySelectorAll('.settings-nav-item').forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const settingsSection = this.getAttribute('data-settings');
                if (settingsSection) showSettingsSection(settingsSection);
            });
        });
        
        // Theme selection
        document.querySelectorAll('.theme-option').forEach(option => {
            option.addEventListener('click', function() {
                const theme = this.getAttribute('data-theme');
                if (theme) selectTheme(theme);
            });
        });
        
        // Modal close buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', function() {
                const modal = this.closest('.modal');
                if (modal) {
                    closeModal(modal.id);
                }
            });
        });
        
        // Modal overlay click
        const modalOverlay = document.getElementById('modalOverlay');
        if (modalOverlay) {
            modalOverlay.addEventListener('click', function() {
                closeAllModals();
            });
        }
        
        // Order filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                applyFilters();
            });
        });
        
        // Payment filter buttons
        document.querySelectorAll('.payment-filter-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.payment-filter-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                applyFilters();
            });
        });
        
        // Date filter
        const dateFilter = document.getElementById('dateFilter');
        if (dateFilter) {
            dateFilter.addEventListener('change', applyFilters);
        }
        
        // Customer search
        const customerSearch = document.getElementById('customerSearch');
        if (customerSearch) {
            customerSearch.addEventListener('input', function() {
                updateCustomersTable();
            });
        }
        
        // Report period change
        const reportPeriod = document.getElementById('reportPeriod');
        if (reportPeriod) {
            reportPeriod.addEventListener('change', generateReport);
        }
        
        // Report type change
        const reportType = document.getElementById('reportType');
        if (reportType) {
            reportType.addEventListener('change', generateReport);
        }
        
        // Production calculation
        const calcSize = document.getElementById('calcSize');
        if (calcSize) {
            calcSize.addEventListener('change', calculateProductionCost);
        }
        
        const sellingPrice = document.getElementById('sellingPrice');
        if (sellingPrice) {
            sellingPrice.addEventListener('input', calculateProfit);
        }
        
    } catch (error) {
        console.error('Error setting up event listeners:', error);
    }
}

// Load Initial Data
function loadInitialData() {
    try {
        // Try to load from Google Sheets API
        if (systemConfig.apiUrl) {
            loadDataFromAPI();
        } else {
            // Load sample data
            loadSampleData();
            showToast('Gunakan Mode Demo. Konfigurasi API untuk koneksi data real-time.', 'warning');
        }
        
        // Update dashboard
        updateDashboard();
        
    } catch (error) {
        console.error('Error loading initial data:', error);
        loadSampleData();
        showToast('Gagal memuat data awal. Menggunakan data sample.', 'error');
    }
}

// Load Sample Data
function loadSampleData() {
    try {
        // Sample orders
        orders = [
            {
                id: 'NASTAR-2023-001',
                date: new Date().toISOString().split('T')[0],
                customer: 'Budi Santoso',
                phone: '081234567890',
                size: 'besar',
                quantity: 2,
                total: 330000,
                orderStatus: 'completed',
                paymentStatus: 'paid',
                notes: 'Pesanan lebaran'
            },
            {
                id: 'NASTAR-2023-002',
                date: new Date().toISOString().split('T')[0],
                customer: 'Siti Aisyah',
                phone: '081987654321',
                size: 'kecil',
                quantity: 5,
                total: 215000,
                orderStatus: 'waiting',
                paymentStatus: 'unpaid',
                notes: ''
            },
            {
                id: 'NASTAR-2023-003',
                date: new Date().toISOString().split('T')[0],
                customer: 'Ahmad Fauzi',
                phone: '081112223344',
                size: 'sedang',
                quantity: 3,
                total: 255000,
                orderStatus: 'waiting',
                paymentStatus: 'paid',
                notes: 'Ambil jam 4 sore'
            },
            {
                id: 'NASTAR-2023-004',
                date: new Date().toISOString().split('T')[0],
                customer: 'Dewi Lestari',
                phone: '085555666777',
                size: 'besar',
                quantity: 1,
                total: 165000,
                orderStatus: 'completed',
                paymentStatus: 'paid',
                notes: 'Untuk arisan'
            }
        ];
        
        // Sample materials
        materials = [
            {
                id: 1,
                name: 'Tepung Terigu',
                price: 12000,
                unit: 'kg',
                stock: 50,
                minStock: 10,
                lastUpdate: new Date().toISOString().split('T')[0]
            },
            {
                id: 2,
                name: 'Gula Halus',
                price: 18000,
                unit: 'kg',
                stock: 30,
                minStock: 5,
                lastUpdate: new Date().toISOString().split('T')[0]
            },
            {
                id: 3,
                name: 'Mentega',
                price: 35000,
                unit: 'kg',
                stock: 20,
                minStock: 5,
                lastUpdate: new Date().toISOString().split('T')[0]
            },
            {
                id: 4,
                name: 'Kuning Telur',
                price: 25000,
                unit: 'butir',
                stock: 200,
                minStock: 50,
                lastUpdate: new Date().toISOString().split('T')[0]
            },
            {
                id: 5,
                name: 'Keju Edam',
                price: 75000,
                unit: 'kg',
                stock: 15,
                minStock: 3,
                lastUpdate: new Date().toISOString().split('T')[0]
            }
        ];
        
        // Sample customers
        customers = [
            {
                name: 'Budi Santoso',
                phone: '081234567890',
                totalOrders: 5,
                totalSpent: 1250000,
                lastOrder: new Date().toISOString().split('T')[0]
            },
            {
                name: 'Siti Aisyah',
                phone: '081987654321',
                totalOrders: 3,
                totalSpent: 645000,
                lastOrder: new Date().toISOString().split('T')[0]
            },
            {
                name: 'Ahmad Fauzi',
                phone: '081112223344',
                totalOrders: 8,
                totalSpent: 1850000,
                lastOrder: new Date().toISOString().split('T')[0]
            }
        ];
        
    } catch (error) {
        console.error('Error loading sample data:', error);
    }
}

// Load Data from API
async function loadDataFromAPI() {
    try {
        showLoading('Mengambil data dari server...');
        
        // Load orders
        const ordersResponse = await fetch(`${systemConfig.apiUrl}/tabs/PESANAN`);
        if (ordersResponse.ok) {
            orders = await ordersResponse.json();
        }
        
        // Load materials
        const materialsResponse = await fetch(`${systemConfig.apiUrl}/tabs/BAHAN_BAKU`);
        if (materialsResponse.ok) {
            materials = await materialsResponse.json();
        }
        
        hideLoading();
        showToast('Data berhasil dimuat dari Google Sheets', 'success');
        
    } catch (error) {
        hideLoading();
        console.error('Error loading from API:', error);
        showToast('Gagal memuat data dari API. Menggunakan data lokal.', 'error');
        loadSampleData();
    }
}

// Page Navigation
function showPage(pageName) {
    try {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.style.display = 'none';
        });
        
        // Remove active class from all menu items
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Show selected page
        const pageElement = document.getElementById(`${pageName}Page`);
        if (pageElement) {
            pageElement.style.display = 'block';
            currentPage = pageName;
            
            // Update page title
            updatePageTitle(pageName);
            
            // Update active menu item
            const activeMenuItem = document.querySelector(`.menu-item[data-page="${pageName}"]`);
            if (activeMenuItem) {
                activeMenuItem.classList.add('active');
            }
            
            // Load page-specific data
            switch(pageName) {
                case 'dashboard':
                    updateDashboard();
                    break;
                case 'production':
                    loadProductionData();
                    break;
                case 'orders':
                    loadOrdersTable();
                    break;
                case 'customers':
                    loadCustomersData();
                    break;
                case 'reports':
                    generateReport();
                    break;
                case 'inventory':
                    loadInventoryData();
                    break;
                case 'settings':
                    loadSettingsData();
                    break;
            }
        } else {
            console.error(`Page element ${pageName}Page not found`);
        }
    } catch (error) {
        console.error(`Error showing page ${pageName}:`, error);
    }
}

// Update Page Title
function updatePageTitle(pageName) {
    try {
        const titles = {
            dashboard: 'Dashboard',
            production: 'Produksi & Modal',
            orders: 'Pesanan',
            customers: 'Pelanggan',
            reports: 'Laporan',
            inventory: 'Inventory',
            settings: 'Pengaturan'
        };
        
        const pageTitleElement = document.getElementById('pageTitle');
        const breadcrumbPageElement = document.getElementById('breadcrumbPage');
        
        const title = titles[pageName] || 'Dashboard';
        
        if (pageTitleElement) pageTitleElement.textContent = title;
        if (breadcrumbPageElement) breadcrumbPageElement.textContent = title;
        
    } catch (error) {
        console.error('Error updating page title:', error);
    }
}

// Toggle Sidebar
function toggleSidebar() {
    try {
        const sidebar = document.getElementById('sidebar');
        if (!sidebar) return;
        
        sidebar.classList.toggle('collapsed');
        
        // Update icon
        const icon = document.querySelector('#sidebarToggle i');
        if (icon) {
            if (sidebar.classList.contains('collapsed')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-chevron-right');
            } else {
                icon.classList.remove('fa-chevron-right');
                icon.classList.add('fa-bars');
            }
        }
    } catch (error) {
        console.error('Error toggling sidebar:', error);
    }
}

// Update Current Date - FIXED VERSION
function updateCurrentDate() {
    try {
        const now = new Date();
        
        // Format with day name
        const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const dayName = dayNames[now.getDay()];
        const formattedDate = `${dayName}, ${now.getDate()} ${now.toLocaleDateString('id-ID', { month: 'long' })} ${now.getFullYear()}`;
        
        // PERBAIKAN: Cek apakah element ada sebelum mengakses
        const headerInfoElement = document.querySelector('.header-info span');
        
        if (headerInfoElement) {
            headerInfoElement.textContent = formattedDate;
        } else {
            console.warn('Element .header-info span tidak ditemukan di DOM');
            // Coba alternatif selector
            const headerInfo = document.querySelector('.header-info');
            if (headerInfo) {
                const span = document.createElement('span');
                span.textContent = formattedDate;
                headerInfo.appendChild(span);
            }
        }
    } catch (error) {
        console.error('Error in updateCurrentDate:', error);
    }
}

// Apply Theme
function applyTheme(theme) {
    try {
        // Remove all theme classes
        document.body.classList.remove('theme-default', 'theme-dark', 'theme-light');
        
        // Add selected theme class
        document.body.classList.add(`theme-${theme}`);
        
        // Save to config
        systemConfig.theme = theme;
        saveConfig();
    } catch (error) {
        console.error('Error applying theme:', error);
    }
}

// Toggle Theme
function toggleTheme() {
    try {
        const currentTheme = systemConfig.theme || 'default';
        const themes = ['default', 'dark', 'light'];
        const currentIndex = themes.indexOf(currentTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        
        applyTheme(themes[nextIndex]);
        showToast(`Tema ${themes[nextIndex]} diterapkan`, 'success');
    } catch (error) {
        console.error('Error toggling theme:', error);
    }
}

// Select Theme
function selectTheme(theme) {
    try {
        applyTheme(theme);
        showToast(`Tema ${theme} diterapkan`, 'success');
    } catch (error) {
        console.error('Error selecting theme:', error);
    }
}

// Update Dashboard
function updateDashboard() {
    try {
        // Calculate stats
        const today = new Date().toISOString().split('T')[0];
        const todayOrders = orders.filter(order => order.date === today);
        const todaySales = todayOrders.reduce((sum, order) => sum + (order.total || 0), 0);
        const pendingOrders = orders.filter(order => order.orderStatus === 'waiting').length;
        const unpaidOrders = orders.filter(order => order.paymentStatus === 'unpaid').length;
        
        // Update stats cards
        const todaySalesElement = document.getElementById('todaySales');
        const pendingOrdersElement = document.getElementById('pendingOrders');
        const unpaidOrdersElement = document.getElementById('unpaidOrders');
        const newCustomersElement = document.getElementById('newCustomers');
        
        if (todaySalesElement) todaySalesElement.textContent = formatCurrency(todaySales);
        if (pendingOrdersElement) pendingOrdersElement.textContent = pendingOrders;
        if (unpaidOrdersElement) unpaidOrdersElement.textContent = unpaidOrders;
        if (newCustomersElement) newCustomersElement.textContent = customers.length;
        
        // Update badge counts
        const dashboardBadge = document.getElementById('dashboardBadge');
        const ordersBadge = document.getElementById('ordersBadge');
        
        if (dashboardBadge) dashboardBadge.textContent = pendingOrders + unpaidOrders;
        if (ordersBadge) ordersBadge.textContent = pendingOrders;
        
        // Load recent orders
        loadRecentOrders();
        
        // Initialize charts
        initializeCharts();
        
    } catch (error) {
        console.error('Error updating dashboard:', error);
    }
}

// Load Recent Orders
function loadRecentOrders() {
    try {
        const tableBody = document.getElementById('recentOrdersTable');
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        
        // Get recent 5 orders
        const recentOrders = [...orders]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);
        
        recentOrders.forEach(order => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${order.id || ''}</td>
                <td>
                    <strong>${order.customer || ''}</strong><br>
                    <small>${order.phone || ''}</small>
                </td>
                <td>${getSizeDisplay(order.size)}</td>
                <td>${order.quantity || 0}</td>
                <td>${formatCurrency(order.total || 0)}</td>
                <td>
                    <span class="badge ${order.orderStatus === 'waiting' ? 'badge-warning' : 'badge-success'}">
                        ${order.orderStatus === 'waiting' ? 'Menunggu' : 'Selesai'}
                    </span>
                    <span class="badge ${order.paymentStatus === 'unpaid' ? 'badge-danger' : 'badge-success'}">
                        ${order.paymentStatus === 'unpaid' ? 'Belum Bayar' : 'Lunas'}
                    </span>
                </td>
                <td>
                    <button class="btn-text" onclick="viewOrder('${order.id || ''}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading recent orders:', error);
    }
}

// Get Size Display
function getSizeDisplay(size) {
    const sizes = {
        kecil: 'Kecil (250g)',
        sedang: 'Sedang (500g)',
        besar: 'Besar (1000g)'
    };
    return sizes[size] || size || '';
}

// Format Currency
function formatCurrency(amount) {
    if (isNaN(amount)) amount = 0;
    return 'Rp ' + amount.toLocaleString('id-ID');
}

// Initialize Charts
function initializeCharts() {
    try {
        // Sales Chart
        const salesCtx = document.getElementById('salesChart');
        if (salesCtx) {
            // Prepare sales data for last 7 days
            const salesData = getSalesData(7);
            
            new Chart(salesCtx, {
                type: 'line',
                data: {
                    labels: salesData.labels,
                    datasets: [{
                        label: 'Penjualan (Rp)',
                        data: salesData.values,
                        borderColor: '#f57c00',
                        backgroundColor: 'rgba(245, 124, 0, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return 'Rp ' + (value/1000).toFixed(0) + 'k';
                                }
                            }
                        }
                    }
                }
            });
        }
        
        // Size Distribution Chart
        const sizeCtx = document.getElementById('sizeChart');
        if (sizeCtx) {
            const sizeData = getSizeDistribution();
            
            new Chart(sizeCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Kecil', 'Sedang', 'Besar'],
                    datasets: [{
                        data: [sizeData.kecil, sizeData.sedang, sizeData.besar],
                        backgroundColor: [
                            '#ffb74d',
                            '#f57c00',
                            '#e65100'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom',
                        }
                    }
                }
            });
        }
        
        // Mini Sales Chart
        const miniSalesCtx = document.getElementById('miniSalesChart');
        if (miniSalesCtx) {
            const miniData = getSalesData(5);
            
            new Chart(miniSalesCtx, {
                type: 'line',
                data: {
                    labels: miniData.labels,
                    datasets: [{
                        data: miniData.values,
                        borderColor: '#ffffff',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
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
        }
    } catch (error) {
        console.error('Error initializing charts:', error);
    }
}

// Get Sales Data
function getSalesData(days = 7) {
    try {
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
                .reduce((sum, order) => sum + (order.total || 0), 0);
            
            values.push(daySales);
        }
        
        return { labels, values };
    } catch (error) {
        console.error('Error getting sales data:', error);
        return { labels: [], values: [] };
    }
}

// Get Size Distribution
function getSizeDistribution() {
    const distribution = { kecil: 0, sedang: 0, besar: 0 };
    
    try {
        orders.forEach(order => {
            if (order.size && distribution[order.size] !== undefined) {
                distribution[order.size] += (order.quantity || 0);
            }
        });
    } catch (error) {
        console.error('Error getting size distribution:', error);
    }
    
    return distribution;
}

// Production Page Functions
function loadProductionData() {
    try {
        updateMaterialsTable();
        calculateProductionCost();
    } catch (error) {
        console.error('Error loading production data:', error);
    }
}

function updateMaterialsTable() {
    try {
        const tableBody = document.getElementById('materialsTable');
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        
        materials.forEach(material => {
            const status = material.stock <= material.minStock ? 'danger' : 'success';
            const statusText = material.stock <= material.minStock ? 'Hampir Habis' : 'Aman';
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <strong>${material.name || ''}</strong><br>
                    <small>${material.unit || ''}</small>
                </td>
                <td>${formatCurrency(material.price || 0)}</td>
                <td>${material.unit || ''}</td>
                <td>
                    <span class="${material.stock <= material.minStock ? 'text-danger' : ''}">
                        ${material.stock || 0}
                    </span>
                </td>
                <td>
                    <span class="badge ${material.stock <= material.minStock ? 'badge-danger' : 'badge-success'}">
                        ${statusText}
                    </span>
                </td>
                <td>
                    <button class="btn-text" onclick="editMaterial(${material.id || 0})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-text text-danger" onclick="deleteMaterial(${material.id || 0})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error updating materials table:', error);
    }
}

function calculateProductionCost() {
    try {
        const sizeElement = document.getElementById('calcSize');
        if (!sizeElement) return;
        
        const size = sizeElement.value;
        
        // Calculate material cost (simplified)
        let materialCost = 0;
        let productionCost = 0;
        let packagingCost = 0;
        
        if (size === 'kecil') {
            materialCost = 21250;
            productionCost = 4500;
            packagingCost = 2000;
        } else if (size === 'sedang') {
            materialCost = 42500;
            productionCost = 9000;
            packagingCost = 3500;
        } else if (size === 'besar') {
            materialCost = 85000;
            productionCost = 18000;
            packagingCost = 5000;
        }
        
        const totalCost = materialCost + productionCost + packagingCost;
        
        // Update display
        const materialCostElement = document.getElementById('materialCost');
        const productionCostElement = document.getElementById('productionCost');
        const packagingCostElement = document.getElementById('packagingCost');
        const totalCostElement = document.getElementById('totalCost');
        const sellingPriceElement = document.getElementById('sellingPrice');
        
        if (materialCostElement) materialCostElement.textContent = formatCurrency(materialCost);
        if (productionCostElement) productionCostElement.textContent = formatCurrency(productionCost);
        if (packagingCostElement) packagingCostElement.textContent = formatCurrency(packagingCost);
        if (totalCostElement) totalCostElement.textContent = formatCurrency(totalCost);
        
        // Auto-set selling price based on saved prices
        const sellingPrice = systemConfig.prices?.[size] || 0;
        if (sellingPriceElement) sellingPriceElement.value = sellingPrice;
        
        // Calculate profit
        calculateProfit();
    } catch (error) {
        console.error('Error calculating production cost:', error);
    }
}

function calculateProfit() {
    try {
        const totalCostElement = document.getElementById('totalCost');
        const sellingPriceElement = document.getElementById('sellingPrice');
        const profitAmountElement = document.getElementById('profitAmount');
        const profitMarginElement = document.getElementById('profitMargin');
        const roiElement = document.getElementById('roi');
        
        if (!totalCostElement || !sellingPriceElement || !profitAmountElement || !profitMarginElement || !roiElement) return;
        
        const totalCostText = totalCostElement.textContent.replace(/[^0-9]/g, '');
        const totalCost = parseFloat(totalCostText) || 0;
        const sellingPrice = parseFloat(sellingPriceElement.value) || 0;
        
        if (sellingPrice > 0) {
            const profit = sellingPrice - totalCost;
            const margin = totalCost > 0 ? ((profit / sellingPrice) * 100).toFixed(1) : '0.0';
            const roi = totalCost > 0 ? ((profit / totalCost) * 100).toFixed(1) : '0.0';
            
            profitAmountElement.textContent = formatCurrency(profit);
            profitMarginElement.textContent = `${margin}%`;
            roiElement.textContent = `${roi}%`;
            
            // Set color based on profit
            if (profit >= 0) {
                profitAmountElement.className = 'profit-positive';
                profitMarginElement.className = 'profit-positive';
                roiElement.className = 'profit-positive';
            } else {
                profitAmountElement.className = 'profit-negative';
                profitMarginElement.className = 'profit-negative';
                roiElement.className = 'profit-negative';
            }
        }
    } catch (error) {
        console.error('Error calculating profit:', error);
    }
}

function savePriceSettings() {
    try {
        const sizeElement = document.getElementById('calcSize');
        const sellingPriceElement = document.getElementById('sellingPrice');
        
        if (!sizeElement || !sellingPriceElement) return;
        
        const size = sizeElement.value;
        const sellingPrice = parseFloat(sellingPriceElement.value);
        
        if (!sellingPrice || sellingPrice <= 0) {
            showToast('Masukkan harga jual yang valid!', 'error');
            return;
        }
        
        if (!systemConfig.prices) systemConfig.prices = {};
        systemConfig.prices[size] = sellingPrice;
        saveConfig();
        
        showToast(`Harga untuk ${getSizeDisplay(size)} disimpan!`, 'success');
    } catch (error) {
        console.error('Error saving price settings:', error);
        showToast('Gagal menyimpan harga', 'error');
    }
}

// Orders Page Functions
function loadOrdersTable() {
    try {
        const tableBody = document.getElementById('ordersTable');
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        
        let filteredOrders = [...orders];
        
        // Apply filters
        if (activeFilters.orderStatus !== 'all') {
            filteredOrders = filteredOrders.filter(order => 
                order.orderStatus === activeFilters.orderStatus
            );
        }
        
        if (activeFilters.paymentStatus !== 'all') {
            filteredOrders = filteredOrders.filter(order => 
                order.paymentStatus === activeFilters.paymentStatus
            );
        }
        
        if (activeFilters.date) {
            filteredOrders = filteredOrders.filter(order => 
                order.date === activeFilters.date
            );
        }
        
        // Display orders
        filteredOrders.forEach(order => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${order.id || ''}</td>
                <td>${order.date || ''}</td>
                <td>
                    <strong>${order.customer || ''}</strong><br>
                    <small>${order.phone || ''}</small>
                </td>
                <td>${getSizeDisplay(order.size)}</td>
                <td>${order.quantity || 0}</td>
                <td>${formatCurrency(order.total || 0)}</td>
                <td>
                    <span class="badge ${order.orderStatus === 'waiting' ? 'badge-warning' : 'badge-success'}">
                        ${order.orderStatus === 'waiting' ? 'Menunggu' : 'Selesai'}
                    </span>
                </td>
                <td>
                    <span class="badge ${order.paymentStatus === 'unpaid' ? 'badge-danger' : 'badge-success'}">
                        ${order.paymentStatus === 'unpaid' ? 'Belum Bayar' : 'Lunas'}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon" onclick="viewOrder('${order.id || ''}')" title="Lihat Detail">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-icon" onclick="editOrder('${order.id || ''}')" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon text-danger" onclick="deleteOrder('${order.id || ''}')" title="Hapus">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tableBody.appendChild(row);
        });
        
        // Update counts
        const showingCountElement = document.getElementById('showingCount');
        const totalCountElement = document.getElementById('totalCount');
        
        if (showingCountElement) showingCountElement.textContent = filteredOrders.length;
        if (totalCountElement) totalCountElement.textContent = orders.length;
        
        // Update pagination
        updatePagination(filteredOrders.length);
    } catch (error) {
        console.error('Error loading orders table:', error);
    }
}

function applyFilters() {
    try {
        // Get filter values
        const orderStatusElement = document.querySelector('.filter-btn[data-filter].active');
        const orderStatus = orderStatusElement?.getAttribute('data-filter') || 'all';
        
        const paymentStatusElement = document.querySelector('.payment-filter-btn[data-payment].active');
        const paymentStatus = paymentStatusElement?.getAttribute('data-payment') || 'all';
        
        const dateElement = document.getElementById('dateFilter');
        const date = dateElement?.value || null;
        
        // Update active filters
        activeFilters = { orderStatus, paymentStatus, date };
        
        // Reload table
        loadOrdersTable();
    } catch (error) {
        console.error('Error applying filters:', error);
    }
}

function exportOrders() {
    try {
        // Create CSV content
        let csv = 'ID,Tanggal,Customer,Ukuran,Jumlah,Total,Status Pesanan,Status Bayar\n';
        
        orders.forEach(order => {
            csv += `"${order.id || ''}","${order.date || ''}","${order.customer || ''}","${order.phone || ''}",`;
            csv += `"${getSizeDisplay(order.size)}","${order.quantity || 0}","${order.total || 0}",`;
            csv += `"${order.orderStatus === 'waiting' ? 'Menunggu' : 'Selesai'}",`;
            csv += `"${order.paymentStatus === 'unpaid' ? 'Belum Bayar' : 'Lunas'}"\n`;
        });
        
        // Create download link
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `pesanan_nastar_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showToast('Data berhasil diexport ke CSV', 'success');
    } catch (error) {
        console.error('Error exporting orders:', error);
        showToast('Gagal mengexport data', 'error');
    }
}

// Customers Page Functions
function loadCustomersData() {
    try {
        updateCustomersTable();
        updateTopCustomers();
        initializeCustomerChart();
    } catch (error) {
        console.error('Error loading customers data:', error);
    }
}

function updateCustomersTable() {
    try {
        const tableBody = document.getElementById('customersTable');
        if (!tableBody) return;
        
        const searchElement = document.getElementById('customerSearch');
        const searchTerm = searchElement?.value.toLowerCase() || '';
        
        tableBody.innerHTML = '';
        
        let filteredCustomers = customers;
        
        if (searchTerm) {
            filteredCustomers = customers.filter(customer => 
                (customer.name && customer.name.toLowerCase().includes(searchTerm)) ||
                (customer.phone && customer.phone.includes(searchTerm))
            );
        }
        
        filteredCustomers.forEach(customer => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <strong>${customer.name || ''}</strong><br>
                    <small>${customer.phone || ''}</small>
                </td>
                <td>${customer.phone || ''}</td>
                <td>${customer.totalOrders || 0}</td>
                <td>${formatCurrency(customer.totalSpent || 0)}</td>
                <td>
                    <span class="badge ${customer.totalOrders > 5 ? 'badge-success' : 'badge-info'}">
                        ${customer.totalOrders > 5 ? 'Pelanggan Setia' : 'Pelanggan Baru'}
                    </span>
                </td>
                <td>
                    <button class="btn-icon" onclick="viewCustomer('${customer.phone || ''}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error updating customers table:', error);
    }
}

function updateTopCustomers() {
    try {
        const container = document.getElementById('topCustomers');
        if (!container) return;
        
        container.innerHTML = '';
        
        // Sort customers by total spent
        const topCustomers = [...customers]
            .sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0))
            .slice(0, 5);
        
        topCustomers.forEach((customer, index) => {
            const item = document.createElement('div');
            item.className = 'top-customer-item';
            item.innerHTML = `
                <div class="top-customer-rank">${index + 1}</div>
                <div class="top-customer-info">
                    <span class="top-customer-name">${customer.name || ''}</span>
                    <span class="top-customer-amount">${formatCurrency(customer.totalSpent || 0)}</span>
                </div>
            `;
            container.appendChild(item);
        });
    } catch (error) {
        console.error('Error updating top customers:', error);
    }
}

// Reports Page Functions
function generateReport() {
    try {
        const periodElement = document.getElementById('reportPeriod');
        const reportTypeElement = document.getElementById('reportType');
        
        if (!periodElement || !reportTypeElement) return;
        
        const period = periodElement.value;
        const reportType = reportTypeElement.value;
        
        // Calculate report data based on period
        const reportData = calculateReportData(period);
        
        // Update summary cards
        const reportTotalElement = document.getElementById('reportTotal');
        const reportProfitElement = document.getElementById('reportProfit');
        const reportAverageElement = document.getElementById('reportAverage');
        const reportOrdersElement = document.getElementById('reportOrders');
        
        if (reportTotalElement) reportTotalElement.textContent = formatCurrency(reportData.totalSales);
        if (reportProfitElement) reportProfitElement.textContent = formatCurrency(reportData.totalProfit);
        if (reportAverageElement) reportAverageElement.textContent = formatCurrency(reportData.averageOrder);
        if (reportOrdersElement) reportOrdersElement.textContent = reportData.totalOrders;
        
        // Generate charts
        generateReportCharts(reportData, reportType);
        
        // Update report table
        updateReportTable(reportData.orders);
    } catch (error) {
        console.error('Error generating report:', error);
    }
}

function calculateReportData(period) {
    try {
        let filteredOrders = [...orders];
        const today = new Date();
        
        // Filter by period
        if (period === 'today') {
            const todayStr = today.toISOString().split('T')[0];
            filteredOrders = orders.filter(order => order.date === todayStr);
        } else if (period === 'week') {
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            filteredOrders = orders.filter(order => {
                const orderDate = new Date(order.date);
                return orderDate >= weekAgo;
            });
        } else if (period === 'month') {
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            filteredOrders = orders.filter(order => {
                const orderDate = new Date(order.date);
                return orderDate >= monthAgo;
            });
        } else if (period === 'custom') {
            const startDate = document.getElementById('startDate')?.value;
            const endDate = document.getElementById('endDate')?.value;
            
            if (startDate && endDate) {
                filteredOrders = orders.filter(order => {
                    return order.date >= startDate && order.date <= endDate;
                });
            }
        }
        
        // Calculate totals
        const totalSales = filteredOrders.reduce((sum, order) => sum + (order.total || 0), 0);
        const totalOrders = filteredOrders.length;
        const averageOrder = totalOrders > 0 ? totalSales / totalOrders : 0;
        
        // Estimate profit (40% margin for demo)
        const totalProfit = totalSales * 0.4;
        
        return {
            totalSales,
            totalProfit,
            totalOrders,
            averageOrder,
            orders: filteredOrders
        };
    } catch (error) {
        console.error('Error calculating report data:', error);
        return {
            totalSales: 0,
            totalProfit: 0,
            totalOrders: 0,
            averageOrder: 0,
            orders: []
        };
    }
}

// Inventory Page Functions
function loadInventoryData() {
    try {
        updateInventoryStats();
        updateInventoryTable();
        updateStockAlerts();
        initializeInventoryChart();
    } catch (error) {
        console.error('Error loading inventory data:', error);
    }
}

function updateInventoryStats() {
    try {
        const totalMaterials = materials.length;
        const lowStockCount = materials.filter(m => m.stock <= m.minStock).length;
        const inventoryValue = materials.reduce((sum, m) => sum + ((m.price || 0) * (m.stock || 0)), 0);
        
        const totalMaterialsElement = document.getElementById('totalMaterials');
        const lowStockCountElement = document.getElementById('lowStockCount');
        const inventoryValueElement = document.getElementById('inventoryValue');
        const turnoverRateElement = document.getElementById('turnoverRate');
        
        if (totalMaterialsElement) totalMaterialsElement.textContent = `${totalMaterials} item`;
        if (lowStockCountElement) lowStockCountElement.textContent = `${lowStockCount} item`;
        if (inventoryValueElement) inventoryValueElement.textContent = formatCurrency(inventoryValue);
        
        // Calculate turnover rate (simplified)
        const turnoverRate = calculateTurnoverRate();
        if (turnoverRateElement) turnoverRateElement.textContent = `${turnoverRate}%`;
    } catch (error) {
        console.error('Error updating inventory stats:', error);
    }
}

function updateInventoryTable() {
    try {
        const tableBody = document.getElementById('inventoryTable');
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        
        materials.forEach(material => {
            const status = material.stock <= material.minStock ? 'danger' : 'success';
            const statusText = material.stock <= material.minStock ? 'Hampir Habis' : 'Aman';
            const totalValue = (material.price || 0) * (material.stock || 0);
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <strong>${material.name || ''}</strong><br>
                    <small>${material.unit || ''}</small>
                </td>
                <td class="${material.stock <= material.minStock ? 'text-danger' : ''}">
                    ${material.stock || 0}
                </td>
                <td>${material.minStock || 0}</td>
                <td>
                    <span class="badge ${status === 'danger' ? 'badge-danger' : 'badge-success'}">
                        ${statusText}
                    </span>
                </td>
                <td>${formatCurrency(material.price || 0)}</td>
                <td>${formatCurrency(totalValue)}</td>
                <td>
                    <button class="btn-icon" onclick="updateStock(${material.id || 0}, 10)">
                        <i class="fas fa-plus"></i>
                    </button>
                    <button class="btn-icon" onclick="updateStock(${material.id || 0}, -10)">
                        <i class="fas fa-minus"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error updating inventory table:', error);
    }
}

function updateStockAlerts() {
    try {
        const container = document.getElementById('stockAlerts');
        if (!container) return;
        
        container.innerHTML = '';
        
        const lowStockMaterials = materials.filter(m => m.stock <= m.minStock);
        
        if (lowStockMaterials.length === 0) {
            container.innerHTML = '<div class="alert alert-success">Semua stok aman</div>';
            return;
        }
        
        lowStockMaterials.forEach(material => {
            const alert = document.createElement('div');
            alert.className = 'alert-item';
            alert.innerHTML = `
                <i class="fas fa-exclamation-triangle"></i>
                <div>
                    <strong>${material.name || ''}</strong>
                    <p>Stok: ${material.stock || 0} ${material.unit || ''} (Minimum: ${material.minStock || 0})</p>
                </div>
            `;
            container.appendChild(alert);
        });
    } catch (error) {
        console.error('Error updating stock alerts:', error);
    }
}

// Settings Page Functions
function loadSettingsData() {
    try {
        // Load API settings
        const apiUrlElement = document.getElementById('apiUrl');
        const apiKeyElement = document.getElementById('apiKey');
        
        if (apiUrlElement) apiUrlElement.value = systemConfig.apiUrl || '';
        if (apiKeyElement) apiKeyElement.value = systemConfig.apiKey || '';
        
        // Load product settings
        const productNameElement = document.getElementById('productName');
        const priceSmallElement = document.getElementById('priceSmall');
        const priceMediumElement = document.getElementById('priceMedium');
        const priceLargeElement = document.getElementById('priceLarge');
        
        if (productNameElement) productNameElement.value = systemConfig.productName || '';
        if (priceSmallElement) priceSmallElement.value = systemConfig.prices?.kecil || 43000;
        if (priceMediumElement) priceMediumElement.value = systemConfig.prices?.sedang || 85000;
        if (priceLargeElement) priceLargeElement.value = systemConfig.prices?.besar || 165000;
        
        // Load theme settings
        const themeOption = document.querySelector(`[data-theme="${systemConfig.theme}"]`);
        if (themeOption) themeOption.classList.add('active');
        
        const layoutModeElement = document.getElementById('layoutMode');
        const animationsToggleElement = document.getElementById('animationsToggle');
        
        if (layoutModeElement) layoutModeElement.value = systemConfig.layout || 'collapsible';
        if (animationsToggleElement) animationsToggleElement.checked = systemConfig.animations !== false;
        
        // Update connection status
        updateConnectionStatus();
    } catch (error) {
        console.error('Error loading settings data:', error);
    }
}

function saveAPISettings() {
    try {
        const apiUrlElement = document.getElementById('apiUrl');
        const apiKeyElement = document.getElementById('apiKey');
        
        if (!apiUrlElement || !apiKeyElement) return;
        
        const apiUrl = apiUrlElement.value.trim();
        const apiKey = apiKeyElement.value.trim();
        
        systemConfig.apiUrl = apiUrl;
        systemConfig.apiKey = apiKey;
        
        saveConfig();
        
        // Test connection
        testConnection();
    } catch (error) {
        console.error('Error saving API settings:', error);
        showToast('Gagal menyimpan pengaturan API', 'error');
    }
}

async function testConnection() {
    try {
        if (!systemConfig.apiUrl) {
            showToast('URL API belum diisi', 'warning');
            return;
        }
        
        showLoading('Menguji koneksi...');
        const response = await fetch(systemConfig.apiUrl);
        
        if (response.ok) {
            showToast('Koneksi berhasil!', 'success');
            updateConnectionStatus(true);
        } else {
            throw new Error('Response not OK');
        }
    } catch (error) {
        showToast('Koneksi gagal: ' + error.message, 'error');
        updateConnectionStatus(false);
    } finally {
        hideLoading();
    }
}

function updateConnectionStatus(connected = false) {
    try {
        const statusElement = document.getElementById('connectionStatus');
        if (!statusElement) return;
        
        if (connected) {
            statusElement.innerHTML = '<i class="fas fa-check-circle"></i> Status: Terhubung';
            statusElement.className = 'connection-status connected';
        } else {
            statusElement.innerHTML = '<i class="fas fa-times-circle"></i> Status: Tidak Terhubung';
            statusElement.className = 'connection-status';
        }
    } catch (error) {
        console.error('Error updating connection status:', error);
    }
}

// Modal Functions
function showModal(modalId) {
    try {
        const modalOverlay = document.getElementById('modalOverlay');
        const modal = document.getElementById(modalId);
        
        if (!modalOverlay || !modal) return;
        
        modalOverlay.style.display = 'block';
        modal.style.display = 'block';
        
        // Add animation
        modal.style.animation = 'fadeIn 0.3s ease';
    } catch (error) {
        console.error('Error showing modal:', error);
    }
}

function closeModal(modalId) {
    try {
        const modalOverlay = document.getElementById('modalOverlay');
        const modal = document.getElementById(modalId);
        
        if (!modalOverlay || !modal) return;
        
        modalOverlay.style.display = 'none';
        modal.style.display = 'none';
    } catch (error) {
        console.error('Error closing modal:', error);
    }
}

function closeAllModals() {
    try {
        const modalOverlay = document.getElementById('modalOverlay');
        if (!modalOverlay) return;
        
        modalOverlay.style.display = 'none';
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    } catch (error) {
        console.error('Error closing all modals:', error);
    }
}

// New Order Modal
function showNewOrderModal() {
    try {
        showModal('newOrderModal');
        
        // Reset form
        const modalCustomerName = document.getElementById('modalCustomerName');
        const modalCustomerPhone = document.getElementById('modalCustomerPhone');
        const orderQuantity = document.getElementById('orderQuantity');
        
        if (modalCustomerName) modalCustomerName.value = '';
        if (modalCustomerPhone) modalCustomerPhone.value = '';
        if (orderQuantity) orderQuantity.value = '1';
        
        // Set default size
        document.querySelectorAll('.size-option').forEach(option => {
            option.classList.remove('active');
        });
        
        const defaultSizeOption = document.querySelector('.size-option[data-size="sedang"]');
        if (defaultSizeOption) defaultSizeOption.classList.add('active');
        
        // Calculate initial total
        calculateOrderTotal();
    } catch (error) {
        console.error('Error showing new order modal:', error);
    }
}

function adjustQuantity(change) {
    try {
        const quantityInput = document.getElementById('orderQuantity');
        if (!quantityInput) return;
        
        let newQuantity = parseInt(quantityInput.value) + change;
        
        if (newQuantity < 1) newQuantity = 1;
        quantityInput.value = newQuantity;
        
        calculateOrderTotal();
    } catch (error) {
        console.error('Error adjusting quantity:', error);
    }
}

function calculateOrderTotal() {
    try {
        const activeSizeElement = document.querySelector('.size-option.active');
        const quantityInput = document.getElementById('orderQuantity');
        const orderTotalElement = document.getElementById('orderTotal');
        
        if (!activeSizeElement || !quantityInput || !orderTotalElement) return;
        
        const activeSize = activeSizeElement.getAttribute('data-size');
        const quantity = parseInt(quantityInput.value) || 1;
        const price = systemConfig.prices?.[activeSize] || 0;
        const total = price * quantity;
        
        orderTotalElement.textContent = formatCurrency(total);
    } catch (error) {
        console.error('Error calculating order total:', error);
    }
}

function saveNewOrder() {
    try {
        const customerNameElement = document.getElementById('modalCustomerName');
        const customerPhoneElement = document.getElementById('modalCustomerPhone');
        const activeSizeElement = document.querySelector('.size-option.active');
        const quantityElement = document.getElementById('orderQuantity');
        const activeStatusElement = document.querySelector('.status-option.active');
        const activePaymentElement = document.querySelector('.payment-option.active');
        
        if (!customerNameElement || !customerPhoneElement || !activeSizeElement || !quantityElement || 
            !activeStatusElement || !activePaymentElement) {
            showToast('Form tidak lengkap', 'error');
            return;
        }
        
        const customerName = customerNameElement.value.trim();
        const customerPhone = customerPhoneElement.value.trim();
        const size = activeSizeElement.getAttribute('data-size');
        const quantity = parseInt(quantityElement.value) || 1;
        const orderStatus = activeStatusElement.getAttribute('data-status');
        const paymentStatus = activePaymentElement.getAttribute('data-payment');
        
        // Validation
        if (!customerName) {
            showToast('Nama harus diisi', 'error');
            return;
        }
        
        // Calculate total
        const price = systemConfig.prices?.[size] || 0;
        const total = price * quantity;
        
        // Create new order
        const newOrder = {
            id: generateOrderId(),
            date: new Date().toISOString().split('T')[0],
            customer: customerName,
            phone: customerPhone,
            size: size,
            quantity: quantity,
            total: total,
            orderStatus: orderStatus,
            paymentStatus: paymentStatus,
            notes: ''
        };
        
        // Add to orders array
        orders.unshift(newOrder);
        
        // Update customer data
        updateCustomerData(customerName, customerPhone, total);
        
        // Save to Google Sheets if connected
        if (systemConfig.apiUrl) {
            saveOrderToAPI(newOrder);
        }
        
        // Close modal
        closeModal('newOrderModal');
        
        // Show success message
        showToast('Pesanan berhasil disimpan!', 'success');
        
        // Refresh data
        if (currentPage === 'dashboard') {
            updateDashboard();
        } else if (currentPage === 'orders') {
            loadOrdersTable();
        }
    } catch (error) {
        console.error('Error saving new order:', error);
        showToast('Gagal menyimpan pesanan', 'error');
    }
}

function generateOrderId() {
    try {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        
        return `NASTAR-${year}${month}${day}-${random}`;
    } catch (error) {
        console.error('Error generating order ID:', error);
        return `NASTAR-${Date.now()}`;
    }
}

// Toast Notifications
function showToast(message, type = 'info') {
    try {
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) return;
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas ${getToastIcon(type)}"></i>
            <span>${message}</span>
        `;
        
        toastContainer.appendChild(toast);
        
        // Remove toast after 5 seconds
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }, 5000);
    } catch (error) {
        console.error('Error showing toast:', error);
        // Fallback alert
        alert(`${type.toUpperCase()}: ${message}`);
    }
}

function getToastIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    return icons[type] || 'fa-info-circle';
}

// Loading Functions
function showLoading(message = 'Memuat...') {
    try {
        const loadingScreen = document.getElementById('loadingScreen');
        if (!loadingScreen) return;
        
        loadingScreen.style.display = 'flex';
        
        const messageElement = loadingScreen.querySelector('p');
        if (messageElement && message) {
            messageElement.textContent = message;
        }
    } catch (error) {
        console.error('Error showing loading:', error);
    }
}

function hideLoadingScreen() {
    try {
        const loadingScreen = document.getElementById('loadingScreen');
        if (!loadingScreen) return;
        
        loadingScreen.style.opacity = '0';
        
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            loadingScreen.style.opacity = '1';
        }, 300);
    } catch (error) {
        console.error('Error hiding loading screen:', error);
    }
}

function hideLoading() {
    // This function can be used for specific loading states
}

// Helper Functions
function initializeTooltips() {
    try {
        // Initialize tooltips using Tippy.js if available
        if (typeof tippy !== 'undefined') {
            tippy('[title]', {
                placement: 'top',
                animation: 'scale'
            });
        }
    } catch (error) {
        console.error('Error initializing tooltips:', error);
    }
}

function handleResize() {
    try {
        // Handle responsive behavior
        const width = window.innerWidth;
        const sidebar = document.getElementById('sidebar');
        
        if (width < 768 && sidebar) {
            sidebar.classList.add('collapsed');
        }
    } catch (error) {
        console.error('Error handling resize:', error);
    }
}

function searchData(query) {
    try {
        if (query.length < 2) return;
        
        // Search functionality
        const results = {
            orders: orders.filter(order => 
                (order.customer && order.customer.toLowerCase().includes(query.toLowerCase())) ||
                (order.phone && order.phone.includes(query)) ||
                (order.id && order.id.toLowerCase().includes(query.toLowerCase()))
            ),
            customers: customers.filter(customer =>
                (customer.name && customer.name.toLowerCase().includes(query.toLowerCase())) ||
                (customer.phone && customer.phone.includes(query))
            )
        };
        
        // Show search results in a modal or update current page
        if (currentPage === 'orders' && results.orders.length > 0) {
            // Filter orders table
            // Implementation depends on your table structure
        }
    } catch (error) {
        console.error('Error searching data:', error);
    }
}

function saveConfig() {
    try {
        localStorage.setItem('nastarConfig', JSON.stringify(systemConfig));
    } catch (error) {
        console.error('Error saving config:', error);
    }
}

function saveOrderToAPI(order) {
    // Implementation for saving to Google Sheets API
    console.log('Saving order to API:', order);
    // Add your API call logic here
}

function updateCustomerData(name, phone, amount) {
    try {
        // Find existing customer
        let customer = customers.find(c => c.phone === phone);
        
        if (customer) {
            // Update existing customer
            customer.totalOrders += 1;
            customer.totalSpent += amount;
            customer.lastOrder = new Date().toISOString().split('T')[0];
        } else {
            // Add new customer
            customers.push({
                name: name,
                phone: phone,
                totalOrders: 1,
                totalSpent: amount,
                lastOrder: new Date().toISOString().split('T')[0]
            });
        }
    } catch (error) {
        console.error('Error updating customer data:', error);
    }
}

function updatePagination(totalItems) {
    // Implementation for pagination
    console.log('Total items:', totalItems);
}

function updateReportTable(orders) {
    // Implementation for report table
    console.log('Report orders:', orders);
}

function generateReportCharts(reportData, reportType) {
    // Implementation for report charts
    console.log('Report data:', reportData, 'Type:', reportType);
}

function initializeCustomerChart() {
    // Implementation for customer chart
}

function initializeInventoryChart() {
    // Implementation for inventory chart
}

function calculateTurnoverRate() {
    // Simplified turnover rate calculation
    return Math.floor(Math.random() * 100);
}

function showNotifications() {
    showToast('Fitur notifikasi akan datang!', 'info');
}

function showSettingsSection(section) {
    showToast(`Membuka pengaturan: ${section}`, 'info');
}

function viewOrder(orderId) {
    showToast(`Melihat pesanan: ${orderId}`, 'info');
}

function editOrder(orderId) {
    showToast(`Mengedit pesanan: ${orderId}`, 'info');
}

function deleteOrder(orderId) {
    if (confirm('Apakah Anda yakin ingin menghapus pesanan ini?')) {
        orders = orders.filter(order => order.id !== orderId);
        showToast('Pesanan berhasil dihapus', 'success');
        if (currentPage === 'orders') loadOrdersTable();
        if (currentPage === 'dashboard') updateDashboard();
    }
}

function viewCustomer(phone) {
    showToast(`Melihat pelanggan: ${phone}`, 'info');
}

function editMaterial(id) {
    showToast(`Mengedit bahan: ${id}`, 'info');
}

function deleteMaterial(id) {
    if (confirm('Apakah Anda yakin ingin menghapus bahan ini?')) {
        materials = materials.filter(material => material.id !== id);
        showToast('Bahan berhasil dihapus', 'success');
        if (currentPage === 'production') updateMaterialsTable();
        if (currentPage === 'inventory') updateInventoryTable();
    }
}

function updateStock(id, amount) {
    const material = materials.find(m => m.id === id);
    if (material) {
        material.stock += amount;
        if (material.stock < 0) material.stock = 0;
        material.lastUpdate = new Date().toISOString().split('T')[0];
        
        showToast(`Stok ${material.name} diperbarui: ${material.stock}`, 'success');
        
        if (currentPage === 'inventory') {
            updateInventoryTable();
            updateStockAlerts();
            updateInventoryStats();
        }
    }
}

// Initialize when page loads
window.onload = function() {
    try {
        // Add any initialization that needs to happen after all resources are loaded
        console.log('System initialized successfully');
    } catch (error) {
        console.error('Error during window.onload:', error);
    }
};