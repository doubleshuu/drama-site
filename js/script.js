// 访问者版本功能
class VisitorDramaManager {
    constructor() {
        this.dramas = Utils.loadData('dramaData', this.getDefaultData());
        this.currentSeason = 'autumn';
        this.currentPage = 1;
        this.pageSize = 9;
        this.filteredDramas = [];
        this.init();
    }

    // 默认数据
    getDefaultData() {
        return {
            autumn: [
                {
                    id: Utils.generateId(),
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
                }
            ],
            winter: [],
            spring: [],
            summer: []
        };
    }

    // 初始化
    init() {
        this.renderSeasonNav();
        this.showSeason(this.currentSeason);
        this.setupEventListeners();
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
    showSeason(season, page = 1) {
        this.currentSeason = season;
        this.currentPage = page;
        
        // 更新季度筛选器
        document.getElementById('seasonFilter').value = season;
        
        // 更新季度资源汇总
        this.updateSeasonResources(season);
        
        // 获取当前季度的剧集
        const dramas = this.dramas[season] || [];
        
        // 应用筛选
        this.filteredDramas = this.applyFiltersToDramas(dramas);
        
        // 分页
        const pagination = Utils.paginate(this.filteredDramas, page, this.pageSize);
        
        // 渲染剧集
        this.renderDramas(pagination.data);
        
        // 渲染分页
        this.renderPagination(pagination);
        
        // 更新季度计数
        this.renderSeasonNav();
    }

    // 应用筛选到剧集列表
    applyFiltersToDramas(dramas) {
        const yearFilter = document.getElementById('yearFilter').value;
        const genreFilter = document.getElementById('genreFilter').value;
        
        return dramas.filter(drama => {
            let include = true;
            
            if (yearFilter && drama.year !== yearFilter) include = false;
            if (genreFilter && !drama.genre.includes(genreFilter)) include = false;
            
            return include;
        });
    }

    // 渲染剧集列表
    renderDramas(dramas) {
        const container = document.getElementById('dramaList');
        container.innerHTML = dramas.map(drama => this.createDramaCard(drama)).join('');
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

    // 渲染分页
    renderPagination(pagination) {
        const { totalPages, totalItems, data } = pagination;
        const currentPage = this.currentPage;
        
        // 更新分页信息
        document.getElementById('paginationText').textContent = 
            `第 ${currentPage} 页，共 ${totalPages} 页，${totalItems} 部剧集`;
        
        // 更新分页按钮
        document.getElementById('prevPage').disabled = currentPage === 1;
        document.getElementById('nextPage').disabled = currentPage === totalPages;
        
        // 渲染页码
        const pageNumbers = document.getElementById('pageNumbers');
        pageNumbers.innerHTML = '';
        
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `page-number ${i === currentPage ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', () => {
                this.showSeason(this.currentSeason, i);
            });
            pageNumbers.appendChild(pageBtn);
        }
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

    // 搜索功能
    searchDramas(term) {
        const dramas = this.dramas[this.currentSeason] || [];
        this.filteredDramas = dramas.filter(drama => {
            const title = drama.title.toLowerCase();
            const originalTitle = drama.originalTitle.toLowerCase();
            const desc = drama.desc.toLowerCase();
            const genre = drama.genre.join(' ').toLowerCase();
            const cast = Array.isArray(drama.cast) ? drama.cast.join(' ').toLowerCase() : drama.cast.toLowerCase();
            
            return title.includes(term) || 
                   originalTitle.includes(term) || 
                   desc.includes(term) || 
                   genre.includes(term) ||
                   cast.includes(term);
        });
        
        // 重置到第一页
        this.currentPage = 1;
        
        // 分页
        const pagination = Utils.paginate(this.filteredDramas, this.currentPage, this.pageSize);
        
        // 渲染剧集
        this.renderDramas(pagination.data);
        
        // 渲染分页
        this.renderPagination(pagination);
    }

    // 设置事件监听器
    setupEventListeners() {
        // 季度导航点击
        document.querySelectorAll('.season-card').forEach(card => {
            card.addEventListener('click', () => {
                const season = card.dataset.season;
                this.showSeason(season);
            });
        });
        
        // 筛选器变化
        document.getElementById('yearFilter').addEventListener('change', () => {
            this.showSeason(this.currentSeason, 1);
        });
        
        document.getElementById('seasonFilter').addEventListener('change', () => {
            const season = document.getElementById('seasonFilter').value;
            if (season) {
                this.showSeason(season, 1);
            }
        });
        
        document.getElementById('genreFilter').addEventListener('change', () => {
            this.showSeason(this.currentSeason, 1);
        });
        
        // 搜索功能
        const searchHandler = Utils.debounce(() => {
            const searchTerm = document.querySelector('.search-box input').value.toLowerCase();
            if (searchTerm) {
                this.searchDramas(searchTerm);
            } else {
                this.showSeason(this.currentSeason, 1);
            }
        }, 300);
        
        document.querySelector('.search-box button').addEventListener('click', searchHandler);
        document.querySelector('.search-box input').addEventListener('input', searchHandler);
        document.querySelector('.search-box input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') searchHandler();
        });
        
        // 剧集卡片点击
        document.addEventListener('click', (e) => {
            const dramaCard = e.target.closest('.drama-card');
            if (dramaCard && !e.target.closest('.link-btn')) {
                const dramaId = dramaCard.dataset.id;
                this.openDramaModal(dramaId);
            }
        });
        
        // 分页按钮
        document.getElementById('prevPage').addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.showSeason(this.currentSeason, this.currentPage - 1);
            }
        });
        
        document.getElementById('nextPage').addEventListener('click', () => {
            const totalPages = Math.ceil(this.filteredDramas.length / this.pageSize);
            if (this.currentPage < totalPages) {
                this.showSeason(this.currentSeason, this.currentPage + 1);
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
    }
}

// 初始化访问者版本
document.addEventListener('DOMContentLoaded', function() {
    window.visitorManager = new VisitorDramaManager();
});
