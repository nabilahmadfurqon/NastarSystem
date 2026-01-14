/* =============================================
   TOKO NASTAR NOTED - DATABASE FUNCTIONS
   Google Sheets API Integration
   ============================================= */

// Google Sheets API Configuration
class SheetDB {
    constructor(config = {}) {
        this.apiUrl = config.apiUrl || '';
        this.apiKey = config.apiKey || '';
        this.cache = new Map();
        this.cacheTime = 5 * 60 * 1000; // 5 minutes cache
    }

    // Set API configuration
    setConfig(config) {
        this.apiUrl = config.apiUrl || '';
        this.apiKey = config.apiKey || '';
        this.clearCache();
    }

    // Clear cache
    clearCache() {
        this.cache.clear();
    }

    // Get data from sheet
    async getSheetData(sheetName) {
        const cacheKey = `sheet_${sheetName}`;
        const cached = this.cache.get(cacheKey);
        
        // Return cached data if valid
        if (cached && Date.now() - cached.timestamp < this.cacheTime) {
            return cached.data;
        }

        try {
            const url = `${this.apiUrl}/tabs/${encodeURIComponent(sheetName)}`;
            const headers = this.apiKey ? { 'Authorization': `Bearer ${this.apiKey}` } : {};
            
            const response = await fetch(url, { headers });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            // Cache the data
            this.cache.set(cacheKey, {
                data: data,
                timestamp: Date.now()
            });
            
            return data;
        } catch (error) {
            console.error(`Error fetching sheet ${sheetName}:`, error);
            throw error;
        }
    }

    // Add data to sheet
    async addToSheet(sheetName, data) {
        try {
            const url = `${this.apiUrl}/tabs/${encodeURIComponent(sheetName)}`;
            const headers = {
                'Content-Type': 'application/json',
                ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` })
            };
            
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            // Clear cache for this sheet
            this.cache.delete(`sheet_${sheetName}`);
            
            return await response.json();
        } catch (error) {
            console.error(`Error adding to sheet ${sheetName}:`, error);
            throw error;
        }
    }

    // Update data in sheet
    async updateSheet(sheetName, rowId, data) {
        try {
            const url = `${this.apiUrl}/tabs/${encodeURIComponent(sheetName)}/${rowId}`;
            const headers = {
                'Content-Type': 'application/json',
                ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` })
            };
            
            const response = await fetch(url, {
                method: 'PATCH',
                headers: headers,
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            // Clear cache for this sheet
            this.cache.delete(`sheet_${sheetName}`);
            
            return await response.json();
        } catch (error) {
            console.error(`Error updating sheet ${sheetName}:`, error);
            throw error;
        }
    }

