// 剧集数据管理
class DramaManager {
    constructor() {
        this.dramas = this.loadDramas();
        this.currentSeason = 'autumn';
        this.init();
    }

    // 初始化
    init() {
        this.renderSeasonNav();
        this.showSeason(this.currentSeason);
        this.setupEventListeners();
    }

    // 从本地存储加载剧集数据
    loadDramas() {
        const saved = localStorage.getItem('dramaData');
        if (saved) {
            return JSON.parse(saved);
        }
        
        // 默认数据
        return {
            autumn: [
                {
                    id: this.generateId(),
                    title: "silent love -无声的爱-",
                    originalTitle: "サイレントラブ",
                    day: "月曜",
                    genre: ["爱情", "剧情"],
                    year: "2025",
                    season: "autumn",
                    poster: "https://via.placeholder.com/300x450/667eea/ffffff?text=Silent+Love",
                    desc: "讲述一名听力障碍女孩与普通男孩之间跨越障碍的纯爱故事。",
                    rating: 8.7,
                    director: "山田洋次",
                    screenwriter: "坂元裕二",
                    cast: ["佐藤健", "石原里美", "菅田将晖"],
                    broadcast: "TBS电视台 每周一22:00",
                    links: {
                        baidu: "https://pan.baidu.com/s/1example1",
                        ali: "https://www.aliyundrive.com/s/example1", 
                        quark: "https://pan.quark.cn/s/example1"
                    }
                },
                {
                    id: this.generateId(),
                    title: "相棒 第24季",
                    originalTitle: "相棒 season24",
                    day: "水曜",
                    genre: ["悬疑", "刑侦"],
                    year: "2025",
                    season: "autumn",
                    poster: "https://via.placeholder.com/300x450/764ba2/ffffff?text=相棒24",
                    desc: "警视厅特命系搭档右京和亘继续解决各种疑难案件，本季将面对更加复杂的犯罪网络。",
                    rating: 8.9,
                    director: "和泉圣治",
                    screenwriter: "輿水泰弘",
                    cast: ["水谷丰", "反町隆史", "川原和久", "山中崇史"],
                    broadcast: "朝日电视台 每周三21:00",
                    links: {
                        baidu: "https://pan.baidu.com/s/1example2",
                        ali: "https://www.aliyundrive.com/s/example2", 
                        quark: "https://pan.quark.cn/s/example2"
                    }
                }
            ],
            winter: [],
            spring: [],
            summer: []
        };
    }

    // 保存数据到本地存储
    saveDramas() {
        localStorage.setItem('dramaData', JSON.stringify(this.dramas));
    }

    // 生成唯一ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // 获取所有剧集类型
    getAllGenres() {
        const genres = new Set();
        Object.values(this.dramas).forEach(season => {
            season.forEach(drama => {
                drama.genre.forEach(g => genres.add(g));
            });
        });
        return Array.from(genres);
    }

    // 渲染季度导航
    renderSeasonNav() {
        const seasonNav = document.querySelector('.season-nav');
        
        Object.keys(this.dramas).forEach(season => {
            const count = this.dramas[season].length;
            const seasonCard = seasonNav.querySelector(`[data-season="${season}"] .count`);
            if (seasonCard) {
                seasonCard.textContent = `${count}部剧集`;
            }
        });
    }

    // 显示指定季度的剧集
    showSeason(season) {
        this.currentSeason = season;
        
        // 更新季度筛选器
        document.getElementById('seasonFilter').value = season;
        
        // 更新季度资源汇总
        this.updateSeasonResources(season);
        
        // 获取数据
        const dramas = this.dramas[season] || [];
        const container = document.getElementById('dramaList');
        
        // 生成剧集卡片
        container.innerHTML = dramas.map(drama => this.createDramaCard(drama)).join('');
        
        // 更新季度计数
        this.renderSeasonNav();
    }

