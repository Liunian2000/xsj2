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
    
    // 初始化搜索功能
    initSearchFunctionality();
    
    // 初始化返回按钮
    initBackButton();
    
    // 初始化网络状态
    updateNetworkStatus();
    
    // 初始化联系人数据
    initContactsData();
});

// 联系人数据结构
const ContactModel = {
    id: '',
    name: '',
    description: '',
    temperature: 1.5,
    avatar: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
};

// 初始化联系人数据
function initContactsData() {
    // 检查本地存储中是否有联系人数据
    if (!localStorage.getItem('contacts')) {
        // 如果没有，初始化一个空数组
        localStorage.setItem('contacts', JSON.stringify([]));
    }
}

// 获取所有联系人
function getAllContacts() {
    const contacts = localStorage.getItem('contacts');
    return contacts ? JSON.parse(contacts) : [];
}

// 根据ID获取联系人
function getContactById(id) {
    const contacts = getAllContacts();
    return contacts.find(contact => contact.id === id);
}

// 添加新联系人
function addContact(contact) {
    const contacts = getAllContacts();
    
    // 生成唯一ID
    const newContact = {
        ...ContactModel,
        ...contact,
        id: generateId()
    };
    
    contacts.push(newContact);
    localStorage.setItem('contacts', JSON.stringify(contacts));
    
    return newContact;
}

// 更新联系人
function updateContact(id, updatedContact) {
    const contacts = getAllContacts();
    const index = contacts.findIndex(contact => contact.id === id);
    
    if (index !== -1) {
        contacts[index] = {
            ...contacts[index],
            ...updatedContact,
            updatedAt: new Date().toISOString()
        };
        
        localStorage.setItem('contacts', JSON.stringify(contacts));
        return contacts[index];
    }
    
    return null;
}

// 删除联系人
function deleteContact(id) {
    const contacts = getAllContacts();
    const filteredContacts = contacts.filter(contact => contact.id !== id);
    
    localStorage.setItem('contacts', JSON.stringify(filteredContacts));
    return true;
}

// 生成唯一ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// 保存图片到本地存储
function saveImageToLocalStorage(base64Data) {
    // 生成唯一键名
    const key = 'img_' + generateId();
    
    // 保存图片数据
    localStorage.setItem(key, base64Data);
    
    return key;
}

// 从本地存储获取图片
function getImageFromLocalStorage(key) {
    return localStorage.getItem(key);
}

// 从本地存储删除图片
function deleteImageFromLocalStorage(key) {
    localStorage.removeItem(key);
}

// 根据应用名称加载不同的应用内容
function loadAppContent(appName) {
    const appContent = document.querySelector('.app-content');
    
    if (!appContent) {
        console.error('应用内容区域未找到');
        return;
    }
    
    switch(appName) {
        case '联系人':
            loadContactsApp();
            break;
        case '日记':
            loadDiaryApp();
            break;
        case '聊天':
            loadChatApp();
            break;
        case '朋友圈':
            loadMomentsApp();
            break;
        case '记忆':
            loadMemoryApp();
            break;
        case '钱包':
            loadWalletApp();
            break;
        case '商城':
            loadStoreApp();
            break;
        case '设置':
            loadSettingsApp();
            break;
        default:
            appContent.innerHTML = `<p>${appName} 应用正在运行中...</p>`;
            break;
    }
}

