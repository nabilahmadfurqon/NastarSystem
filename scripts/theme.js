/* =============================================
   TOKO NASTAR NOTED - THEME MANAGER
   Multiple Theme Support with Dark Mode
   ============================================= */

class ThemeManager {
    constructor() {
        this.themes = {
            default: {
                name: 'Default',
                colors: {
                    '--primary-color': '#f57c00',
                    '--primary-light': '#ffb74d',
                    '--primary-dark': '#e65100',
                    '--primary-gradient': 'linear-gradient(135deg, #f57c00 0%, #ff9800 100%)',
                    
                    '--secondary-color': '#5d4037',
                    '--secondary-light': '#8d6e63',
                    '--secondary-dark': '#3e2723',
                    
                    '--success-color': '#4caf50',
                    '--success-light': '#81c784',
                    '--success-dark': '#388e3c',
                    
                    '--warning-color': '#ff9800',
                    '--warning-light': '#ffb74d',
                    '--warning-dark': '#f57c00',
                    
                    '--danger-color': '#f44336',
                    '--danger-light': '#ef9a9a',
                    '--danger-dark': '#d32f2f',
                    
                    '--info-color': '#2196f3',
                    '--info-light': '#64b5f6',
                    '--info-dark': '#1976d2',
                    
                    '--bg-color': '#f8f9fa',
                    '--card-bg': '#ffffff',
                    '--sidebar-bg': '#ffffff',
                    '--text-primary': '#333333',
                    '--text-secondary': '#666666',
                    '--text-muted': '#999999',
                    '--border-color': '#e0e0e0',
                    '--shadow-color': 'rgba(0, 0, 0, 0.1)',
                    '--hover-color': '#f5f5f5'
                }
            },
            dark: {
                name: 'Dark Mode',
                colors: {
                    '--primary-color': '#ff9800',
                    '--primary-light': '#ffb74d',
                    '--primary-dark': '#f57c00',
                    '--primary-gradient': 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
                    
                    '--secondary-color': '#8d6e63',
                    '--secondary-light': '#a1887f',
                    '--secondary-dark': '#5d4037',
                    
                    '--success-color': '#4caf50',
                    '--success-light': '#81c784',
                    '--success-dark': '#388e3c',
                    
                    '--warning-color': '#ff9800',
                    '--warning-light': '#ffb74d',
                    '--warning-dark': '#f57c00',
                    
                    '--danger-color': '#f44336',
                    '--danger-light': '#ef9a9a',
                    '--danger-dark': '#d32f2f',
                    
                    '--info-color': '#2196f3',
                    '--info-light': '#64b5f6',
                    '--info-dark': '#1976d2',
                    
                    '--bg-color': '#121212',
                    '--card-bg': '#1e1e1e',
                    '--sidebar-bg': '#1a1a1a',
                    '--text-primary': '#ffffff',
                    '--text-secondary': '#b0b0b0',
                    '--text-muted': '#808080',
                    '--border-color': '#333333',
                    '--shadow-color': 'rgba(0, 0, 0, 0.3)',
                    '--hover-color': '#2a2a2a'
                }
            },
            premium: {
                name: 'Premium',
                colors: {
                    '--primary-color': '#9c27b0',
                    '--primary-light': '#ba68c8',
                    '--primary-dark': '#7b1fa2',
                    '--primary-gradient': 'linear-gradient(135deg, #9c27b0 0%, #673ab7 100%)',
                    
                    '--secondary-color': '#ff9800',
                    '--secondary-light': '#ffb74d',
                    '--secondary-dark': '#f57c00',
                    
                    '--success-color': '#4caf50',
                    '--success-light': '#81c784',
                    '--success-dark': '#388e3c',
                    
                    '--warning-color': '#ff9800',
                    '--warning-light': '#ffb74d',
                    '--warning-dark': '#f57c00',
                    
                    '--danger-color': '#f44336',
                    '--danger-light': '#ef9a9a',
                    '--danger-dark': '#d32f2f',
                    
                    '--info-color': '#2196f3',
                    '--info-light': '#64b5f6',
                    '--info-dark': '#1976d2',
                    
                    '--bg-color': '#f5f5f5',
                    '--card-bg': '#ffffff',
                    '--sidebar-bg': '#2c2c2c',
                    '--text-primary': '#333333',
                    '--text-secondary': '#666666',
                    '--text-muted': '#999999',
                    '--border-color': '#e0e0e0',
                    '--shadow-color': 'rgba(0, 0, 0, 0.1)',
                    '--hover-color': '#f0f0f0'
                }
            },
            modern: {
                name: 'Modern',
                colors: {
                    '--primary-color': '#2196f3',
                    '--primary-light': '#64b5f6',
                    '--primary-dark': '#1976d2',
                    '--primary-gradient': 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
                    
                    '--secondary-color': '#ff9800',
                    '--secondary-light': '#ffb74d',
                    '--secondary-dark': '#f57c00',
                    
                    '--success-color': '#4caf50',
                    '--success-light': '#81c784',
                    '--success-dark': '#388e3c',
                    
                    '--warning-color': '#ff9800',
                    '--warning-light': '#ffb74d',
                    '--warning-dark': '#f57c00',
                    
                    '--danger-color': '#f44336',
                    '--danger-light': '#ef9a9a',
                    '--danger-dark': '#d32f2f',
                    
                    '--info-color': '#2196f3',
                    '--info-light': '#64b5f6',
                    '--info-dark': '#1976d2',
                    
                    '--bg-color': '#ffffff',
                    '--card-bg': '#f8f9fa',
                    '--sidebar-bg': '#2c3e50',
                    '--text-primary': '#2c3e50',
                    '--text-secondary': '#7f8c8d',
                    '--text-muted': '#95a5a6',
                    '--border-color': '#ecf0f1',
                    '--shadow-color': 'rgba(0, 0, 0, 0.05)',
                    '--hover-color': '#f1f2f6'
                }
            },
            cozy: {
                name: 'Cozy',
                colors: {
                    '--primary-color': '#795548',
                    '--primary-light': '#a98274',
                    '--primary-dark': '#5d4037',
                    '--primary-gradient': 'linear-gradient(135deg, #795548 0%, #5d4037 100%)',
                    
                    '--secondary-color': '#ff9800',
                    '--secondary-light': '#ffb74d',
                    '--secondary-dark': '#f57c00',
                    
                    '--success-color': '#4caf50',
                    '--success-light': '#81c784',
                    '--success-dark': '#388e3c',
                    
                    '--warning-color': '#ff9800',
                    '--warning-light': '#ffb74d',
                    '--warning-dark': '#f57c00',
                    
                    '--danger-color': '#f44336',
                    '--danger-light': '#ef9a9a',
                    '--danger-dark': '#d32f2f',
                    
                    '--info-color': '#2196f3',
                    '--info-light': '#64b5f6',
                    '--info-dark': '#1976d2',
                    
                    '--bg-color': '#f9f5f0',
                    '--card-bg': '#ffffff',
                    '--sidebar-bg': '#5d4037',
                    '--text-primary': '#4e342e',
                    '--text-secondary': '#8d6e63',
                    '--text-muted': '#a1887f',
                    '--border-color': '#d7ccc8',
                    '--shadow-color': 'rgba(93, 64, 55, 0.1)',
                    '--hover-color': '#f1e8e0'
                }
            }
        };
        
        this.currentTheme = 'default';
        this.animationsEnabled = true;
        this.layoutMode = 'collapsible';
        
        this.loadSettings();
        this.initialize();
    }

