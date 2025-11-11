// 公共工具函数
class Utils {
    // 生成唯一ID
    static generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // 从本地存储加载数据
    static loadData(key, defaultValue = null) {
        try {
            const saved = localStorage.getItem(key);
            return saved ? JSON.parse(saved) : defaultValue;
        } catch (error) {
            console.error('加载数据失败:', error);
            return defaultValue;
        }
    }

    // 保存数据到本地存储
    static saveData(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('保存数据失败:', error);
            return false;
        }
    }

    // 防抖函数
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // 格式化日期
    static formatDate(date) {
        return new Date(date).toLocaleDateString('zh-CN');
    }

    // 验证URL
    static isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    // 获取所有剧集类型
    static getAllGenres(dramas) {
        const genres = new Set();
        Object.values(dramas).forEach(season => {
            season.forEach(drama => {
                drama.genre.forEach(g => genres.add(g));
            });
        });
        return Array.from(genres);
    }

    // 分页函数
    static paginate(array, page, pageSize) {
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        return {
            data: array.slice(start, end),
            totalPages: Math.ceil(array.length / pageSize),
            totalItems: array.length
        };
    }

    // 图片压缩函数
    static compressImage(file, maxWidth = 800, maxHeight = 600, quality = 0.8) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    // 计算缩放比例
                    if (width > height) {
                        if (width > maxWidth) {
                            height = Math.round((height * maxWidth) / width);
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxHeight) {
                            width = Math.round((width * maxHeight) / height);
                            height = maxHeight;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob((blob) => {
                        resolve(blob);
                    }, 'image/jpeg', quality);
                };
                img.onerror = reject;
            };
            reader.onerror = reject;
        });
    }

    // 将图片转换为Base64
    static fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    // 模拟豆瓣API请求
    static async fetchDoubanInfo(url) {
        // 这里应该是实际的API调用
        // 由于豆瓣API限制，这里只是模拟返回数据
        return new Promise((resolve) => {
            setTimeout(() => {
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
                resolve(mockData);
            }, 1500);
        });
    }
}
