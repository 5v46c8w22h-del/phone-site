let db = {};

// 兜底加载老数据
fetch('data.json')
  .then(r => r.json())
  .then(d => { db = d; })
  .catch(() => {});

const input = document.getElementById('search');
const result = document.getElementById('result');
const lightbox = document.getElementById('lightbox');
const lightboxImg = lightbox.querySelector('img');

input.addEventListener('input', async () => {
  const code = input.value.trim().toUpperCase();
  if (!code) { result.innerHTML = ''; return; }

  try {
    const res = await fetch(`data/${code}.md`);
    if (res.ok) {
      const text = await res.text();
      const data = parseMarkdown(text);
      renderResult(data, code);
    } else {
      if (db[code]) renderResult(db[code], code);
      else { result.innerHTML = '<p>未找到该编码的手机信息</p>'; result.style.display = 'block'; }
    }
  } catch (err) {
    if (db[code]) renderResult(db[code], code);
    else { result.innerHTML = '<p>未找到该编码的手机信息</p>'; result.style.display = 'block'; }
  }
});

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
      const index = line.indexOf(':');
      const key = line.substring(0, index).trim();
      let val = line.substring(index + 1).trim();
      val = val.replace(/^["']|["']$/g, ''); // 去掉引号
      if (key === 'photos') {
        data[key] = [val];
      } else {
        data[key] = val;
      }
    }
  }
  return data;
}

function renderResult(item, code) {
  if (!item || !item.model) {
    result.innerHTML = '<p>未找到该编码的手机信息</p>';
    result.style.display = 'block';
    return;
  }

  result.innerHTML = `
    <h2>${item.model}</h2>
    <p>编码：${code} ｜ 颜色：${item.color || '未知'} ｜ 存储：${item.storage || '未知'}</p>
    <p>${item.note || ''}</p>
    <div class="gallery">
      ${(item.photos || []).map(p => `<img src="${p}" alt="${code}">`).join('')}
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
