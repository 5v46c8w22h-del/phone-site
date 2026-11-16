const input = document.getElementById('search');
const result = document.getElementById('result');
const lightbox = document.getElementById('lightbox');
const lightboxImg = lightbox.querySelector('img');

// 这里是你的数据库。以后在后台加了新手机，直接在这里加一段即可。
const db = {
  "001": {
    code: "001",
    model: "苹果吓人",
    color: "白色",
    storage: "64G",
    note: "测试备注",
    video: "https://www.bilibili.com",
    // 注意这里：因为你的文件在 photos 文件夹里，所以路径必须带上 photos/
    photos: ["photos/pasted-image-1794799108720.png"]
  }
};

input.addEventListener('input', () => {
  const code = input.value.trim(); 
  if (!code) { result.innerHTML = ''; return; }

  const item = db[code];
  
  if (!item) {
    result.innerHTML = '<p>未找到该编码的手机信息</p>';
    result.style.display = 'block';
    return;
  }

  let photosHtml = '';
  if (item.photos && item.photos.length > 0) {
      photosHtml = item.photos.map(p => `<img src="${p}" alt="${code}">`).join('');
  }

  result.innerHTML = `
    <h2>${item.model}</h2>
    <p>编码：${item.code} ｜ 颜色：${item.color} ｜ 存储：${item.storage}</p>
    <p>${item.note || ''}</p>
    <div class="gallery">${photosHtml}</div>
    ${item.video ? `<a class="video-link" href="${item.video}" target="_blank" rel="noopener">查看测试视频</a>` : ''}
  `;
  result.style.display = 'block';

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
