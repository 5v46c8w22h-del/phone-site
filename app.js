const input = document.getElementById('search');
const result = document.getElementById('result');
const lightbox = document.getElementById('lightbox');
const lightboxImg = lightbox.querySelector('img');

input.addEventListener('input', async () => {
  const code = input.value.trim().toUpperCase();
  if (!code) { result.innerHTML = ''; return; }

  try {
    // 直接去 data 文件夹找对应的 json 文件
    const res = await fetch(`data/${code}.json`);
    if (res.ok) {
      const data = await res.json();
      renderResult(data, code);
    } else {
      result.innerHTML = '<p>未找到该编码的手机信息</p>';
      result.style.display = 'block';
    }
  } catch (err) {
    result.innerHTML = '<p>未找到该编码的手机信息</p>';
    result.style.display = 'block';
  }
});

function renderResult(item, code) {
  if (!item || !item.model) {
    result.innerHTML = '<p>未找到该编码的手机信息</p>';
    result.style.display = 'block';
    return;
  }

  // 处理图片列表
  let photosHtml = '';
  if (item.photos && item.photos.length > 0) {
     photosHtml = item.photos.map(p => `<img src="${p}" alt="${code}">`).join('');
  }

  result.innerHTML = `
    <h2>${item.model}</h2>
    <p>编码：${code} ｜ 颜色：${item.color || '未知'} ｜ 存储：${item.storage || '未知'}</p>
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
}

lightbox.addEventListener('click', () => {
  lightbox.style.display = 'none';
  lightboxImg.src = '';
});
