const input = document.getElementById('search');
const result = document.getElementById('result');
const lightbox = document.getElementById('lightbox');
const lightboxImg = lightbox.querySelector('img');

// 直接把刚刚截图里的数据写死在这里测试
const mockData = {
  "001": {
    code: "001",
    model: "苹果吓人",
    color: "白色",
    storage: "64G",
    note: "",
    video: "123",
    photos: ["/photos/pasted-image-1794799108720.png"]
  }
};

input.addEventListener('input', () => {
  const code = input.value.trim(); // 不做转大写，直接匹配
  if (!code) { result.innerHTML = ''; return; }

  const item = mockData[code];
  
  if (!item) {
    result.innerHTML = '<p>未找到该编码的手机信息</p>';
    result.style.display = 'block';
    return;
  }

  // 直接渲染
  let photosHtml = '';
  if (item.photos && item.photos.length > 0) {
      photosHtml = item.photos.map(p => `<img src="${p}" alt="${code}">`).join('');
  }

  result.innerHTML = `
    <h2>${item.model}</h2>
    <p>编码：${item.code} ｜ 颜色：${item.color} ｜ 存储：${item.storage}</p>
    <div class="gallery">${photosHtml}</div>
    <a class="video-link" href="${item.video}" target="_blank">查看测试视频</a>
  `;
  result.style.display = 'block';

  // 绑定图片放大
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