    // Load settings from localStorage
    loadSettings() {
        const savedTheme = localStorage.getItem('nastarTheme');
        if (savedTheme && this.themes[savedTheme]) {
            this.currentTheme = savedTheme;
        }
        
        const savedAnimations = localStorage.getItem('nastarAnimations');
        if (savedAnimations !== null) {
            this.animationsEnabled = savedAnimations === 'true';
        }
        
        const savedLayout = localStorage.getItem('nastarLayout');
        if (savedLayout) {
            this.layoutMode = savedLayout;
        }
    }

    // Save settings to localStorage
    saveSettings() {
        localStorage.setItem('nastarTheme', this.currentTheme);
        localStorage.setItem('nastarAnimations', this.animationsEnabled);
        localStorage.setItem('nastarLayout', this.layoutMode);
    }

    // Initialize theme
    initialize() {
        this.applyTheme(this.currentTheme);
        this.applyAnimations();
        this.applyLayout();
        this.setupEventListeners();
    }

    // Apply theme
    applyTheme(themeName) {
        if (!this.themes[themeName]) {
            console.error(`Theme ${themeName} not found`);
            return;
        }

        this.currentTheme = themeName;
        const theme = this.themes[themeName];
        
        // Apply CSS variables
        Object.entries(theme.colors).forEach(([property, value]) => {
            document.documentElement.style.setProperty(property, value);
        });
        
        // Update theme toggle button
        this.updateThemeToggle();
        
        // Update theme selector
        this.updateThemeSelector();
        
        // Update charts
        this.updateChartsTheme();
        
        // Save settings
        this.saveSettings();
        
        // Show notification
        this.showThemeNotification(theme.name);
    }

    // Apply animations
    applyAnimations() {
        if (this.animationsEnabled) {
            document.body.classList.add('animations-enabled');
        } else {
            document.body.classList.remove('animations-enabled');
        }
    }

