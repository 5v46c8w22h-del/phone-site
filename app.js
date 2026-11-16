const BIN_ID = "6afa8481ac6210605a8ad583"; 
const API_KEY = "$2a$10$XbqceNVBwIrxiOMN/f5RMuMefQ5bzM/5pCDoK6BbR/2JBC11PqFoe";

const input = document.getElementById('search');
const result = document.getElementById('result');
const lightbox = document.getElementById('lightbox');
const lightboxImg = lightbox.querySelector('img');

input.addEventListener('input', async () => {
  const code = input.value.trim();
  if (!code) { result.innerHTML = ''; return; }

  try {
    // 从云端实时拉取最新数据
    const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
      headers: { 'X-Master-Key': API_KEY }
    });
    
    const json = await res.json();
    const data = json.record[code]; // 直接按编码提取
    
    if (!data) {
      result.innerHTML = '<p>未找到该编码的手机信息</p>';
      result.style.display = 'block';
      return;
    }

    let photosHtml = '';
    if (data.photos && data.photos.length > 0) {
      photosHtml = data.photos.map(p => `<img src="${p}" alt="${code}">`).join('');
    }

    result.innerHTML = `
      <h2>${data.model}</h2>
      <p>编码：${data.code} ｜ 颜色：${data.color} ｜ 存储：${data.storage}</p>
      <p>${data.note || ''}</p>
      <div class="gallery">${photosHtml}</div>
      ${data.video ? `<a class="video-link" href="${data.video}" target="_blank">查看测试视频</a>` : ''}
    `;
    result.style.display = 'block';

    result.querySelectorAll('.gallery img').forEach(img => {
      img.addEventListener('click', () => {
        lightboxImg.src = img.src;
        lightbox.style.display = 'flex';
      });
    });
  } catch (err) {
    result.innerHTML = '<p>网络错误，请稍后再试</p>';
    result.style.display = 'block';
  }
});

lightbox.addEventListener('click', () => {
  lightbox.style.display = 'none';
  lightboxImg.src = '';
});
