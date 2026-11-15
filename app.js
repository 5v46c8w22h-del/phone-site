let db = {};

fetch('data.json')
  .then(r => r.json())
  .then(d => { db = d; })
  .catch(err => console.error('data.json 加载失败', err));

const input = document.getElementById('search');
const result = document.getElementById('result');
const lightbox = document.getElementById('lightbox');
const lightboxImg = lightbox.querySelector('img');

input.addEventListener('input', () => {
  const code = input.value.trim().toUpperCase();
  if (!code) { result.innerHTML = ''; return; }

  const item = db[code];
  if (!item) {
    result.innerHTML = '<p>未找到该编码</p>';
    return;
  }

  result.innerHTML = `
    <h2>${item.model}</h2>
    <p>编码：${item.code} ｜ 颜色：${item.color} ｜ 存储：${item.storage}</p>
    <p>${item.note || ''}</p>
    <div class="gallery">
      ${item.photos.map(p => `<img src="${p}" alt="${item.code}">`).join('')}
    </div>
    <a class="video-link" href="${item.video}" target="_blank" rel="noopener">查看测试视频</a>
  `;

  result.querySelectorAll('.gallery img').forEach(img => {
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightbox.style.display = 'flex';
    });
  });
});

lightbox.addEventListener('click', () => {
  lightbox.style.display = 'none';
  lightboxImg.src = '';
});