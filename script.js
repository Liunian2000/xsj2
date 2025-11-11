// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 加载Bing壁纸
    loadBingWallpaper();
    
    // 更新时间显示
    updateTime();
    setInterval(updateTime, 1000);
    
    // 初始化电池状态
    initBatteryStatus();
    
    // 初始化应用点击事件
    initAppClickEvents();
    
    // 初始化快捷设置点击事件
    initQuickSettingsEvents();
    
    // 初始化搜索功能
    initSearchFunctionality();
    
    // 初始化返回按钮
    initBackButton();
    
    // 初始化网络状态
    updateNetworkStatus();
});

// 更新时间显示
function updateTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    document.getElementById('current-time').textContent = `${hours}:${minutes}`;
    
    // 更新大号时间显示
    updateBigTimeDisplay();
}

// 更新大号时间显示
function updateBigTimeDisplay() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    
    // 更新时间显示 - 24小时制
    document.getElementById('time-hours').textContent = hours;
    document.getElementById('time-minutes').textContent = minutes;
    
    // 更新日期显示
    updateDateDisplay();
}

// 更新日期显示
function updateDateDisplay() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // 月份从0开始，需要+1
    const day = now.getDate();
    const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const weekDay = weekDays[now.getDay()];
    
    document.getElementById('date-display').textContent = `${year}年${month}月${day}日 ${weekDay}`;
}

// 加载Bing壁纸
function loadBingWallpaper() {
    // 显示加载动画
    showWallpaperLoading();
    
    // 使用Bing壁纸API获取今日壁纸
    // 使用国内CDN加速的API地址
    fetch('https://api.xsot.cn/bing?resolution=1920&format=json&index=0&mkt=zh-CN')
        .then(response => {
            if (!response.ok) {
                throw new Error('网络请求失败');
            }
            return response.json();
        })
        .then(data => {
            const wallpaperUrl = data.images[0].url;
            const fullWallpaperUrl = wallpaperUrl.startsWith('http') 
                ? wallpaperUrl 
                : `https://www.bing.com${wallpaperUrl}`;
            
            // 预加载壁纸
            preloadWallpaper(fullWallpaperUrl)
                .then(() => {
                    const wallpaperElement = document.getElementById('wallpaper');
                    wallpaperElement.style.backgroundImage = `url(${fullWallpaperUrl})`;
                    
                    // 保存壁纸信息
                    localStorage.setItem('currentWallpaper', fullWallpaperUrl);
                    localStorage.setItem('wallpaperTitle', data.images[0].title);
                    localStorage.setItem('wallpaperDate', data.images[0].startdate);
                    
                    // 隐藏加载动画
                    hideWallpaperLoading();
                })
                .catch(error => {
                    console.error('壁纸预加载失败:', error);
                    // 即使预加载失败，也尝试设置壁纸
                    const wallpaperElement = document.getElementById('wallpaper');
                    wallpaperElement.style.backgroundImage = `url(${fullWallpaperUrl})`;
                    hideWallpaperLoading();
                });
        })
        .catch(error => {
            console.error('加载Bing壁纸失败:', error);
            // 使用备用壁纸
            loadFallbackWallpaper();
            hideWallpaperLoading();
        });
}

// 预加载壁纸
function preloadWallpaper(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('图片加载失败'));
    });
}

// 显示壁纸加载动画
function showWallpaperLoading() {
    const wallpaperContainer = document.getElementById('wallpaper');
    if (!document.querySelector('.wallpaper-loading')) {
        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'wallpaper-loading';
        wallpaperContainer.appendChild(loadingIndicator);
    }
}

// 隐藏壁纸加载动画
function hideWallpaperLoading() {
    const loadingIndicator = document.querySelector('.wallpaper-loading');
    if (loadingIndicator) {
        loadingIndicator.remove();
    }
}

// 加载备用壁纸
function loadFallbackWallpaper() {
    const savedWallpaper = localStorage.getItem('currentWallpaper');
    if (savedWallpaper) {
        const wallpaperElement = document.getElementById('wallpaper');
        wallpaperElement.style.backgroundImage = `url(${savedWallpaper})`;
    } else {
        // 使用默认渐变背景
        const wallpaperElement = document.getElementById('wallpaper');
        wallpaperElement.style.background = 'linear-gradient(135deg, #1a237e, #0d47a1, #01579b)';
    }
}