    // Delete data from sheet
    async deleteFromSheet(sheetName, rowId) {
        try {
            const url = `${this.apiUrl}/tabs/${encodeURIComponent(sheetName)}/${rowId}`;
            const headers = this.apiKey ? { 'Authorization': `Bearer ${this.apiKey}` } : {};
            
            const response = await fetch(url, {
                method: 'DELETE',
                headers: headers
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            // Clear cache for this sheet
            this.cache.delete(`sheet_${sheetName}`);
            
            return true;
        } catch (error) {
            console.error(`Error deleting from sheet ${sheetName}:`, error);
            throw error;
        }
    }
}

// Local Storage Fallback
class LocalStorageDB {
    constructor() {
        this.prefix = 'nastar_';
    }

    // Save data
    save(key, data) {
        try {
            localStorage.setItem(`${this.prefix}${key}`, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    }

    // Load data
    load(key) {
        try {
            const data = localStorage.getItem(`${this.prefix}${key}`);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            return null;
        }
    }

    // Delete data
    delete(key) {
        try {
            localStorage.removeItem(`${this.prefix}${key}`);
            return true;
        } catch (error) {
            console.error('Error deleting from localStorage:', error);
            return false;
        }
    }

    // Clear all data
    clear() {
        try {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith(this.prefix)) {
                    localStorage.removeItem(key);
                }
            }
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    }
}

// Data Synchronization Service
class DataSyncService {
    constructor() {
        this.sheetDB = new SheetDB();
        this.localDB = new LocalStorageDB();
        this.isOnline = navigator.onLine;
        this.syncQueue = [];
        this.syncing = false;
        
        // Listen for online/offline events
        window.addEventListener('online', () => this.handleOnline());
        window.addEventListener('offline', () => this.handleOffline());
        
        // Initialize
        this.loadConfig();
    }

    // Load configuration
    loadConfig() {
        const config = this.localDB.load('config') || {};
        this.sheetDB.setConfig(config);
        return config;
    }

    // Save configuration
    saveConfig(config) {
        this.localDB.save('config', config);
        this.sheetDB.setConfig(config);
    }

    // Handle online status
    handleOnline() {
        this.isOnline = true;
        this.processSyncQueue();
        showToast('Koneksi internet tersedia', 'success');
    }

    // Handle offline status
    handleOffline() {
        this.isOnline = false;
        showToast('Mode offline aktif', 'warning');
    }

    // Get orders
    async getOrders() {
        try {
            if (this.isOnline && this.sheetDB.apiUrl) {
                const orders = await this.sheetDB.getSheetData('PESANAN');
                this.localDB.save('orders', orders);
                return orders;
            } else {
                return this.localDB.load('orders') || [];
            }
        } catch (error) {
            console.error('Error getting orders:', error);
            return this.localDB.load('orders') || [];
        }
    }

    // Get materials
    async getMaterials() {
        try {
            if (this.isOnline && this.sheetDB.apiUrl) {
                const materials = await this.sheetDB.getSheetData('BAHAN_BAKU');
                this.localDB.save('materials', materials);
                return materials;
            } else {
                return this.localDB.load('materials') || [];
            }
        } catch (error) {
            console.error('Error getting materials:', error);
            return this.localDB.load('materials') || [];
        }
    }

    // Save order
    async saveOrder(order) {
        try {
            // Save locally first
            const orders = this.localDB.load('orders') || [];
            orders.unshift(order);
            this.localDB.save('orders', orders);
            
            // Queue for sync if online
            if (this.isOnline && this.sheetDB.apiUrl) {
                await this.sheetDB.addToSheet('PESANAN', order);
                showToast('Pesanan disimpan ke cloud', 'success');
            } else {
                this.addToSyncQueue('order', order);
                showToast('Pesanan disimpan lokal (akan disinkron saat online)', 'warning');
            }
            
            return order;
        } catch (error) {
            console.error('Error saving order:', error);
            showToast('Gagal menyimpan pesanan', 'error');
            throw error;
        }
    }

    // Update order
    async updateOrder(orderId, updates) {
        try {
            // Update locally
            const orders = this.localDB.load('orders') || [];
            const index = orders.findIndex(o => o.id === orderId);
            if (index !== -1) {
                orders[index] = { ...orders[index], ...updates };
                this.localDB.save('orders', orders);
            }
            
            // Queue for sync if online
            if (this.isOnline && this.sheetDB.apiUrl) {
                await this.sheetDB.updateSheet('PESANAN', orderId, updates);
                showToast('Pesanan diperbarui di cloud', 'success');
            } else {
                this.addToSyncQueue('update_order', { orderId, updates });
                showToast('Perubahan disimpan lokal', 'warning');
            }
            
            return true;
        } catch (error) {
            console.error('Error updating order:', error);
            showToast('Gagal memperbarui pesanan', 'error');
            throw error;
        }
    }

    // Delete order
    async deleteOrder(orderId) {
        try {
            // Delete locally
            let orders = this.localDB.load('orders') || [];
            orders = orders.filter(o => o.id !== orderId);
            this.localDB.save('orders', orders);
            
            // Queue for sync if online
            if (this.isOnline && this.sheetDB.apiUrl) {
                await this.sheetDB.deleteFromSheet('PESANAN', orderId);
                showToast('Pesanan dihapus dari cloud', 'success');
            } else {
                this.addToSyncQueue('delete_order', orderId);
                showToast('Pesanan dihapus lokal', 'warning');
            }
            
            return true;
        } catch (error) {
            console.error('Error deleting order:', error);
            showToast('Gagal menghapus pesanan', 'error');
            throw error;
        }
    }

    // Save material
    async saveMaterial(material) {
        try {
            // Save locally
            const materials = this.localDB.load('materials') || [];
            const index = materials.findIndex(m => m.id === material.id);
            
            if (index !== -1) {
                materials[index] = material;
            } else {
                materials.push(material);
            }
            
            this.localDB.save('materials', materials);
            
            // Queue for sync if online
            if (this.isOnline && this.sheetDB.apiUrl) {
                if (index !== -1) {
                    await this.sheetDB.updateSheet('BAHAN_BAKU', material.id, material);
                } else {
                    await this.sheetDB.addToSheet('BAHAN_BAKU', material);
                }
                showToast('Bahan baku disimpan ke cloud', 'success');
            } else {
                this.addToSyncQueue('material', material);
                showToast('Bahan baku disimpan lokal', 'warning');
            }
            
            return material;
        } catch (error) {
            console.error('Error saving material:', error);
            showToast('Gagal menyimpan bahan baku', 'error');
            throw error;
        }
    }

    // Add to sync queue
    addToSyncQueue(type, data) {
        this.syncQueue.push({
            type,
            data,
            timestamp: Date.now(),
            id: Math.random().toString(36).substr(2, 9)
        });
        
        // Save queue to localStorage
        this.localDB.save('sync_queue', this.syncQueue);
        
        // Auto-sync if coming online
        if (this.isOnline && !this.syncing) {
            this.processSyncQueue();
        }
    }

    // Process sync queue
    async processSyncQueue() {
        if (this.syncing || !this.isOnline || this.syncQueue.length === 0) {
            return;
        }
        
        this.syncing = true;
        showLoading('Menyinkronkan data...');
        
        try {
            const queue = [...this.syncQueue];
            const failedItems = [];
            
            for (const item of queue) {
                try {
                    switch (item.type) {
                        case 'order':
                            await this.sheetDB.addToSheet('PESANAN', item.data);
                            break;
                        case 'update_order':
                            await this.sheetDB.updateSheet('PESANAN', item.data.orderId, item.data.updates);
                            break;
                        case 'delete_order':
                            await this.sheetDB.deleteFromSheet('PESANAN', item.data);
                            break;
                        case 'material':
                            await this.sheetDB.addToSheet('BAHAN_BAKU', item.data);
                            break;
                    }
                    
                    // Remove from queue on success
                    this.syncQueue = this.syncQueue.filter(q => q.id !== item.id);
                } catch (error) {
                    console.error('Sync error:', error);
                    failedItems.push(item);
                }
            }
            
            // Save updated queue
            this.localDB.save('sync_queue', failedItems);
            
            if (failedItems.length === 0) {
                showToast('Semua data berhasil disinkronkan', 'success');
            } else {
                showToast(`${queue.length - failedItems.length} dari ${queue.length} data berhasil disinkronkan`, 'warning');
            }
            
        } catch (error) {
            console.error('Error processing sync queue:', error);
            showToast('Gagal menyinkronkan data', 'error');
        } finally {
            this.syncing = false;
            hideLoading();
        }
    }

    // Export data
    async exportData(format = 'json') {
        try {
            const data = {
                orders: this.localDB.load('orders') || [],
                materials: this.localDB.load('materials') || [],
                config: this.localDB.load('config') || {},
                timestamp: new Date().toISOString()
            };
            
            if (format === 'json') {
                return JSON.stringify(data, null, 2);
            } else if (format === 'csv') {
                return this.convertToCSV(data);
            }
            
            return data;
        } catch (error) {
            console.error('Error exporting data:', error);
            throw error;
        }
    }

    // Import data
    async importData(dataString, format = 'json') {
        try {
            let data;
            
            if (format === 'json') {
                data = JSON.parse(dataString);
            } else if (format === 'csv') {
                data = this.convertFromCSV(dataString);
            }
            
            // Validate data
            if (!data || typeof data !== 'object') {
                throw new Error('Format data tidak valid');
            }
            
            // Import data
            if (data.orders) {
                this.localDB.save('orders', data.orders);
            }
            
            if (data.materials) {
                this.localDB.save('materials', data.materials);
            }
            
            if (data.config) {
                this.localDB.save('config', data.config);
                this.sheetDB.setConfig(data.config);
            }
            
            showToast('Data berhasil diimpor', 'success');
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            showToast('Gagal mengimpor data: ' + error.message, 'error');
            throw error;
        }
    }

    // Backup data
    async backupData() {
        try {
            const backup = await this.exportData('json');
            const blob = new Blob([backup], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `nastar_backup_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            URL.revokeObjectURL(url);
            
            showToast('Backup data berhasil', 'success');
            return true;
        } catch (error) {
            console.error('Error backing up data:', error);
            showToast('Gagal membuat backup', 'error');
            throw error;
        }
    }

    // Restore data
    async restoreData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = async (e) => {
                try {
                    await this.importData(e.target.result, 'json');
                    resolve(true);
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = () => {
                reject(new Error('Gagal membaca file'));
            };
            
            reader.readAsText(file);
        });
    }

    // Convert to CSV
    convertToCSV(data) {
        let csv = '';
        
        // Convert orders
        if (data.orders && data.orders.length > 0) {
            csv += 'ORDERS\n';
            const headers = Object.keys(data.orders[0]).join(',');
            csv += headers + '\n';
            
            data.orders.forEach(order => {
                const values = Object.values(order).map(value => 
                    typeof value === 'string' ? `"${value}"` : value
                ).join(',');
                csv += values + '\n';
            });
            
            csv += '\n';
        }
        
        // Convert materials
        if (data.materials && data.materials.length > 0) {
            csv += 'MATERIALS\n';
            const headers = Object.keys(data.materials[0]).join(',');
            csv += headers + '\n';
            
            data.materials.forEach(material => {
                const values = Object.values(material).map(value => 
                    typeof value === 'string' ? `"${value}"` : value
                ).join(',');
                csv += values + '\n';
            });
        }
        
        return csv;
    }

    // Convert from CSV
    convertFromCSV(csv) {
        // Simple CSV parser (for demo purposes)
        const lines = csv.split('\n');
        const data = { orders: [], materials: [] };
        let currentSection = null;
        
        lines.forEach(line => {
            line = line.trim();
            
            if (line === 'ORDERS') {
                currentSection = 'orders';
            } else if (line === 'MATERIALS') {
                currentSection = 'materials';
            } else if (line && currentSection) {
                const values = line.split(',').map(value => 
                    value.startsWith('"') && value.endsWith('"') 
                        ? value.slice(1, -1) 
                        : isNaN(value) ? value : parseFloat(value)
                );
                
                if (data[currentSection].length === 0) {
                    // First line after header is the headers
                    data[currentSection + 'Headers'] = values;
                } else {
                    const obj = {};
                    const headers = data[currentSection + 'Headers'];
                    headers.forEach((header, index) => {
                        obj[header] = values[index];
                    });
                    data[currentSection].push(obj);
                }
            }
        });
        
        delete data.ordersHeaders;
        delete data.materialsHeaders;
        
        return data;
    }

    // Clear all data
    clearAllData() {
        return new Promise((resolve) => {
            Swal.fire({
                title: 'Hapus Semua Data?',
                text: "Tindakan ini tidak dapat dibatalkan!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Ya, Hapus!',
                cancelButtonText: 'Batal'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.localDB.clear();
                    this.syncQueue = [];
                    this.localDB.save('sync_queue', []);
                    
                    // Clear SheetDB cache
                    this.sheetDB.clearCache();
                    
                    showToast('Semua data berhasil dihapus', 'success');
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    }
}

// Create global instance
const dataSync = new DataSyncService();

// Export functions for use in main.js
window.saveOrderToAPI = async function(order) {
    return await dataSync.saveOrder(order);
};

window.updateOrderInAPI = async function(orderId, updates) {
    return await dataSync.updateOrder(orderId, updates);
};

window.deleteOrderInAPI = async function(orderId) {
    return await dataSync.deleteOrder(orderId);
};

window.saveMaterialToAPI = async function(material) {
    return await dataSync.saveMaterial(material);
};

window.backupData = async function() {
    return await dataSync.backupData();
};

window.restoreData = async function(file) {
    return await dataSync.restoreData(file);
};

window.clearAllData = async function() {
    return await dataSync.clearAllData();
};

window.getDataSyncStatus = function() {
    return {
        isOnline: dataSync.isOnline,
        syncQueueLength: dataSync.syncQueue.length,
        syncing: dataSync.syncing
    };
};

// Initialize when main.js loads
document.addEventListener('DOMContentLoaded', function() {
    // Load initial data from DataSync
    dataSync.getOrders().then(loadedOrders => {
        if (loadedOrders && loadedOrders.length > 0) {
            orders = loadedOrders;
            if (currentPage === 'dashboard') {
                updateDashboard();
            }
        }
    });
    
    dataSync.getMaterials().then(loadedMaterials => {
        if (loadedMaterials && loadedMaterials.length > 0) {
            materials = loadedMaterials;
        }
    });
});