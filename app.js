const input = document.getElementById('search');
const result = document.getElementById('result');
const lightbox = document.getElementById('lightbox');
const lightboxImg = lightbox.querySelector('img');

input.addEventListener('input', async () => {
  const code = input.value.trim(); // 去掉转大写，因为有些编码可能是小写
  if (!code) { result.innerHTML = ''; return; }

  try {
    // 直接请求 data 文件夹下的 md 文件
    const res = await fetch(`data/${code}.md`);
    
    if (!res.ok) {
      result.innerHTML = '<p>未找到该编码的手机信息</p>';
      result.style.display = 'block';
      return;
    }
    
    const text = await res.text();
    const data = parseMarkdown(text);
    
    if (!data.model) {
        // 如果解析出来没有 model，直接把原文显示出来看错在哪
        result.innerHTML = `<p style="color:red;">找到了文件，但解析失败，原文如下：</p><pre style="background:#eee;padding:10px;text-align:left;">${text}</pre>`;
        result.style.display = 'block';
        return;
    }
    
    renderResult(data, code);
  } catch (err) {
    result.innerHTML = '<p>未找到该编码的手机信息</p>';
    result.style.display = 'block';
  }
});

// 暴力提取 Markdown 里的字段
function parseMarkdown(text) {
  const data = {};
  const lines = text.split('\n');
  let inFrontmatter = false;
  
  for (let line of lines) {
    line = line.trim();
    if (line === '---') {
      if (!inFrontmatter) { inFrontmatter = true; continue; }
      else break; // 遇到第二个 --- 就结束
    }
    if (inFrontmatter && line.includes(':')) {
      const idx = line.indexOf(':');
      const key = line.substring(0, idx).trim();
      let val = line.substring(idx + 1).trim();
      
      // 清理掉两边的引号
      val = val.replace(/^["']|["']$/g, '');
      
      // 如果是照片列表
      if (key === 'photos') {
         if (!data.photos) data.photos = [];
         if (val) data.photos.push(val);
      } else if (key === 'image') {
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
  // 有些后台可能把编码解析为 code 字段，这里做兼容
  const displayCode = item.code || code;
  
  result.innerHTML = `
    <h2>${item.model}</h2>
    <p>编码：${displayCode} ｜ 颜色：${item.color || '未知'} ｜ 存储：${item.storage || '未知'}</p>
    <p>${item.note || ''}</p>
    <div class="gallery">
      ${(item.photos || []).map(p => `<img src="${p}" alt="${displayCode}">`).join('')}
    </div>
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