// 初始化电池状态
function initBatteryStatus() {
    // 检查浏览器是否支持Battery API
    if ('getBattery' in navigator) {
        navigator.getBattery().then(battery => {
            // 初始更新
            updateBatteryInfo(battery);
            
            // 监听电池状态变化
            battery.addEventListener('levelchange', () => updateBatteryInfo(battery));
            battery.addEventListener('chargingchange', () => updateBatteryInfo(battery));
        }).catch(error => {
            console.error('电池API不可用:', error);
            // 使用模拟电池状态
            updateBatteryStatus();
        });
    } else {
        // 浏览器不支持Battery API，使用模拟电池状态
        console.log('浏览器不支持Battery API，使用模拟电池状态');
        updateBatteryStatus();
    }
}

// 更新电池信息
function updateBatteryInfo(battery) {
    const batteryLevel = Math.round(battery.level * 100);
    const batteryPercentage = document.getElementById('battery-percentage');
    const batteryLevelElement = document.querySelector('.battery-level');
    
    // 更新百分比显示
    batteryPercentage.textContent = `${batteryLevel}%`;
    
    // 更新电池图标
    batteryLevelElement.style.width = `${batteryLevel}%`;
    
    // 根据电量设置颜色
    if (batteryLevel > 50) {
        batteryLevelElement.style.backgroundColor = '#4CAF50';
    } else if (batteryLevel > 20) {
        batteryLevelElement.style.backgroundColor = '#FFC107';
    } else {
        batteryLevelElement.style.backgroundColor = '#F44336';
    }
    
    // 如果正在充电，显示充电状态
    if (battery.charging) {
        batteryLevelElement.style.backgroundColor = '#03A9F4';
        // 可以添加充电图标
    }
}

// 初始化应用点击事件
function initAppClickEvents() {
    const appItems = document.querySelectorAll('.app-item');
    const appOverlay = document.getElementById('app-overlay');
    const appTitle = document.querySelector('.app-title');
    
    appItems.forEach(item => {
        item.addEventListener('click', function() {
            const appName = this.getAttribute('data-app-name');
            appTitle.textContent = appName;
            appOverlay.style.display = 'flex';
            
            // 模拟应用加载
            setTimeout(() => {
                const appContent = document.querySelector('.app-content');
                appContent.innerHTML = `<p>${appName} 应用正在运行中...</p>`;
            }, 500);
        });
    });
}

// 初始化快捷设置点击事件
function initQuickSettingsEvents() {
    const qsItems = document.querySelectorAll('.qs-item');
    
    qsItems.forEach(item => {
        item.addEventListener('click', function() {
            const qsName = this.querySelector('span').textContent;
            toggleQuickSetting(qsName, this);
        });
    });
}

// 切换快捷设置状态
function toggleQuickSetting(qsName, element) {
    const qsIcon = element.querySelector('.qs-icon');
    const isActive = qsIcon.style.opacity === '1';
    
    if (isActive) {
        qsIcon.style.opacity = '0.5';
        showNotification(`${qsName} 已关闭`);
    } else {
        qsIcon.style.opacity = '1';
        showNotification(`${qsName} 已开启`);
    }
}

// 初始化搜索功能
function initSearchFunctionality() {
    const searchInput = document.querySelector('.search-box input');
    
    searchInput.addEventListener('focus', function() {
        this.placeholder = '输入搜索内容...';
    });
    
    searchInput.addEventListener('blur', function() {
        this.placeholder = '搜索应用、联系人或设置';
    });
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const searchTerm = this.value.trim();
            if (searchTerm) {
                performSearch(searchTerm);
            }
        }
    });
}

// 执行搜索
function performSearch(searchTerm) {
    const appOverlay = document.getElementById('app-overlay');
    const appTitle = document.querySelector('.app-title');
    const appContent = document.querySelector('.app-content');
    
    appTitle.textContent = '搜索结果';
    appContent.innerHTML = `<p>正在搜索 "${searchTerm}"...</p>`;
    appOverlay.style.display = 'flex';
    
    // 模拟搜索延迟
    setTimeout(() => {
        appContent.innerHTML = `
            <div style="width: 80%; max-width: 400px;">
                <h3 style="margin-bottom: 15px; color: #ffffff;">搜索结果</h3>
                <p style="margin-bottom: 10px;">找到与 "${searchTerm}" 相关的内容:</p>
                <ul style="list-style-type: none; padding: 0;">
                    <li style="padding: 10px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">应用: ${searchTerm}</li>
                    <li style="padding: 10px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">联系人: ${searchTerm}</li>
                    <li style="padding: 10px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">设置: ${searchTerm}</li>
                </ul>
            </div>
        `;
    }, 500);
    
    // 清空搜索框
    document.querySelector('.search-box input').value = '';
}

