// 这里已经帮你换成你最新的 BIN ID 了
const BIN_ID = "6afaaf18ffd5d16053c4d397"; 
const API_KEY = "$2a$10$XbqceNVBwIrxiOMN/f5RMuMefQ5bzM/5pCDoK6BbR/2JBC11PqFoe";

const input = document.getElementById('search');
const result = document.getElementById('result');
const lightbox = document.getElementById('lightbox');
const lightboxImg = lightbox.querySelector('img');

input.addEventListener('input', async () => {
  const code = input.value.trim();
  if (!code) { result.innerHTML = ''; return; }

  result.innerHTML = '<p>正在查询云端数据...</p>';
  result.style.display = 'block';

  try {
    const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
      headers: { 'X-Master-Key': API_KEY }
    });
    
    const json = await res.json();
    const data = json.record[code]; 
    
    if (!data) {
      result.innerHTML = '<p>未找到该编码的手机信息</p>';
      return;
    }

    let photosHtml = '';
    if (data.photos && data.photos.length > 0) {
      // 增加容错：只加载 http 开头的有效链接
      photosHtml = data.photos.map(p => {
        if (p && p.startsWith('http')) {
          return `<img src="${p}" alt="${code}" onerror="this.style.display='none'">`;
        }
        return '';
      }).join('');
    }

    result.innerHTML = `
      <h2>${data.model}</h2>
      <p>编码：${data.code} ｜ 颜色：${data.color} ｜ 存储：${data.storage}</p>
      <p>${data.note || ''}</p>
      <div class="gallery">${photosHtml}</div>
      ${data.video ? `<a class="video-link" href="${data.video}" target="_blank">查看测试视频</a>` : ''}
    `;

    // 绑定图片放大
    result.querySelectorAll('.gallery img').forEach(img => {
      img.addEventListener('click', () => {
        lightboxImg.src = img.src;
        lightbox.style.display = 'flex';
      });
    });
  } catch (err) {
    result.innerHTML = '<p>网络请求失败，请刷新重试。</p>';
  }
});

lightbox.addEventListener('click', () => {
  lightbox.style.display = 'none';
  lightboxImg.src = '';
});