// 加载联系人应用
function loadContactsApp() {
    const appContent = document.querySelector('.app-content');
    
    // 在导航栏添加按钮
    const appHeader = document.querySelector('.app-header');
    
    // 清除旧的按钮
    const existingBtn = appHeader.querySelector('.header-add-btn');
    if (existingBtn) {
        existingBtn.remove();
    }
    
    // 添加新的添加按钮到导航栏
    const addButton = document.createElement('button');
    addButton.className = 'header-add-btn';
    addButton.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M5 12H19" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
        </svg>
    `;
    addButton.style.cssText = `
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background-color: #2196F3;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
        margin-left: auto;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    `;
    
    appHeader.appendChild(addButton);
    
    // 添加事件监听器
    addButton.addEventListener('click', showAddContactForm);
    
    // 获取所有联系人
    const contacts = getAllContacts();
    
    // 生成联系人列表HTML
    let contactsListHTML = '';
    
    if (contacts.length === 0) {
        contactsListHTML = `
            <div class="empty-contacts">
                <div class="empty-icon">👥</div>
                <p>暂无联系人</p>
                <p>点击右上角 + 添加第一个联系人</p>
            </div>
        `;
    } else {
        contactsListHTML = contacts.map(contact => `
            <div class="contact-item" data-id="${contact.id}">
                <div class="contact-avatar">
                    ${contact.avatar ? 
                        `<img src="${getImageFromLocalStorage(contact.avatar)}" alt="${contact.name}">` : 
                        `<div class="default-avatar">${contact.name.charAt(0).toUpperCase()}</div>`
                    }
                </div>
                <div class="contact-info">
                    <div class="contact-name">${contact.name}</div>
                    <div class="contact-description">${contact.description || '暂无描述'}</div>
                    ${contact.temperature !== undefined ? `<div class="contact-temperature">🌡️ ${contact.temperature.toFixed(2)}</div>` : ''}
                </div>
                <div class="contact-arrow">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 18L15 12L9 6" stroke="#999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
            </div>
        `).join('');
    }
    
    appContent.innerHTML = `
        <div class="contacts-app">
            <div class="contacts-list">
                ${contactsListHTML}
            </div>
        </div>
    `;
    
    // 为每个联系人项添加点击事件
    document.querySelectorAll('.contact-item').forEach(item => {
        item.addEventListener('click', function() {
            const contactId = this.getAttribute('data-id');
            showContactDetails(contactId);
        });
    });
}

// 加载日记应用
function loadDiaryApp() {
    const appContent = document.querySelector('.app-content');
    
    // 在导航栏添加按钮
    const appHeader = document.querySelector('.app-header');
    
    // 清除旧的按钮
    const existingBtn = appHeader.querySelector('.header-add-btn');
    if (existingBtn) {
        existingBtn.remove();
    }
    
    // 添加新的添加按钮到导航栏
    const addButton = document.createElement('button');
    addButton.className = 'header-add-btn';
    addButton.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M5 12H19" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
        </svg>
    `;
    addButton.style.cssText = `
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background-color: #8BC34A;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
        margin-left: auto;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    `;
    
    appHeader.appendChild(addButton);
    
    // 添加事件监听器
    addButton.addEventListener('click', showAddDiaryForm);
    
    // 获取所有日记
    const diaries = getAllDiaries();
    
    // 生成日记列表HTML
    let diariesListHTML = '';
    
    if (diaries.length === 0) {
        diariesListHTML = `
            <div class="empty-diaries">
                <div class="empty-icon">📔</div>
                <p>暂无日记</p>
                <p>点击右上角 + 撰写第一篇日记</p>
            </div>
        `;
    } else {
        // 按日期倒序排列
        diaries.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        diariesListHTML = diaries.map(diary => `
            <div class="diary-item" data-id="${diary.id}">
                <div class="diary-date">${formatDate(diary.date)}</div>
                <div class="diary-title">${diary.title}</div>
                <div class="diary-content">${diary.content.substring(0, 100)}${diary.content.length > 100 ? '...' : ''}</div>
                <div class="diary-mood">心情: ${getMoodEmoji(diary.mood)} ${diary.mood}</div>
            </div>
        `).join('');
    }
    
    appContent.innerHTML = `
        <div class="diary-app">
            <div class="diaries-list">
                ${diariesListHTML}
            </div>
        </div>
    `;
    
    // 为每个日记项添加点击事件
    document.querySelectorAll('.diary-item').forEach(item => {
        item.addEventListener('click', function() {
            const diaryId = this.getAttribute('data-id');
            showDiaryDetails(diaryId);
        });
    });
}

// 日记相关函数
// 获取所有日记
function getAllDiaries() {
    const diaries = localStorage.getItem('diaries');
    return diaries ? JSON.parse(diaries) : [];
}

// 保存日记到本地存储
function saveDiaries(diaries) {
    localStorage.setItem('diaries', JSON.stringify(diaries));
}

// 获取心情表情
function getMoodEmoji(mood) {
    const moodEmojis = {
        '开心': '😊',
        '快乐': '😄',
        '平静': '😌',
        '忧郁': '😔',
        '悲伤': '😢',
        '愤怒': '😠',
        '焦虑': '😰',
        '兴奋': '🤩',
        '疲惫': '😴',
        '感激': '🙏'
    };
    return moodEmojis[mood] || '😐';
}

// 格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const weekDay = weekDays[date.getDay()];
    
    return `${year}年${month}月${day}日 ${weekDay}`;
}

