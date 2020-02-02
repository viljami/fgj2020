import qr from '../sound/fgj2020.png';

window.addEventListener('load', function load() {
  window.removeEventListener('load', load);
  const img = document.createElement('img');
  img.src = qr;
  document.getElementById('qr').appendChild(img);
});