    // 创建剧集卡片HTML
    createDramaCard(drama) {
        return `
            <div class="drama-card" data-id="${drama.id}" data-year="${drama.year}" data-season="${drama.season}" data-day="${drama.day}" data-genre="${drama.genre.join(',')}">
                <div class="drama-poster">
                    ${drama.poster ? 
                        `<img src="${drama.poster}" alt="${drama.title}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                         <div class="placeholder" style="display:none;"><i class="fas fa-film"></i></div>` :
                        `<div class="placeholder"><i class="fas fa-film"></i></div>`
                    }
                    <div class="drama-badge">${drama.day}</div>
                    <div class="drama-actions">
                        <button class="action-btn edit-drama" title="编辑"><i class="fas fa-edit"></i></button>
                        <button class="action-btn delete-drama" title="删除"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
                <div class="drama-info">
                    <h3 class="drama-title">${drama.title}</h3>
                    <div class="drama-original-title">${drama.originalTitle}</div>
                    <div class="drama-meta">
                        <span><i class="fas fa-star" style="color: #ffc107;"></i> 豆瓣 ${drama.rating}</span>
                        <span><i class="fas fa-tags"></i> ${drama.genre.join(' · ')}</span>
                    </div>
                    <p class="drama-desc">${drama.desc}</p>
                    <div class="drama-links">
                        <a href="${drama.links.baidu}" target="_blank" class="link-btn baidu" onclick="event.stopPropagation()"><i class="fas fa-cloud"></i> 百度网盘</a>
                        <a href="${drama.links.ali}" target="_blank" class="link-btn ali" onclick="event.stopPropagation()"><i class="fas fa-cloud-download-alt"></i> 阿里云盘</a>
                        <a href="${drama.links.quark}" target="_blank" class="link-btn quark" onclick="event.stopPropagation()"><i class="fas fa-bolt"></i> 夸克网盘</a>
                    </div>
                </div>
            </div>
        `;
    }

    // 更新季度资源汇总
    updateSeasonResources(season) {
        const resources = this.getSeasonResources(season);
        const container = document.getElementById('seasonResources');
        
        container.innerHTML = `
            <h3><i class="fas fa-cloud-download-alt"></i> ${resources.title}</h3>
            <div class="resource-links">
                ${resources.links.map(link => `
                    <a href="${link.url}" target="_blank" class="resource-link ${link.type}">
                        <i class="fas fa-cloud"></i>
                        <span>${link.text}</span>
                    </a>
                `).join('')}
            </div>
        `;
    }

    // 获取季度资源数据
    getSeasonResources(season) {
        const seasonNames = {
            winter: "冬季",
            spring: "春季", 
            summer: "夏季",
            autumn: "秋季"
        };
        
        const year = "2025";
        const seasonName = seasonNames[season];
        
        return {
            title: `${year}${seasonName}日剧资源汇总`,
            links: [
                { type: "baidu", text: `${year}${seasonName}日剧百度网盘合集`, url: "#" },
                { type: "ali", text: `${year}${seasonName}日剧阿里云盘合集`, url: "#" },
                { type: "quark", text: `${year}${seasonName}日剧夸克网盘合集`, url: "#" }
            ]
        };
    }

    // 打开剧集详情模态框
    openDramaModal(dramaId) {
        const drama = this.findDramaById(dramaId);
        if (!drama) return;
        
        // 更新模态框内容
        document.getElementById('modalTitle').textContent = drama.title;
        document.getElementById('modalContent').innerHTML = this.createDramaDetailHTML(drama);
        
        // 显示模态框
        document.getElementById('dramaModal').style.display = 'block';
    }

    // 创建剧集详情HTML
    createDramaDetailHTML(drama) {
        return `
            <div class="drama-detail">
                <div class="detail-poster">
                    ${drama.poster ? 
                        `<img src="${drama.poster}" alt="${drama.title}">` :
                        `<div class="placeholder"><i class="fas fa-film"></i></div>`
                    }
                </div>
                <div class="detail-info">
                    <div class="detail-item">
                        <div class="detail-label">原名</div>
                        <div class="detail-value">${drama.originalTitle}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">豆瓣评分</div>
                        <div class="detail-value">${drama.rating}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">类型</div>
                        <div class="detail-value">${drama.genre.join(' / ')}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">导演</div>
                        <div class="detail-value">${drama.director}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">编剧</div>
                        <div class="detail-value">${drama.screenwriter}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">主演</div>
                        <div class="detail-value">${Array.isArray(drama.cast) ? drama.cast.join(' / ') : drama.cast}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">播出信息</div>
                        <div class="detail-value">${drama.broadcast}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">简介</div>
                        <div class="detail-value">${drama.desc}</div>
                    </div>
                    <div class="detail-links">
                        <a href="${drama.links.baidu}" target="_blank" class="detail-link baidu"><i class="fas fa-cloud"></i> 百度网盘</a>
                        <a href="${drama.links.ali}" target="_blank" class="detail-link ali"><i class="fas fa-cloud-download-alt"></i> 阿里云盘</a>
                        <a href="${drama.links.quark}" target="_blank" class="detail-link quark"><i class="fas fa-bolt"></i> 夸克网盘</a>
                    </div>
                </div>
            </div>
        `;
    }

    // 根据ID查找剧集
    findDramaById(id) {
        for (const season in this.dramas) {
            const drama = this.dramas[season].find(d => d.id === id);
            if (drama) return drama;
        }
        return null;
    }

    // 打开添加/编辑剧集模态框
    openEditDramaModal(dramaId = null) {
        const modal = document.getElementById('editDramaModal');
        const title = document.getElementById('editModalTitle');
        const form = document.getElementById('dramaForm');
        
        // 重置表单
        form.reset();
        
        if (dramaId) {
            // 编辑模式
            title.textContent = "编辑剧集";
            const drama = this.findDramaById(dramaId);
            if (drama) {
                this.populateForm(drama);
            }
            form.dataset.editId = dramaId;
        } else {
            // 添加模式
            title.textContent = "添加新剧集";
            delete form.dataset.editId;
        }
        
        // 渲染类型选择
        this.renderGenreCheckboxes();
        
        // 显示模态框
        modal.style.display = 'block';
    }

    // 填充表单数据
    populateForm(drama) {
        document.getElementById('dramaTitle').value = drama.title;
        document.getElementById('dramaOriginalTitle').value = drama.originalTitle;
        document.getElementById('dramaSeason').value = drama.season;
        document.getElementById('dramaYear').value = drama.year;
        document.getElementById('dramaDay').value = drama.day;
        document.getElementById('dramaRating').value = drama.rating;
        document.getElementById('dramaPoster').value = drama.poster || '';
        document.getElementById('dramaDesc').value = drama.desc;
        document.getElementById('dramaDirector').value = drama.director;
        document.getElementById('dramaScreenwriter').value = drama.screenwriter;
        document.getElementById('dramaCast').value = Array.isArray(drama.cast) ? drama.cast.join(', ') : drama.cast;
        document.getElementById('dramaBroadcast').value = drama.broadcast;
        document.getElementById('dramaBaidu').value = drama.links.baidu;
        document.getElementById('dramaAli').value = drama.links.ali;
        document.getElementById('dramaQuark').value = drama.links.quark;
        
        // 设置类型选择
        drama.genre.forEach(genre => {
            const checkbox = document.querySelector(`input[name="genre"][value="${genre}"]`);
            if (checkbox) checkbox.checked = true;
        });
    }

    // 渲染类型选择框
    renderGenreCheckboxes() {
        const container = document.getElementById('dramaGenre');
        const genres = this.getAllGenres();
        
        container.innerHTML = genres.map(genre => `
            <label class="checkbox-item">
                <input type="checkbox" name="genre" value="${genre}">
                <span>${genre}</span>
            </label>
        `).join('');
    }

    // 保存剧集（添加或更新）
    saveDrama(formData) {
        const id = formData.get('id') || this.generateId();
        const season = formData.get('season');
        
        const drama = {
            id: id,
            title: formData.get('title'),
            originalTitle: formData.get('originalTitle'),
            season: season,
            year: formData.get('year'),
            day: formData.get('day'),
            genre: formData.getAll('genre'),
            rating: parseFloat(formData.get('rating')) || 0,
            poster: formData.get('poster'),
            desc: formData.get('desc'),
            director: formData.get('director'),
            screenwriter: formData.get('screenwriter'),
            cast: formData.get('cast').split(',').map(s => s.trim()),
            broadcast: formData.get('broadcast'),
            links: {
                baidu: formData.get('baidu'),
                ali: formData.get('ali'),
                quark: formData.get('quark')
            }
        };
        
        // 检查是添加还是编辑
        const existingIndex = this.dramas[season].findIndex(d => d.id === id);
        if (existingIndex >= 0) {
            // 更新现有剧集
            this.dramas[season][existingIndex] = drama;
        } else {
            // 添加新剧集
            this.dramas[season].push(drama);
        }
        
        // 保存到本地存储
        this.saveDramas();
        
        // 刷新显示
        this.showSeason(this.currentSeason);
        
        // 关闭模态框
        this.closeModal('editDramaModal');
    }

    // 删除剧集
    deleteDrama(dramaId) {
        if (!confirm('确定要删除这个剧集吗？')) return;
        
        for (const season in this.dramas) {
            const index = this.dramas[season].findIndex(d => d.id === dramaId);
            if (index >= 0) {
                this.dramas[season].splice(index, 1);
                break;
            }
        }
        
        // 保存到本地存储
        this.saveDramas();
        
        // 刷新显示
        this.showSeason(this.currentSeason);
    }

    // 筛选功能
    applyFilters() {
        const yearFilter = document.getElementById('yearFilter').value;
        const seasonFilter = document.getElementById('seasonFilter').value;
        const genreFilter = document.getElementById('genreFilter').value;
        
        const dramaCards = document.querySelectorAll('.drama-card');
        
        dramaCards.forEach(card => {
            const year = card.getAttribute('data-year');
            const season = card.getAttribute('data-season');
            const genre = card.getAttribute('data-genre');
            
            let show = true;
            
            if (yearFilter && year !== yearFilter) show = false;
            if (seasonFilter && season !== seasonFilter) show = false;
            if (genreFilter && !genre.includes(genreFilter)) show = false;
            
            card.style.display = show ? 'block' : 'none';
        });
    }

    // 搜索功能
    searchDramas(term) {
        const dramaCards = document.querySelectorAll('.drama-card');
        
        dramaCards.forEach(card => {
            const title = card.querySelector('.drama-title').textContent.toLowerCase();
            const originalTitle = card.querySelector('.drama-original-title').textContent.toLowerCase();
            const desc = card.querySelector('.drama-desc').textContent.toLowerCase();
            const genre = card.getAttribute('data-genre').toLowerCase();
            
            if (title.includes(term) || originalTitle.includes(term) || desc.includes(term) || genre.includes(term)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // 关闭模态框
    closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }

    // 设置事件监听器
    setupEventListeners() {
        // 季度导航点击
        document.querySelectorAll('.season-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.action-btn')) {
                    const season = card.dataset.season;
                    this.showSeason(season);
                }
            });
        });
        
        // 筛选器变化
        document.getElementById('yearFilter').addEventListener('change', () => this.applyFilters());
        document.getElementById('seasonFilter').addEventListener('change', () => {
            const season = document.getElementById('seasonFilter').value;
            if (season) {
                this.showSeason(season);
            } else {
                this.applyFilters();
            }
        });
        document.getElementById('genreFilter').addEventListener('change', () => this.applyFilters());
        
        // 搜索功能
        document.querySelector('.search-box button').addEventListener('click', () => {
            const searchTerm = document.querySelector('.search-box input').value.toLowerCase();
            this.searchDramas(searchTerm);
        });
        
        document.querySelector('.search-box input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const searchTerm = document.querySelector('.search-box input').value.toLowerCase();
                this.searchDramas(searchTerm);
            }
        });
        
        // 剧集卡片点击
        document.addEventListener('click', (e) => {
            const dramaCard = e.target.closest('.drama-card');
            if (dramaCard && !e.target.closest('.action-btn') && !e.target.closest('.link-btn')) {
                const dramaId = dramaCard.dataset.id;
                this.openDramaModal(dramaId);
            }
            
            // 编辑按钮
            const editBtn = e.target.closest('.edit-drama');
            if (editBtn) {
                const dramaId = editBtn.closest('.drama-card').dataset.id;
                this.openEditDramaModal(dramaId);
            }
            
            // 删除按钮
            const deleteBtn = e.target.closest('.delete-drama');
            if (deleteBtn) {
                const dramaId = deleteBtn.closest('.drama-card').dataset.id;
                this.deleteDrama(dramaId);
            }
        });
        
        // 模态框关闭
        document.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) {
                    modal.style.display = 'none';
                }
            });
        });
        
        // 点击模态框外部关闭
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });
        
        // 添加剧集按钮
        document.getElementById('addDramaBtn').addEventListener('click', () => {
            this.openEditDramaModal();
        });
        
        // 豆瓣导入按钮
        document.getElementById('importDoubanBtn').addEventListener('click', () => {
            document.getElementById('doubanModal').style.display = 'block';
        });
        
        // 取消豆瓣导入
        document.getElementById('cancelDoubanBtn').addEventListener('click', () => {
            this.closeModal('doubanModal');
        });
        
        // 获取豆瓣信息
        document.getElementById('fetchDoubanBtn').addEventListener('click', () => {
            this.fetchDoubanInfo();
        });
        
        // 取消编辑
        document.getElementById('cancelBtn').addEventListener('click', () => {
            this.closeModal('editDramaModal');
        });
        
        // 保存剧集表单
        document.getElementById('dramaForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            if (e.target.dataset.editId) {
                formData.append('id', e.target.dataset.editId);
            }
            this.saveDrama(formData);
        });
    }

    // 从豆瓣获取信息（模拟实现）
    fetchDoubanInfo() {
        const url = document.getElementById('doubanUrl').value;
        const resultDiv = document.getElementById('doubanResult');
        
        if (!url) {
            resultDiv.innerHTML = '<p style="color: red;">请输入豆瓣URL</p>';
            resultDiv.style.display = 'block';
            return;
        }
        
        // 显示加载中
        resultDiv.innerHTML = '<p>正在获取豆瓣信息...</p>';
        resultDiv.style.display = 'block';
        
        // 模拟API请求（实际使用时需要后端代理解决跨域问题）
        setTimeout(() => {
            // 这里应该是实际的API调用
            // 由于豆瓣API限制，这里只是模拟返回数据
            const mockData = {
                title: "silent love -无声的爱-",
                originalTitle: "サイレントラブ",
                rating: 8.7,
                poster: "https://via.placeholder.com/300x450/667eea/ffffff?text=Silent+Love",
                desc: "讲述一名听力障碍女孩与普通男孩之间跨越障碍的纯爱故事。",
                director: "山田洋次",
                screenwriter: "坂元裕二",
                cast: ["佐藤健", "石原里美", "菅田将晖"],
                year: "2025",
                genre: ["爱情", "剧情"]
            };
            
            resultDiv.innerHTML = `
                <h4>获取到的信息：</h4>
                <p><strong>剧名：</strong>${mockData.title}</p>
                <p><strong>原名：</strong>${mockData.originalTitle}</p>
                <p><strong>评分：</strong>${mockData.rating}</p>
                <p><strong>类型：</strong>${mockData.genre.join(', ')}</p>
                <button id="useDoubanData" class="btn btn-primary">使用这些数据</button>
            `;
            
            // 使用豆瓣数据按钮
            document.getElementById('useDoubanData').addEventListener('click', () => {
                this.populateFormWithDoubanData(mockData);
                this.closeModal('doubanModal');
            });
        }, 1500);
    }

    // 使用豆瓣数据填充表单
    populateFormWithDoubanData(data) {
        document.getElementById('dramaTitle').value = data.title;
        document.getElementById('dramaOriginalTitle').value = data.originalTitle;
        document.getElementById('dramaRating').value = data.rating;
        document.getElementById('dramaPoster').value = data.poster;
        document.getElementById('dramaDesc').value = data.desc;
        document.getElementById('dramaDirector').value = data.director;
        document.getElementById('dramaScreenwriter').value = data.screenwriter;
        document.getElementById('dramaCast').value = data.cast.join(', ');
        document.getElementById('dramaYear').value = data.year;
        
        // 设置类型
        data.genre.forEach(genre => {
            const checkbox = document.querySelector(`input[name="genre"][value="${genre}"]`);
            if (checkbox) checkbox.checked = true;
        });
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', function() {
    window.dramaManager = new DramaManager();
});