// 显示添加日记表单
function showAddDiaryForm() {
    const appContent = document.querySelector('.app-content');
    
    appContent.innerHTML = `
        <div class="diary-form-container">
            <div class="diary-form">
                <h2>写日记</h2>
                <div class="form-group">
                    <label for="diary-title">标题</label>
                    <input type="text" id="diary-title" placeholder="给今天起个标题..." maxlength="50">
                </div>
                <div class="form-group">
                    <label for="diary-date">日期</label>
                    <input type="date" id="diary-date">
                </div>
                <div class="form-group">
                    <label for="diary-mood">心情</label>
                    <select id="diary-mood">
                        <option value="开心">开心 😊</option>
                        <option value="快乐">快乐 😄</option>
                        <option value="平静">平静 😌</option>
                        <option value="忧郁">忧郁 😔</option>
                        <option value="悲伤">悲伤 😢</option>
                        <option value="愤怒">愤怒 😠</option>
                        <option value="焦虑">焦虑 😰</option>
                        <option value="兴奋">兴奋 🤩</option>
                        <option value="疲惫">疲惫 😴</option>
                        <option value="感激">感激 🙏</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="diary-content">内容</label>
                    <textarea id="diary-content" placeholder="记录今天的心情、想法和经历..." rows="12"></textarea>
                </div>
                <div class="form-actions">
                    <button id="save-diary-btn" class="save-btn">保存</button>
                    <button id="cancel-diary-btn" class="cancel-btn">取消</button>
                </div>
            </div>
        </div>
    `;
    
    // 设置默认日期为今天
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('diary-date').value = today;
    
    // 添加事件监听器
    document.getElementById('save-diary-btn').addEventListener('click', saveNewDiary);
    document.getElementById('cancel-diary-btn').addEventListener('click', () => {
        loadDiaryApp();
    });
}

// 保存新日记
function saveNewDiary() {
    const title = document.getElementById('diary-title').value.trim();
    const date = document.getElementById('diary-date').value;
    const mood = document.getElementById('diary-mood').value;
    const content = document.getElementById('diary-content').value.trim();
    
    // 验证输入
    if (!title) {
        showToast('请输入日记标题');
        return;
    }
    
    if (!date) {
        showToast('请选择日期');
        return;
    }
    
    if (!content) {
        showToast('请输入日记内容');
        return;
    }
    
    // 创建新日记
    const newDiary = {
        id: Date.now().toString(),
        title,
        date,
        mood,
        content,
        createdAt: new Date().toISOString()
    };
    
    // 获取现有日记并添加新日记
    const diaries = getAllDiaries();
    diaries.push(newDiary);
    
    // 保存到本地存储
    saveDiaries(diaries);
    
    // 显示成功提示
    showToast('日记保存成功');
    
    // 返回日记列表
    loadDiaryApp();
}

// 显示日记详情
function showDiaryDetails(diaryId) {
    const diaries = getAllDiaries();
    const diary = diaries.find(d => d.id === diaryId);
    
    if (!diary) {
        showToast('日记不存在');
        return;
    }
    
    const appContent = document.querySelector('.app-content');
    
    appContent.innerHTML = `
        <div class="diary-details-container">
            <div class="diary-details">
                <h2>${diary.title}</h2>
                <div class="diary-meta">
                    <div class="diary-date">${formatDate(diary.date)}</div>
                    <div class="diary-mood">心情: ${getMoodEmoji(diary.mood)} ${diary.mood}</div>
                </div>
                <div class="diary-content-full">
                    ${diary.content.replace(/\n/g, '<br>')}
                </div>
                <div class="diary-actions">
                    <button id="edit-diary-btn" class="edit-btn">编辑</button>
                    <button id="delete-diary-btn" class="delete-btn">删除</button>
                    <button id="back-diary-btn" class="back-btn">返回</button>
                </div>
            </div>
        </div>
    `;
    
    // 添加事件监听器
    document.getElementById('edit-diary-btn').addEventListener('click', () => {
        showEditDiaryForm(diaryId);
    });
    
    document.getElementById('delete-diary-btn').addEventListener('click', () => {
        if (confirm('确定要删除这篇日记吗？')) {
            deleteDiary(diaryId);
        }
    });
    
    document.getElementById('back-diary-btn').addEventListener('click', () => {
        loadDiaryApp();
    });
}

