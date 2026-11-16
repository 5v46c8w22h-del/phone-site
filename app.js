const input = document.getElementById('search');
const result = document.getElementById('result');
const lightbox = document.getElementById('lightbox');
const lightboxImg = lightbox.querySelector('img');

input.addEventListener('input', async () => {
  const code = input.value.trim();
  if (!code) { result.innerHTML = ''; return; }

  try {
    // 自动去 data 文件夹找对应的 Markdown 文件
    const res = await fetch(`data/${code}.md`);
    
    if (!res.ok) {
      result.innerHTML = '<p>未找到该编码的手机信息</p>';
      result.style.display = 'block';
      return;
    }
    
    const text = await res.text();
    const data = parseMarkdown(text);
    
    if (!data.model) {
      result.innerHTML = '<p>数据解析失败，请检查后台格式</p>';
      return;
    }
    
    renderResult(data, code);
  } catch (err) {
    result.innerHTML = '<p>网络错误，请刷新重试</p>';
    result.style.display = 'block';
  }
});

// 自动解析后台生成的数据，并自动修正图片路径
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
         if (val) {
             // 【核心修复】自动把带绝对路径的 /photos/xxx 修正为相对路径 photos/xxx
             let fixedPath = val;
             if (val.startsWith('/')) {
                 fixedPath = val.substring(1); // 去掉开头的斜杠
             }
             data.photos.push(fixedPath);
         }
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
