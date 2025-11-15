let showOptions = false;  // 改為預設不顯示
const boxSize = 100;
const spacing = 10;

// 新增 iframe 相關變數與左側空間
let iframeDiv;
let showIframe = false;
const leftMargin = 130; // 留 130px 給左側按鈕區域
let cnv; // 新增 canvas 變數
let overlayDivs = []; // 新增 overlay divs 用來接收點擊，確保按鈕在 iframe 上方仍可點擊
const classworkURL = 'https://jjjjiu999.github.io/-/'; // 新增目標網址常數
const notesURL = 'https://hackmd.io/@jjjjiu/rJM3_J96le'; // 新增課堂筆記網址
let currentContent = ''; // 'classwork' | 'notes' | ''
let closeDiv; // 新增關閉按鈕
let openDiv; // 新增：在新分頁開啟按鈕

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  cnv.position(0, 0);
  cnv.style('display', 'block');
  cnv.style('z-index', '0');
  cnv.elt.style.margin = '0';
  cnv.elt.style.padding = '0';

  // 建立 iframe（預設隱藏），先不給 src，按需載入
  iframeDiv = createDiv('<iframe src="" width="100%" height="100%" frameborder="0" style="border:0;background:transparent;" allow="fullscreen" loading="lazy" referrerpolicy="no-referrer"></iframe>');
  iframeDiv.style('position', 'fixed');
  iframeDiv.style('z-index', '9998'); // 比 overlay 低，overlay 可在上方接收點擊
  iframeDiv.style('pointer-events', 'auto');
  iframeDiv.hide();

  // 建立四個透明 overlay div 放在左側按鈕位置，用於接收點擊（確保按鈕在 iframe 上方仍可點擊）
  const options = ['自我介紹', '課堂作品', '課堂筆記', '測驗題'];
  for (let i = 0; i < 4; i++) {
    let d = createDiv(''); // 透明的點擊區
    d.style('position', 'fixed');
    d.style('left', '10px');
    d.style('top', (10 + i * (boxSize + spacing)) + 'px');
    d.style('width', boxSize + 'px');
    d.style('height', boxSize + 'px');
    d.style('background', 'transparent');
    d.style('z-index', '10001'); // 置於 iframe 之上（提高一級以保險）
    d.style('cursor', 'pointer'); // 加上游標提示
    d.style('pointer-events', 'auto'); // 確保能接收點擊事件
    // 綁定點擊事件：按下後顯示（不再切換隱藏）
    ((idx) => {
      d.mousePressed(() => {
        if (idx === 1) { // 課堂作品：按下後顯示並停留
          showIframe = true;
          currentContent = 'classwork';
          const ifr = iframeDiv.elt.querySelector('iframe');
          if (ifr) ifr.src = classworkURL; // 載入課堂作品
          updateIframePosition();
          iframeDiv.show();
          if (closeDiv) closeDiv.show();
          if (openDiv) openDiv.show(); // 顯示 open 按鈕
        } else if (idx === 2) { // 課堂筆記：按下後顯示筆記
          showIframe = true;
          currentContent = 'notes';
          const ifr = iframeDiv.elt.querySelector('iframe');
          if (ifr) ifr.src = notesURL; // 載入課堂筆記
          updateIframePosition();
          iframeDiv.show();
          if (closeDiv) closeDiv.show();
          if (openDiv) openDiv.show(); // 顯示 open 按鈕
        } else {
          console.log(options[idx]);
        }
      });
    })(i);
    overlayDivs.push(d);
  }

  // 建立關閉按鈕（預設隱藏），顯示時置於 iframe 之上
  closeDiv = createDiv('✕');
  closeDiv.style('position', 'fixed');
  closeDiv.style('z-index', '10002');
  closeDiv.style('background', 'rgba(0,0,0,0.6)');
  closeDiv.style('color', '#fff');
  closeDiv.style('width', '28px');
  closeDiv.style('height', '28px');
  closeDiv.style('line-height', '28px');
  closeDiv.style('text-align', 'center');
  closeDiv.style('border-radius', '14px');
  closeDiv.style('cursor', 'pointer');
  closeDiv.style('display', 'none');
  closeDiv.mousePressed(() => {
    // 點擊關閉：隱藏 iframe 並清空 src
    showIframe = false;
    currentContent = '';
    const ifr = iframeDiv.elt.querySelector('iframe');
    if (ifr) ifr.src = '';
    iframeDiv.hide();
    closeDiv.hide();
    if (openDiv) openDiv.hide(); // 同步隱藏 open 按鈕
  });

  // 新增：建立「在新分頁開啟」按鈕（預設隱藏）
  openDiv = createDiv('↗');
  openDiv.style('position', 'fixed');
  openDiv.style('z-index', '10002');
  openDiv.style('background', 'rgba(0,0,0,0.6)');
  openDiv.style('color', '#fff');
  openDiv.style('width', '28px');
  openDiv.style('height', '28px');
  openDiv.style('line-height', '28px');
  openDiv.style('text-align', 'center');
  openDiv.style('border-radius', '14px');
  openDiv.style('cursor', 'pointer');
  openDiv.style('display', 'none');
  openDiv.mousePressed(() => {
    let url = '';
    if (currentContent === 'classwork') url = classworkURL;
    else if (currentContent === 'notes') url = notesURL;
    if (url) {
      window.open(url, '_blank'); // 在新分頁開啟（備援）
    }
  });

  // 設定初始 iframe 位置（不可見時也先設定）
  updateIframePosition();
}