// 初始化返回按钮
function initBackButton() {
    const backButton = document.querySelector('.app-back-btn');
    const appOverlay = document.getElementById('app-overlay');
    
    backButton.addEventListener('click', function() {
        appOverlay.style.display = 'none';
    });
}

// 更新电池状态（模拟）
function updateBatteryStatus() {
    // 模拟电池状态
    const batteryLevel = document.querySelector('.battery-level');
    const batteryPercentage = document.getElementById('battery-percentage');
    const level = 75; // 模拟75%电量
    
    batteryPercentage.textContent = `${level}%`;
    batteryLevel.style.width = `${level}%`;
    
    // 根据电量设置颜色
    if (level > 50) {
        batteryLevel.style.backgroundColor = '#4CAF50';
    } else if (level > 20) {
        batteryLevel.style.backgroundColor = '#FFC107';
    } else {
        batteryLevel.style.backgroundColor = '#F44336';
    }
}

// 更新网络状态
function updateNetworkStatus() {
    // 模拟网络状态
    const signalIndicator = document.querySelector('.signal-indicator');
    const wifiIndicator = document.querySelector('.wifi-indicator');
    
    // 设置为有信号和有WiFi状态
    signalIndicator.style.opacity = '1';
    wifiIndicator.style.opacity = '1';
}

// 显示通知
function showNotification(message) {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.top = '40px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    notification.style.color = '#ffffff';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '20px';
    notification.style.fontSize = '14px';
    notification.style.zIndex = '3000';
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.3s ease';
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // 显示通知
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 10);
    
    // 3秒后隐藏通知
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// 添加触摸滑动支持
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 100;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // 向左滑动
            console.log('向左滑动');
        } else {
            // 向右滑动
            console.log('向右滑动');
        }
    }
}

// 添加长按支持
let longPressTimer;
const appItems = document.querySelectorAll('.app-item');

appItems.forEach(item => {
    item.addEventListener('touchstart', function(e) {
        longPressTimer = setTimeout(() => {
            // 长按事件
            showAppOptions(this.getAttribute('data-app-name'));
        }, 500);
    });
    
    item.addEventListener('touchend', function() {
        clearTimeout(longPressTimer);
    });
    
    item.addEventListener('touchmove', function() {
        clearTimeout(longPressTimer);
    });
});

// 显示应用选项
function showAppOptions(appName) {
    const appOverlay = document.getElementById('app-overlay');
    const appTitle = document.querySelector('.app-title');
    const appContent = document.querySelector('.app-content');
    
    appTitle.textContent = appName;
    appContent.innerHTML = `
        <div style="width: 80%; max-width: 400px;">
            <h3 style="margin-bottom: 15px; color: #ffffff;">应用选项</h3>
            <div style="display: flex; flex-direction: column; gap: 10px;">
                <button style="padding: 12px; background-color: rgba(255, 255, 255, 0.1); border: none; border-radius: 8px; color: white; cursor: pointer;">打开</button>
                <button style="padding: 12px; background-color: rgba(255, 255, 255, 0.1); border: none; border-radius: 8px; color: white; cursor: pointer;">应用信息</button>
                <button style="padding: 12px; background-color: rgba(255, 255, 255, 0.1); border: none; border-radius: 8px; color: white; cursor: pointer;">卸载</button>
            </div>
        </div>
    `;
    appOverlay.style.display = 'flex';
}

// 添加屏幕方向变化监听
window.addEventListener('orientationchange', function() {
    // 重新计算布局
    setTimeout(() => {
        // 可以在这里添加屏幕方向变化后的处理逻辑
        console.log('屏幕方向已改变');
    }, 100);
});

// 添加页面可见性变化监听
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // 页面不可见时暂停某些操作
        console.log('页面已隐藏');
    } else {
        // 页面可见时恢复操作
        console.log('页面已显示');
        updateTime();
    }
});