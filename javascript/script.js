document.querySelector('.wechat').addEventListener('click', (e) => {
    e.preventDefault();
    alert('微信二维码功能需后端支持');
  });


  // 简单加载动画控制
  window.addEventListener('load', () => {
      document.querySelector('.loader').style.display = 'none';
  });

  // 图片点击放大效果
  document.querySelectorAll('.card-header img').forEach(img => {
      img.onclick = () => {
          img.classList.toggle('zoomed');
      }
  });