function draw() {
  background(200, 177, 228);
  
  // 檢查滑鼠是否在選項區域內
  let hoverLeft = (mouseX < 110 && mouseX > 0 && mouseY > 0 && mouseY < 450);
  // 顯示條件：滑鼠靠近或 iframe 正顯示
  showOptions = hoverLeft || showIframe;
  
  if (showOptions) {
    const options = ['自我介紹', '課堂作品', '課堂筆記', '測驗題'];
    for (let i = 0; i < 4; i++) {
      fill(173, 216, 230);
      noStroke();
      drawStar(60, 60 + (i * (boxSize + spacing)), 50); // 繪製星型
      
      fill(255); // 將文字顏色改為白色
      textAlign(CENTER, CENTER);
      textSize(16);
      text(options[i], 60, 60 + (i * (boxSize + spacing)));
    }
  }
}

// 新增繪製星型的函數
function drawStar(x, y, radius) {
  let angle = TWO_PI / 5;
  let halfAngle = angle/2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius;
    let sy = y + sin(a) * radius;
    vertex(sx, sy);
    sx = x + cos(a+halfAngle) * (radius/2);
    sy = y + sin(a+halfAngle) * (radius/2);
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

function updateIframePosition() {
  // 計算 iframe 寬高，置中於右側可用區域（保留 leftMargin）
  const maxWidth = windowWidth - leftMargin - 40; // 留些空白
  const maxHeight = windowHeight - 80;
  const w = Math.max(300, Math.min(maxWidth, 1000));
  const h = Math.max(200, Math.min(maxHeight, Math.round(w * 0.66)));
  const left = leftMargin + Math.round((windowWidth - leftMargin - w) / 2);
  const top = Math.round((windowHeight - h) / 2);
  iframeDiv.style('left', left + 'px');
  iframeDiv.style('top', top + 'px');
  iframeDiv.style('width', w + 'px');
  iframeDiv.style('height', h + 'px');
  iframeDiv.elt.style.borderRadius = '8px';
  iframeDiv.elt.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
  // 更新關閉按鈕位置（置於 iframe 右上角）
  if (closeDiv) {
    closeDiv.style('left', (left + w - 20) + 'px');
    closeDiv.style('top', (top + 8) + 'px');
    closeDiv.style('display', showIframe ? 'block' : 'none');
  }
  // 更新 open 按鈕位置（置於關閉按鈕左側）
  if (openDiv) {
    openDiv.style('left', (left + w - 56) + 'px');
    openDiv.style('top', (top + 8) + 'px');
    openDiv.style('display', showIframe ? 'block' : 'none');
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  if (cnv) {
    cnv.position(0, 0);
    cnv.size(windowWidth, windowHeight);
  }
  // 調整 overlay 與 iframe 位置
  if (iframeDiv) {
    updateIframePosition();
  }
  for (let i = 0; i < overlayDivs.length; i++) {
    overlayDivs[i].style('top', (10 + i * (boxSize + spacing)) + 'px');
  }
}

function mouseClicked() {
  // 保留原本 canvas 的點擊回報；如果點擊左側按鈕區則以「顯示」為主（不隱藏）
  for (let i = 0; i < 4; i++) {
    if (mouseX > 10 && mouseX < 10 + boxSize &&
        mouseY > 10 + (i * (boxSize + spacing)) &&
        mouseY < 10 + (i * (boxSize + spacing)) + boxSize) {
      if (i === 1) { // 課堂作品
        showIframe = true;
        currentContent = 'classwork';
        const ifr = iframeDiv.elt.querySelector('iframe');
        if (ifr) ifr.src = classworkURL;
        updateIframePosition();
        iframeDiv.show();
        if (closeDiv) closeDiv.show();
        if (openDiv) openDiv.show(); // 顯示 open 按鈕
      } else if (i === 2) { // 課堂筆記
        showIframe = true;
        currentContent = 'notes';
        const ifr = iframeDiv.elt.querySelector('iframe');
        if (ifr) ifr.src = notesURL;
        updateIframePosition();
        iframeDiv.show();
        if (closeDiv) closeDiv.show();
        if (openDiv) openDiv.show(); // 顯示 open 按鈕
      } else {
        console.log(['自我介紹', '課堂作品', '課堂筆記', '測驗題'][i]);
      }
    }
  }
}
