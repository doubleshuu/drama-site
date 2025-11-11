// 管理员版本功能
class AdminDramaManager extends VisitorDramaManager {
    constructor() {
        super();
        this.initAdminFeatures();
    }

    // 初始化管理员特有功能
    initAdminFeatures() {
        this.renderAdminStats();
        this.setupAdminEventListeners();
    }

    // 渲染管理员统计
    renderAdminStats() {
        let total = 0;
        const seasonCounts = {
            winter: 0,
            spring: 0,
            summer: 0,
            autumn: 0
        };

        Object.keys(this.dramas).forEach(season => {
            const count = this.dramas[season].length;
            seasonCounts[season] = count;
            total += count;
        });

        document.getElementById('totalDramas').textContent = total;
        document.getElementById('winterDramas').textContent = seasonCounts.winter;
        document.getElementById('springDramas').textContent = seasonCounts.spring;
        document.getElementById('summerDramas').textContent = seasonCounts.summer;
        document.getElementById('autumnDramas').textContent = seasonCounts.autumn;
    }

    // 创建剧集卡片HTML（管理员版本）
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
        const checkboxes = document.querySelectorAll('input[name="genre"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = drama.genre.includes(checkbox.value);
        });
    }

    // 渲染类型选择框
    renderGenreCheckboxes() {
        const container = document.getElementById('dramaGenre');
        const genres = Utils.getAllGenres(this.dramas);
        
        container.innerHTML = genres.map(genre => `
            <label class="checkbox-item">
                <input type="checkbox" name="genre" value="${genre}">
                <span>${genre}</span>
            </label>
        `).join('');
    }

    // 保存剧集（添加或更新）
    saveDrama(formData) {
        const id = formData.get('id') || Utils.generateId();
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
        Utils.saveData('dramaData', this.dramas);
        
        // 刷新显示
        this.showSeason(this.currentSeason);
        this.renderAdminStats();
        
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
        Utils.saveData('dramaData', this.dramas);
        
        // 刷新显示
        this.showSeason(this.currentSeason);
        this.renderAdminStats();
    }

    // 从豆瓣获取信息
    async fetchDoubanInfo() {
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
        
        try {
            const data = await Utils.fetchDoubanInfo(url);
            
            resultDiv.innerHTML = `
                <h4>获取到的信息：</h4>
                <p><strong>剧名：</strong>${data.title}</p>
                <p><strong>原名：</strong>${data.originalTitle}</p>
                <p><strong>评分：</strong>${data.rating}</p>
                <p><strong>类型：</strong>${data.genre.join(', ')}</p>
                <button id="useDoubanData" class="btn btn-primary">使用这些数据</button>
            `;
            
            // 使用豆瓣数据按钮
            document.getElementById('useDoubanData').addEventListener('click', () => {
                this.populateFormWithDoubanData(data);
                this.closeModal('doubanModal');
            });
        } catch (error) {
            resultDiv.innerHTML = `<p style="color: red;">获取豆瓣信息失败: ${error.message}</p>`;
        }
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
        const checkboxes = document.querySelectorAll('input[name="genre"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = data.genre.includes(checkbox.value);
        });
    }

    // 打开图片上传模态框
    openImageUploadModal() {
        document.getElementById('imageUploadModal').style.display = 'block';
        document.getElementById('uploadPreview').style.display = 'none';
        document.getElementById('uploadArea').style.display = 'block';
    }

    // 处理图片上传
    async handleImageUpload(file) {
        try {
            // 压缩图片
            const compressedBlob = await Utils.compressImage(file);
            
            // 转换为Base64
            const base64 = await Utils.fileToBase64(compressedBlob);
            
            // 显示预览
            document.getElementById('previewImage').src = base64;
            document.getElementById('uploadArea').style.display = 'none';
            document.getElementById('uploadPreview').style.display = 'block';
            
            // 保存Base64到临时存储
            this.tempImageData = base64;
        } catch (error) {
            alert('图片上传失败: ' + error.message);
        }
    }

    // 确认使用上传的图片
    confirmImageUpload() {
        if (this.tempImageData) {
            document.getElementById('dramaPoster').value = this.tempImageData;
            this.closeModal('imageUploadModal');
        }
    }

    // 关闭模态框
    closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }

    // 设置管理员事件监听器
    setupAdminEventListeners() {
        // 调用父类的事件监听器
        super.setupEventListeners();
        
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
        
        // 编辑和删除按钮
        document.addEventListener('click', (e) => {
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
        
        // 图片上传按钮
        document.getElementById('uploadPosterBtn').addEventListener('click', () => {
            this.openImageUploadModal();
        });
        
        // 图片上传区域
        const uploadArea = document.getElementById('uploadArea');
        const imageFile = document.getElementById('imageFile');
        
        uploadArea.addEventListener('click', () => {
            imageFile.click();
        });
        
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'var(--primary)';
            uploadArea.style.background = 'var(--light)';
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.borderColor = 'var(--border)';
            uploadArea.style.background = 'white';
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'var(--border)';
            uploadArea.style.background = 'white';
            
            const files = e.dataTransfer.files;
            if (files.length > 0 && files[0].type.startsWith('image/')) {
                this.handleImageUpload(files[0]);
            }
        });
        
        imageFile.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleImageUpload(e.target.files[0]);
            }
        });
        
        // 确认上传图片
        document.getElementById('confirmUpload').addEventListener('click', () => {
            this.confirmImageUpload();
        });
        
        // 取消上传图片
        document.getElementById('cancelUpload').addEventListener('click', () => {
            document.getElementById('uploadPreview').style.display = 'none';
            document.getElementById('uploadArea').style.display = 'block';
            this.tempImageData = null;
        });
        
        // 关闭上传模态框
        document.getElementById('closeUploadBtn').addEventListener('click', () => {
            this.closeModal('imageUploadModal');
        });
    }
}

// 初始化管理员版本
document.addEventListener('DOMContentLoaded', function() {
    window.adminManager = new AdminDramaManager();
});