// 显示编辑日记表单
function showEditDiaryForm(diaryId) {
    const diaries = getAllDiaries();
    const diary = diaries.find(d => d.id === diaryId);
    
    if (!diary) {
        showToast('日记不存在');
        return;
    }
    
    const appContent = document.querySelector('.app-content');
    
    appContent.innerHTML = `
        <div class="diary-form-container">
            <div class="diary-form">
                <h2>编辑日记</h2>
                <div class="form-group">
                    <label for="diary-title">标题</label>
                    <input type="text" id="diary-title" value="${diary.title}" maxlength="50">
                </div>
                <div class="form-group">
                    <label for="diary-date">日期</label>
                    <input type="date" id="diary-date" value="${diary.date}">
                </div>
                <div class="form-group">
                    <label for="diary-mood">心情</label>
                    <select id="diary-mood">
                        <option value="开心" ${diary.mood === '开心' ? 'selected' : ''}>开心 😊</option>
                        <option value="快乐" ${diary.mood === '快乐' ? 'selected' : ''}>快乐 😄</option>
                        <option value="平静" ${diary.mood === '平静' ? 'selected' : ''}>平静 😌</option>
                        <option value="忧郁" ${diary.mood === '忧郁' ? 'selected' : ''}>忧郁 😔</option>
                        <option value="悲伤" ${diary.mood === '悲伤' ? 'selected' : ''}>悲伤 😢</option>
                        <option value="愤怒" ${diary.mood === '愤怒' ? 'selected' : ''}>愤怒 😠</option>
                        <option value="焦虑" ${diary.mood === '焦虑' ? 'selected' : ''}>焦虑 😰</option>
                        <option value="兴奋" ${diary.mood === '兴奋' ? 'selected' : ''}>兴奋 🤩</option>
                        <option value="疲惫" ${diary.mood === '疲惫' ? 'selected' : ''}>疲惫 😴</option>
                        <option value="感激" ${diary.mood === '感激' ? 'selected' : ''}>感激 🙏</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="diary-content">内容</label>
                    <textarea id="diary-content" rows="12">${diary.content}</textarea>
                </div>
                <div class="form-actions">
                    <button id="save-diary-btn" class="save-btn">保存</button>
                    <button id="cancel-diary-btn" class="cancel-btn">取消</button>
                </div>
            </div>
        </div>
    `;
    
    // 添加事件监听器
    document.getElementById('save-diary-btn').addEventListener('click', () => {
        saveDiaryChanges(diaryId);
    });
    
    document.getElementById('cancel-diary-btn').addEventListener('click', () => {
        showDiaryDetails(diaryId);
    });
}

// 保存日记修改
function saveDiaryChanges(diaryId) {
    const title = document.getElementById('diary-title').value.trim();
    const date = document.getElementById('diary-date').value;
    const mood = document.getElementById('diary-mood').value;
    const content = document.getElementById('diary-content').value.trim();
    
    // 验证输入
    if (!title) {
        showToast('请输入日记标题');
        return;
    }
    
    if (!date) {
        showToast('请选择日期');
        return;
    }
    
    if (!content) {
        showToast('请输入日记内容');
        return;
    }
    
    // 获取所有日记
    const diaries = getAllDiaries();
    
    // 找到要修改的日记
    const diaryIndex = diaries.findIndex(d => d.id === diaryId);
    
    if (diaryIndex === -1) {
        showToast('日记不存在');
        return;
    }
    
    // 更新日记
    diaries[diaryIndex] = {
        ...diaries[diaryIndex],
        title,
        date,
        mood,
        content,
        updatedAt: new Date().toISOString()
    };
    
    // 保存到本地存储
    saveDiaries(diaries);
    
    // 显示成功提示
    showToast('日记修改成功');
    
    // 返回日记详情
    showDiaryDetails(diaryId);
}

// 删除日记
function deleteDiary(diaryId) {
    // 获取所有日记
    const diaries = getAllDiaries();
    
    // 过滤掉要删除的日记
    const updatedDiaries = diaries.filter(d => d.id !== diaryId);
    
    // 保存到本地存储
    saveDiaries(updatedDiaries);
    
    // 显示成功提示
    showToast('日记已删除');
    
    // 返回日记列表
    loadDiaryApp();
}

// 加载聊天应用
function loadChatApp() {
    const appContent = document.querySelector('.app-content');
    
    // 添加全屏显示类
    appContent.classList.add('chat-fullscreen');
    
    // 获取所有联系人
    const contacts = getAllContacts();
    
    if (contacts.length === 0) {
        appContent.innerHTML = `
            <div class="chat-app">
                <div class="chat-placeholder">
                    <div class="chat-icon-placeholder">💬</div>
                    <h3>聊天应用</h3>
                    <p>暂无联系人</p>
                    <p>请先在联系人应用中添加联系人</p>
                </div>
            </div>
        `;
        return;
    }
    
    // 渲染联系人列表
    let contactsListHTML = contacts.map(contact => `
        <div class="chat-contact-item" data-id="${contact.id}" data-name="${contact.name}" data-temperature="${contact.temperature || 1.5}">
            <div class="chat-contact-avatar">
                ${contact.avatar ? 
                    `<img src="${getImageFromLocalStorage(contact.avatar)}" alt="${contact.name}">` : 
                    `<div class="default-avatar">${contact.name.charAt(0).toUpperCase()}</div>`
                }
            </div>
            <div class="chat-contact-info">
                <div class="chat-contact-name">${contact.name}</div>
                <div class="chat-contact-description">${contact.description || '暂无描述'}</div>
                ${contact.temperature !== undefined ? `<div class="chat-contact-temperature">🌡️ ${contact.temperature.toFixed(2)}</div>` : ''}
            </div>
            <div class="chat-contact-arrow">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 18L15 12L9 6" stroke="#999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
        </div>
    `).join('');
    
    appContent.innerHTML = `
        <div class="chat-app">
            <div class="chat-contacts-list">
                ${contactsListHTML}
            </div>
        </div>
    `;
    
    // 为每个联系人项添加点击事件
    document.querySelectorAll('.chat-contact-item').forEach(item => {
        item.addEventListener('click', function() {
            const contactId = this.getAttribute('data-id');
            const contactName = this.getAttribute('data-name');
            const contactTemperature = parseFloat(this.getAttribute('data-temperature'));
            openChatWindow(contactId, contactName, contactTemperature);
        });
    });
}

