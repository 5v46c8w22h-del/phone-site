const input = document.getElementById('search');
const result = document.getElementById('result');
const lightbox = document.getElementById('lightbox');
const lightboxImg = lightbox.querySelector('img');

input.addEventListener('input', async () => {
  const code = input.value.trim().toUpperCase();
  if (!code) { result.innerHTML = ''; return; }

  try {
    // 注意这里：去中文的“数据”文件夹找 001.md 文件
    const res = await fetch(`数据/${code}.md`);
    if (res.ok) {
      const text = await res.text();
      // 用正则提取内容
      const data = parseMarkdownData(text);
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

// 解析 Markdown 格式数据的工具
function parseMarkdownData(text) {
  const data = {};
  // 匹配 --- 开头和 --- 结尾的配置
  const matches = text.match(/^---[\s\S]*?---/);
  if (matches) {
    const lines = matches[0].split('\n');
    lines.forEach(line => {
      if (line.includes(':')) {
        const index = line.indexOf(':');
        const key = line.substring(0, index).trim();
        let val = line.substring(index + 1).trim().replace(/^["']|["']$/g, '');
        if (key === 'photos') {
           data.photos = [val]; 
        } else {
           data[key] = val;
        }
      }
    });
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
