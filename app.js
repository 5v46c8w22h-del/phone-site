const input = document.getElementById('search');
const result = document.getElementById('result');
const lightbox = document.getElementById('lightbox');
const lightboxImg = lightbox.querySelector('img');

// 这里不再写死数据，而是直接去读取 data 文件夹里的 001.md
input.addEventListener('input', async () => {
  const code = input.value.trim(); 
  if (!code) { result.innerHTML = ''; return; }

  try {
    const res = await fetch(`data/${code}.md`);
    
    if (!res.ok) {
      result.innerHTML = '<p>未找到该编码的手机信息</p>';
      result.style.display = 'block';
      return;
    }
    
    const text = await res.text();
    const data = parseMarkdown(text);
    
    if (!data.model) {
        result.innerHTML = `<p style="color:red;">解析失败</p>`;
        return;
    }
    
    renderResult(data, code);
  } catch (err) {
    result.innerHTML = '<p>未找到该编码的手机信息</p>';
    result.style.display = 'block';
  }
});

// 这个解析器现在能完美识别图片数组
function parseMarkdown(text) {
  const data = {};
  const lines = text.split('\n');
  let inFrontmatter = false;
  
  for (let line of lines) {
    line = line.trim();
    if (line === '---') {
      if (!inFrontmatter) { inFrontmatter = true; continue; }
      else break;
    }
    if (inFrontmatter && line.includes(':')) {
      const idx = line.indexOf(':');
      const key = line.substring(0, idx).trim();
      let val = line.substring(idx + 1).trim().replace(/^["']|["']$/g, '');
      
      if (key === 'photos') {
         if (!data.photos) data.photos = [];
         if (val) data.photos.push(val);
      } else {
         data[key] = val;
      }
    }
  }
  return data;
}

function renderResult(item, code) {
  let photosHtml = '';
  if (item.photos && item.photos.length > 0) {
      // 这里直接用后台生成的完整路径（如果后台存的是 /photos/xxx.png 就完美了）
      photosHtml = item.photos.map(p => `<img src="${p}" alt="${code}">`).join('');
  }

  result.innerHTML = `
    <h2>${item.model}</h2>
    <p>编码：${item.code || code} ｜ 颜色：${item.color || '未知'} ｜ 存储：${item.storage || '未知'}</p>
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