// 打开聊天窗口
function openChatWindow(contactId, contactName, contactTemperature) {
    const appContent = document.querySelector('.app-content');
    
    // 添加全屏显示类
    appContent.classList.add('chat-fullscreen');
    
    // 获取联系人信息
    const contact = getContactById(contactId);
    
    appContent.innerHTML = `
        <div class="chat-window">
            <div class="chat-header">
                <div class="chat-back-btn" onclick="loadChatApp()">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 18L9 12L15 6" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <div class="chat-contact-info-header">
                    <div class="chat-avatar-header">
                        ${contact.avatar ? 
                            `<img src="${getImageFromLocalStorage(contact.avatar)}" alt="${contact.name}">` : 
                            `<div class="default-avatar-small">${contact.name.charAt(0).toUpperCase()}</div>`
                        }
                    </div>
                    <div class="chat-name-header">${contactName}</div>
                </div>
                <div class="chat-temperature-header">🌡️ ${contactTemperature.toFixed(2)}</div>
            </div>
            
            <div class="chat-messages" id="chat-messages">
                <!-- 聊天消息将在这里显示 -->
            </div>
            
            <div class="chat-input-container">
                <textarea id="chat-input" placeholder="输入消息..." rows="1"></textarea>
                <button id="send-message-btn">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>
        </div>
    `;
    
    // 添加发送消息事件
    document.getElementById('send-message-btn').addEventListener('click', () => sendMessage(contactId, contactName, contactTemperature));
    document.getElementById('chat-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(contactId, contactName, contactTemperature);
        }
    });
    
    // 加载聊天记录
    loadChatMessages(contactId);
}