    // Apply layout
    applyLayout() {
        const sidebar = document.getElementById('sidebar');
        if (!sidebar) return;
        
        // Remove existing layout classes
        sidebar.classList.remove('fixed', 'hidden');
        
        // Apply new layout
        if (this.layoutMode === 'fixed') {
            sidebar.classList.add('fixed');
        } else if (this.layoutMode === 'hidden') {
            sidebar.classList.add('hidden');
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Theme toggle button
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
        
        // Theme selector options
        document.querySelectorAll('.theme-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const theme = e.currentTarget.getAttribute('data-theme');
                this.selectTheme(theme);
            });
        });
        
        // Animations toggle
        const animationsToggle = document.getElementById('animationsToggle');
        if (animationsToggle) {
            animationsToggle.checked = this.animationsEnabled;
            animationsToggle.addEventListener('change', (e) => {
                this.animationsEnabled = e.target.checked;
                this.applyAnimations();
                this.saveSettings();
            });
        }
        
        // Layout mode select
        const layoutModeSelect = document.getElementById('layoutMode');
        if (layoutModeSelect) {
            layoutModeSelect.value = this.layoutMode;
            layoutModeSelect.addEventListener('change', (e) => {
                this.layoutMode = e.target.value;
                this.applyLayout();
                this.saveSettings();
            });
        }
    }

    // Toggle between light/dark themes
    toggleTheme() {
        if (this.currentTheme === 'dark') {
            this.applyTheme('default');
        } else {
            this.applyTheme('dark');
        }
    }

    // Select specific theme
    selectTheme(themeName) {
        if (this.themes[themeName]) {
            this.applyTheme(themeName);
        }
    }

    // Update theme toggle button
    updateThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;
        
        const icon = themeToggle.querySelector('i');
        if (this.currentTheme === 'dark') {
            icon.className = 'fas fa-sun';
            themeToggle.title = 'Switch to Light Mode';
        } else {
            icon.className = 'fas fa-moon';
            themeToggle.title = 'Switch to Dark Mode';
        }
    }

    // Update theme selector
    updateThemeSelector() {
        document.querySelectorAll('.theme-option').forEach(option => {
            option.classList.remove('active');
            if (option.getAttribute('data-theme') === this.currentTheme) {
                option.classList.add('active');
            }
        });
    }

    // Update charts theme
    updateChartsTheme() {
        // This will be called from ChartManager
        if (window.chartManager && window.chartManager.updateChartsTheme) {
            window.chartManager.updateChartsTheme(this.currentTheme);
        }
    }

    // Show theme notification
    showThemeNotification(themeName) {
        const message = `Tema "${themeName}" berhasil diterapkan`;
        if (window.showToast) {
            showToast(message, 'success');
        }
    }

    // Get current theme info
    getCurrentTheme() {
        return {
            name: this.themes[this.currentTheme].name,
            colors: this.themes[this.currentTheme].colors,
            key: this.currentTheme
        };
    }

    // Get all available themes
    getAvailableThemes() {
        return Object.keys(this.themes).map(key => ({
            key: key,
            name: this.themes[key].name
        }));
    }

    // Set custom theme
    setCustomTheme(customColors) {
        const customTheme = {
            name: 'Custom',
            colors: customColors
        };
        
        this.themes.custom = customTheme;
        this.applyTheme('custom');
    }

    // Reset to default theme
    resetToDefault() {
        this.applyTheme('default');
        this.animationsEnabled = true;
        this.layoutMode = 'collapsible';
        this.applyAnimations();
        this.applyLayout();
        this.saveSettings();
    }

    // Export theme settings
    exportThemeSettings() {
        const settings = {
            currentTheme: this.currentTheme,
            animationsEnabled: this.animationsEnabled,
            layoutMode: this.layoutMode,
            timestamp: new Date().toISOString()
        };
        
        return JSON.stringify(settings, null, 2);
    }

    // Import theme settings
    importThemeSettings(settingsString) {
        try {
            const settings = JSON.parse(settingsString);
            
            if (settings.currentTheme && this.themes[settings.currentTheme]) {
                this.currentTheme = settings.currentTheme;
            }
            
            if (settings.animationsEnabled !== undefined) {
                this.animationsEnabled = settings.animationsEnabled;
            }
            
            if (settings.layoutMode) {
                this.layoutMode = settings.layoutMode;
            }
            
            this.applyTheme(this.currentTheme);
            this.applyAnimations();
            this.applyLayout();
            this.saveSettings();
            
            return true;
        } catch (error) {
            console.error('Error importing theme settings:', error);
            return false;
        }
    }

    // Detect system preference
    detectSystemPreference() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    // Auto theme based on system
    enableAutoTheme() {
        const systemTheme = this.detectSystemPreference();
        
        if (systemTheme === 'dark') {
            this.applyTheme('dark');
        } else {
            this.applyTheme('default');
        }
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (e.matches) {
                this.applyTheme('dark');
            } else {
                this.applyTheme('default');
            }
        });
    }

    // Add CSS animation styles
    addAnimationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .animations-enabled .menu-item {
                transition: all 0.3s ease;
            }
            
            .animations-enabled .card {
                transition: transform 0.3s ease, box-shadow 0.3s ease;
            }
            
            .animations-enabled .btn {
                transition: all 0.2s ease;
            }
            
            .animations-enabled .stat-card:hover {
                transform: translateY(-4px);
            }
            
            .animations-enabled .table-styled tr {
                transition: background-color 0.2s ease;
            }
            
            .animations-enabled .modal {
                animation: modalFadeIn 0.3s ease;
            }
            
            @keyframes modalFadeIn {
                from {
                    opacity: 0;
                    transform: translate(-50%, -48%);
                }
                to {
                    opacity: 1;
                    transform: translate(-50%, -50%);
                }
            }
            
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
            
            .pulse {
                animation: pulse 2s infinite;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            .slide-in-right {
                animation: slideInRight 0.3s ease;
            }
        `;
        
        document.head.appendChild(style);
    }

    // Add theme-specific styles
    addThemeSpecificStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Dark mode specific styles */
            [data-theme="dark"] .card {
                border: 1px solid var(--border-color);
            }
            
            [data-theme="dark"] .table-styled th {
                background: var(--hover-color);
            }
            
            [data-theme="dark"] .search-box input {
                background: var(--card-bg);
                color: var(--text-primary);
            }
            
            /* Premium theme specific styles */
            [data-theme="premium"] .sidebar {
                color: white;
            }
            
            [data-theme="premium"] .menu-item {
                color: rgba(255, 255, 255, 0.8);
            }
            
            [data-theme="premium"] .menu-item:hover,
            [data-theme="premium"] .menu-item.active {
                background: rgba(255, 255, 255, 0.1);
                color: white;
            }
            
            /* Modern theme specific styles */
            [data-theme="modern"] .sidebar {
                color: white;
            }
            
            [data-theme="modern"] .menu-item {
                color: rgba(255, 255, 255, 0.8);
            }
            
            [data-theme="modern"] .menu-item:hover,
            [data-theme="modern"] .menu-item.active {
                background: rgba(255, 255, 255, 0.1);
                color: white;
            }
            
            /* Cozy theme specific styles */
            [data-theme="cozy"] .sidebar {
                color: white;
            }
            
            [data-theme="cozy"] .menu-item {
                color: rgba(255, 255, 255, 0.8);
            }
            
            [data-theme="cozy"] .menu-item:hover,
            [data-theme="cozy"] .menu-item.active {
                background: rgba(255, 255, 255, 0.1);
                color: white;
            }
            
            /* Print styles for all themes */
            @media print {
                .sidebar,
                .top-header,
                .page-actions,
                .modal-overlay,
                .toast-container {
                    display: none !important;
                }
                
                .main-content {
                    margin-left: 0 !important;
                }
                
                .card, .table-container {
                    box-shadow: none !important;
                    border: 1px solid #000 !important;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
}

// Create global instance
const themeManager = new ThemeManager();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add animation styles
    themeManager.addAnimationStyles();
    
    // Add theme-specific styles
    themeManager.addThemeSpecificStyles();
    
    // Auto-detect system theme if no preference saved
    const savedTheme = localStorage.getItem('nastarTheme');
    if (!savedTheme) {
        // Uncomment to enable auto theme detection
        // themeManager.enableAutoTheme();
    }
});

// Export functions for use in main.js
window.toggleTheme = function() {
    themeManager.toggleTheme();
};

window.selectTheme = function(themeName) {
    themeManager.selectTheme(themeName);
};

window.applyTheme = function(themeName) {
    themeManager.applyTheme(themeName);
};

window.getCurrentTheme = function() {
    return themeManager.getCurrentTheme();
};

window.getAvailableThemes = function() {
    return themeManager.getAvailableThemes();
};

window.setCustomTheme = function(customColors) {
    themeManager.setCustomTheme(customColors);
};

window.resetToDefaultTheme = function() {
    themeManager.resetToDefault();
};

window.exportThemeSettings = function() {
    return themeManager.exportThemeSettings();
};

window.importThemeSettings = function(settingsString) {
    return themeManager.importThemeSettings(settingsString);
};

window.detectSystemTheme = function() {
    return themeManager.detectSystemPreference();
};

window.enableAutoTheme = function() {
    themeManager.enableAutoTheme();
};