// 发送消息
function sendMessage(contactId, contactName, contactTemperature) {
    const chatInput = document.getElementById('chat-input');
    const messageText = chatInput.value.trim();
    
    if (!messageText) return;
    
    const chatMessages = document.getElementById('chat-messages');
    
    // 添加用户消息
    const userMessage = document.createElement('div');
    userMessage.className = 'message user-message';
    userMessage.innerHTML = `
        <div class="message-content">${messageText}</div>
        <div class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
    `;
    chatMessages.appendChild(userMessage);
    
    // 清空输入框
    chatInput.value = '';
    
    // 模拟AI回复
    setTimeout(() => {
        const aiMessage = document.createElement('div');
        aiMessage.className = 'message ai-message';
        aiMessage.innerHTML = `
            <div class="message-content">这是来自${contactName}的回复。温度设置为${contactTemperature.toFixed(2)}。</div>
            <div class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
        `;
        chatMessages.appendChild(aiMessage);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 1000);
    
    // 滚动到底部
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// 加载聊天记录
function loadChatMessages(contactId) {
    // 这里可以从本地存储加载聊天记录
    // 目前显示一个示例消息
    const chatMessages = document.getElementById('chat-messages');
    
    // 添加欢迎消息
    const welcomeMessage = document.createElement('div');
    welcomeMessage.className = 'message ai-message';
    welcomeMessage.innerHTML = `
        <div class="message-content">你好！我是AI助手，有什么可以帮助你的吗？</div>
        <div class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
    `;
    chatMessages.appendChild(welcomeMessage);
}

// 加载朋友圈应用
function loadMomentsApp() {
    const appContent = document.querySelector('.app-content');
    appContent.innerHTML = `
        <div class="moments-app">
            <div class="moments-placeholder">
                <div class="moments-icon-placeholder">⭐</div>
                <h3>朋友圈</h3>
                <p>查看朋友们的动态</p>
            </div>
        </div>
    `;
}

// 加载记忆应用
function loadMemoryApp() {
    const appContent = document.querySelector('.app-content');
    appContent.innerHTML = `
        <div class="memory-app">
            <div class="memory-placeholder">
                <div class="memory-icon-placeholder">🧠</div>
                <h3>记忆</h3>
                <p>保存重要时刻</p>
            </div>
        </div>
    `;
}

// 加载钱包应用
function loadWalletApp() {
    const appContent = document.querySelector('.app-content');
    appContent.innerHTML = `
        <div class="wallet-app">
            <div class="wallet-placeholder">
                <div class="wallet-icon-placeholder">💳</div>
                <h3>钱包</h3>
                <p>管理您的财务</p>
            </div>
        </div>
    `;
}

// 加载商城应用
function loadStoreApp() {
    const appContent = document.querySelector('.app-content');
    appContent.innerHTML = `
        <div class="store-app">
            <div class="store-placeholder">
                <div class="store-icon-placeholder">🛒</div>
                <h3>商城</h3>
                <p>浏览精选商品</p>
            </div>
        </div>
    `;
}

// 加载设置应用
function loadSettingsApp() {
    const appContent = document.querySelector('.app-content');
    appContent.innerHTML = `
        <div class="settings-app">
            <div class="settings-placeholder">
                <div class="settings-icon-placeholder">⚙️</div>
                <h3>设置</h3>
                <p>自定义您的体验</p>
            </div>
        </div>
    `;
}

// 显示添加联系人表单
function showAddContactForm() {
    const appContent = document.querySelector('.app-content');
    
    appContent.innerHTML = `
        <div class="contact-form">
            <div class="form-header">
                <h2>添加联系人</h2>
            </div>
            <div class="form-content">
                <div class="avatar-upload-section">
                    <div class="avatar-preview" id="avatar-preview">
                        <div class="default-avatar-large">👤</div>
                    </div>
                    <label for="avatar-upload" class="avatar-upload-btn">
                        <span>选择头像</span>
                        <input type="file" id="avatar-upload" accept="image/*" style="display: none;">
                    </label>
                </div>
                
                <div class="form-group">
                    <label for="contact-name">角色名</label>
                    <input type="text" id="contact-name" placeholder="请输入角色名" required>
                </div>
                
                <div class="form-group">
                    <label for="contact-description">人设信息</label>
                    <textarea id="contact-description" placeholder="请输入人设信息" rows="4"></textarea>
                </div>
                
                <div class="form-group">
                    <label for="contact-temperature">温度</label>
                    <input type="number" id="contact-temperature" min="0" max="2" step="0.01" placeholder="0.00" value="1.5">
                </div>
                
                <div class="form-actions">
                    <button class="btn-cancel" id="cancel-add-contact">取消</button>
                    <button class="btn-save" id="save-new-contact">保存</button>
                </div>
            </div>
        </div>
    `;
    
    // 添加事件监听器
    document.getElementById('avatar-upload').addEventListener('change', handleAvatarUpload);
    document.getElementById('cancel-add-contact').addEventListener('click', () => loadContactsApp());
    document.getElementById('save-new-contact').addEventListener('click', saveNewContact);
}

// 显示联系人详情和编辑表单
function showContactDetails(contactId) {
    const contact = getContactById(contactId);
    
    if (!contact) {
        showNotification('联系人不存在');
        return;
    }
    
    const appContent = document.querySelector('.app-content');
    
    appContent.innerHTML = `
        <div class="contact-form">
            <div class="form-header">
                <h2>编辑联系人</h2>
            </div>
            <div class="form-content">
                <div class="avatar-upload-section">
                    <div class="avatar-preview" id="avatar-preview">
                        ${contact.avatar ? 
                            `<img src="${getImageFromLocalStorage(contact.avatar)}" alt="${contact.name}">` : 
                            `<div class="default-avatar-large">${contact.name.charAt(0).toUpperCase()}</div>`
                        }
                    </div>
                    <label for="avatar-upload" class="avatar-upload-btn">
                        <span>更换头像</span>
                        <input type="file" id="avatar-upload" accept="image/*" style="display: none;">
                    </label>
                </div>
                
                <div class="form-group">
                    <label for="contact-name">角色名</label>
                    <input type="text" id="contact-name" value="${contact.name}" placeholder="请输入角色名" required>
                </div>
                
                <div class="form-group">
                    <label for="contact-description">人设信息</label>
                    <textarea id="contact-description" placeholder="请输入人设信息" rows="4">${contact.description || ''}</textarea>
                </div>
                
                <div class="form-group">
                    <label for="contact-temperature">温度</label>
                    <input type="number" id="contact-temperature" min="0" max="2" step="0.01" placeholder="0.00" value="${contact.temperature || 0}">
                </div>
                
                <div class="form-actions">
                    <button class="btn-cancel" id="cancel-edit-contact">取消</button>
                    <button class="btn-delete" id="delete-contact">删除</button>
                    <button class="btn-save" id="save-contact-changes">保存</button>
                </div>
            </div>
        </div>
    `;
    
    // 添加事件监听器
    document.getElementById('avatar-upload').addEventListener('change', handleAvatarUpload);
    document.getElementById('cancel-edit-contact').addEventListener('click', () => loadContactsApp());
    document.getElementById('delete-contact').addEventListener('click', () => confirmDeleteContact(contactId));
    document.getElementById('save-contact-changes').addEventListener('click', () => saveContactChanges(contactId));
}

// 处理头像上传
function handleAvatarUpload(event) {
    const file = event.target.files[0];
    
    if (!file) return;
    
    // 检查文件类型
    if (!file.type.match('image.*')) {
        showNotification('请选择图片文件');
        return;
    }
    
    // 检查文件大小 (限制为2MB)
    if (file.size > 2 * 1024 * 1024) {
        showNotification('图片大小不能超过2MB');
        return;
    }
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const avatarPreview = document.getElementById('avatar-preview');
        avatarPreview.innerHTML = `<img src="${e.target.result}" alt="头像预览">`;
        
        // 保存图片数据到临时变量，以便保存联系人时使用
        window.tempAvatarData = e.target.result;
    };
    
    reader.readAsDataURL(file);
}

// 保存新联系人
function saveNewContact() {
    const name = document.getElementById('contact-name').value.trim();
    const description = document.getElementById('contact-description').value.trim();
    let temperature = parseFloat(document.getElementById('contact-temperature').value);
    
    // 温度越界检测与修正，默认值为1.5
    if (isNaN(temperature)) temperature = 1.5;
    if (temperature < 0) temperature = 0;
    if (temperature > 2) temperature = 2;
    
    // 保留两位小数
    temperature = Math.round(temperature * 100) / 100;
    
    if (!name) {
        showNotification('请输入角色名');
        return;
    }
    
    const contactData = {
        name,
        description,
        temperature
    };
    
    // 如果有上传的头像，保存到本地存储
    if (window.tempAvatarData) {
        const avatarKey = saveImageToLocalStorage(window.tempAvatarData);
        contactData.avatar = avatarKey;
        window.tempAvatarData = null; // 清除临时数据
    }
    
    // 添加联系人
    addContact(contactData);
    
    // 显示成功通知
    showNotification('联系人添加成功');
    
    // 返回联系人列表
    loadContactsApp();
}

// 保存联系人更改
function saveContactChanges(contactId) {
    const name = document.getElementById('contact-name').value.trim();
    const description = document.getElementById('contact-description').value.trim();
    let temperature = parseFloat(document.getElementById('contact-temperature').value);
    
    // 温度越界检测与修正，默认值为1.5
    if (isNaN(temperature)) temperature = 1.5;
    if (temperature < 0) temperature = 0;
    if (temperature > 2) temperature = 2;
    
    // 保留两位小数
    temperature = Math.round(temperature * 100) / 100;
    
    if (!name) {
        showNotification('请输入角色名');
        return;
    }
    
    const contactData = {
        name,
        description,
        temperature
    };
    
    // 如果有上传的新头像，保存到本地存储
    if (window.tempAvatarData) {
        // 获取旧头像键，以便删除
        const oldContact = getContactById(contactId);
        if (oldContact && oldContact.avatar) {
            deleteImageFromLocalStorage(oldContact.avatar);
        }
        
        const avatarKey = saveImageToLocalStorage(window.tempAvatarData);
        contactData.avatar = avatarKey;
        window.tempAvatarData = null; // 清除临时数据
    }
    
    // 更新联系人
    updateContact(contactId, contactData);
    
    // 显示成功通知
    showNotification('联系人更新成功');
    
    // 返回联系人列表
    loadContactsApp();
}

// 确认删除联系人
function confirmDeleteContact(contactId) {
    const contact = getContactById(contactId);
    
    if (!contact) {
        showNotification('联系人不存在');
        return;
    }
    
    if (confirm(`确定要删除联系人 "${contact.name}" 吗？此操作不可撤销。`)) {
        // 删除联系人头像（如果有）
        if (contact.avatar) {
            deleteImageFromLocalStorage(contact.avatar);
        }
        
        // 删除联系人
        deleteContact(contactId);
        
        // 显示成功通知
        showNotification('联系人已删除');
        
        // 返回联系人列表
        loadContactsApp();
    }
}

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
    // 使用新的API地址
    fetch('https://bing.biturl.top/?resolution=1920&index=0&mkt=zh-CN')
        .then(response => {
            if (!response.ok) {
                throw new Error('网络请求失败');
            }
            return response.json();
        })
        .then(data => {
            // 检查数据结构，确保url存在
            if (!data.url) {
                throw new Error('API返回的数据中没有url字段');
            }
            
            const wallpaperUrl = data.url;
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
                    localStorage.setItem('wallpaperTitle', data.copyright || 'Bing每日壁纸');
                    localStorage.setItem('wallpaperDate', data.start_date || new Date().toISOString().slice(0, 8).replace(/-/g, ''));
                    
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
    
    if (!appItems || !appOverlay || !appTitle) {
        console.error('应用元素未找到');
        return;
    }
    
    appItems.forEach(item => {
        item.addEventListener('click', function() {
            const appName = this.getAttribute('data-app-name');
            appTitle.textContent = appName;
            appOverlay.style.display = 'flex';
            
            // 根据应用名称加载不同的应用内容
            loadAppContent(appName);
            
            // 重新初始化返回按钮，确保事件绑定正确
            initBackButton();
        });
        
        // 添加触摸事件支持
        item.addEventListener('touchstart', function(e) {
            e.preventDefault();
            const appName = this.getAttribute('data-app-name');
            appTitle.textContent = appName;
            appOverlay.style.display = 'flex';
            
            // 根据应用名称加载不同的应用内容
            loadAppContent(appName);
            
            // 重新初始化返回按钮，确保事件绑定正确
            initBackButton();
        });
    });
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
                <h3 style="margin-bottom: 15px; color: #333;">搜索结果</h3>
                <p style="margin-bottom: 10px;">找到与 "${searchTerm}" 相关的内容:</p>
                <ul style="list-style-type: none; padding: 0;">
                    <li style="padding: 10px 0; border-bottom: 1px solid rgba(0, 0, 0, 0.1);">应用: ${searchTerm}</li>
                    <li style="padding: 10px 0; border-bottom: 1px solid rgba(0, 0, 0, 0.1);">联系人: ${searchTerm}</li>
                    <li style="padding: 10px 0; border-bottom: 1px solid rgba(0, 0, 0, 0.1);">设置: ${searchTerm}</li>
                </ul>
            </div>
        `;
        
        // 重新初始化返回按钮，确保事件绑定正确
        initBackButton();
    }, 500);
    
    // 清空搜索框
    document.querySelector('.search-box input').value = '';
}

// 初始化返回按钮
function initBackButton() {
    const backButton = document.querySelector('.app-back-btn');
    const appOverlay = document.getElementById('app-overlay');
    
    console.log('初始化返回按钮', backButton, appOverlay);
    
    if (backButton && appOverlay) {
        // 移除之前的事件监听器（如果存在）
        backButton.removeEventListener('click', hideAppOverlay);
        backButton.removeEventListener('touchstart', hideAppOverlay);
        
        // 添加新的事件监听器
        backButton.addEventListener('click', hideAppOverlay);
        backButton.addEventListener('touchstart', function(e) {
            e.preventDefault();
            hideAppOverlay();
        });
        
        console.log('返回按钮事件绑定成功');
    } else {
        console.error('返回按钮或应用遮罩层未找到');
    }
}

// 隐藏应用遮罩层的函数
function hideAppOverlay() {
    const appOverlay = document.getElementById('app-overlay');
    const appContent = document.querySelector('.app-content');
    
    if (appOverlay) {
        appOverlay.style.display = 'none';
        console.log('应用遮罩层已隐藏');
    }
    
    // 移除聊天应用的全屏显示类
    if (appContent) {
        appContent.classList.remove('chat-fullscreen');
    }
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
            <h3 style="margin-bottom: 15px; color: #333;">应用选项</h3>
            <div style="display: flex; flex-direction: column; gap: 10px;">
                <button style="padding: 12px; background-color: rgba(0, 0, 0, 0.1); border: none; border-radius: 8px; color: #333; cursor: pointer;">打开</button>
                <button style="padding: 12px; background-color: rgba(0, 0, 0, 0.1); border: none; border-radius: 8px; color: #333; cursor: pointer;">应用信息</button>
                <button style="padding: 12px; background-color: rgba(0, 0, 0, 0.1); border: none; border-radius: 8px; color: #333; cursor: pointer;">卸载</button>
            </div>
        </div>
    `;
    appOverlay.style.display = 'flex';
    
    // 重新初始化返回按钮，确保事件绑定正确
    initBackButton();
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