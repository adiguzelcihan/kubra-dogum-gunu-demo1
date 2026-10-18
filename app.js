const $=s=>document.querySelector(s),root=$('#main');
const INTRO_KEY='kubra_intro_seen_v2';
const APP_KEY='kubra_app_state_v1';
const CHAPTER_KEY='kubra_chapter4_v2';
const NISAN_KEY='kubra_chapter3_v1';
const FIRST_KEY='kubra_chapter1_v1';
const contentData=window.KUBRA_CONTENT;
const QUOTE_KEY='kubra_current_quote_v1';
function pickEntryQuote(){
  const all=contentData.quotes;
  let recent=[];try{recent=JSON.parse(localStorage.getItem('kubra_quote_recent')||'[]')}catch{}
  const choices=all.map((_,i)=>i).filter(i=>!recent.includes(i));
  const pool=choices.length?choices:all.map((_,i)=>i);
  const n=pool[Math.floor(Math.random()*pool.length)];
  try{localStorage.setItem('kubra_quote_recent',JSON.stringify([...recent.slice(-Math.min(5,all.length-2)),n]))}catch{}
  return n;
}
let entryQuote=pickEntryQuote();
const ALBUM_PHOTOS=[
 ['İlk mesajımız','bolum-1/media/mesaj.jpg'],['Teklif anımız','bolum-4/media/IMG_4618.jpeg'],
 ['O akşam','bolum-4/media/IMG_4681.jpeg'],['Birlikte','bolum-4/media/IMG_4588.jpeg'],
 ['Bir hatıra','bolum-4/media/IMG_4586.jpeg'],['Özel anımız','bolum-4/media/IMG_4633.jpeg'],
 ['Gülümseyen anılar','bolum-4/media/IMG_4583.jpeg'],
 ...Array.from({length:8},(_,i)=>['Nişanımız · Fotoğraf '+String(i+1).padStart(2,'0'),'bolum-3/media/nisan-'+String(i+1).padStart(2,'0')+'.jpg'])
];
// Calendar-day selection is stable through tabs and reloads on the same day.
// Text screenshot is excluded from background photographs, but stays in the album.
function dailyPhoto(){const photos=ALBUM_PHOTOS.slice(1);const now=new Date();const day=Math.floor(Date.UTC(now.getFullYear(),now.getMonth(),now.getDate())/86400000);return photos[((day%photos.length)+photos.length)%photos.length];}

// Personal dates are stored on this device; the original five dates are defaults.
const CUSTOM_DATES_KEY='kubra_user_dates_v1';
function esc(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function getDates(){try{let stored=JSON.parse(localStorage.getItem(CUSTOM_DATES_KEY));if(Array.isArray(stored))return stored.filter(d=>d&&d.id&&d.title&&d.date)}catch{}return contentData.dates.map(d=>({...d}));}
function setDates(items){try{localStorage.setItem(CUSTOM_DATES_KEY,JSON.stringify(items));return true}catch(e){alert('Bu tarayıcı değişiklikleri kaydedemedi. Uygulamayı ZIP içinden değil, çıkardığın klasörden açmayı dene.');return false}}
function dateLabel(date,recurring){const [y,m,d]=date.split('-');return new Date(Number(y),Number(m)-1,Number(d)).toLocaleDateString('tr-TR',{day:'numeric',month:'long',...(recurring?{}:{year:'numeric'})});}
function dateInfo(event){
  const now=new Date(), base=new Date(event.date+'T12:00:00');
  const days=Math.floor((new Date(now.getFullYear(),now.getMonth(),now.getDate())-new Date(base.getFullYear(),base.getMonth(),base.getDate()))/86400000);
  if(event.recurring){let next=new Date(now.getFullYear(),base.getMonth(),base.getDate());if(next<new Date(now.getFullYear(),now.getMonth(),now.getDate()))next=new Date(now.getFullYear()+1,base.getMonth(),base.getDate());const left=Math.round((next-new Date(now.getFullYear(),now.getMonth(),now.getDate()))/86400000);return left===0?'Bugün! 🎉':left+' gün kaldı';}
  if(days===0)return 'Bugün ♡';
  return days>0?days+' gün önce':Math.abs(days)+' gün kaldı';
}
let timers=[];

function clearTimers(){timers.forEach(clearTimeout);timers=[]}
function safeGet(k){try{return localStorage.getItem(k)}catch{return null}}
function safeSet(k,v){try{localStorage.setItem(k,v)}catch{}}
function chapterInfo(){try{return JSON.parse(safeGet(CHAPTER_KEY)||'{}')}catch{return {}}}
function appState(){try{return JSON.parse(safeGet(APP_KEY)||'{}')}catch{return {tab:'home'}}}
function saveAppState(obj){safeSet(APP_KEY,JSON.stringify(obj))}
function header(showDate=true){
  return `<header class="top"><span class="brand">KÜBRA<span>.exe</span></span><span class="top-right">${showDate?'13.12.2026':'Bizim Evrenimiz'}</span></header>`
}

function showScene(idx){
  clearTimers();
  const scenes=[
    `<div class="glow">✦</div><p class="quote">Her hikâyenin bir başlangıcı vardır...</p>`,
    `<div class="glow">♡</div><div class="eyebrow">SADECE SANA ÖZEL</div><h1>Kübra...</h1><h2>Bu hikâyenin başrolü sensin.</h2>`
  ];
  root.innerHTML=header()+`<section class="welcome site-mode"><div class="skip-row"><button class="subtle" id="skip">Animasyonu Geç</button></div><div class="final-copy">${scenes[idx]}</div><span class="step-mark">${idx+1} / 2</span></section>`;
  $('#skip').onclick=showInvite;
  if(idx===0) timers.push(setTimeout(()=>showScene(1),3600));
  else timers.push(setTimeout(showInvite,4200));
}

function showInvite(){
  clearTimers();
  safeSet(INTRO_KEY,'1');
  root.innerHTML=header()+`<section class="welcome site-mode"><div class="final-copy invite-copy"><div class="eyebrow">13 ARALIK · SANA ÖZEL</div><h1>İyi ki doğdun, Kübra.</h1><h2>Bu sadece bugüne ait bir sürpriz değil.</h2><div class="small-rule"></div><p>Birlikte yaşadıklarımızı saklayabileceğimiz, yeni anılar biriktirebileceğimiz küçük bir yer hazırladım.</p><p>Burası yalnızca bir doğum günü sayfası değil...</p><p class="accent-line">Burası bizim hikâyemiz.</p><button class="cta" id="enter-app">Bizim Dünyamıza Gir →</button></div><div class="step-mark">KÜBRA & CİHAN · Sadece ikimizin alanı</div></section>`;
  $('#enter-app').onclick=()=>showApp('home');
}

function appShell(active,content){
  return `${header(false)}<section class="app-shell"><div class="app-content fade">${content}</div><nav class="bottom-nav" aria-label="Alt menü">
    ${navBtn('home','Ana Sayfa','⌂',active)}
    ${navBtn('story','Hikâyemiz','♡',active)}
    ${navBtn('games','Oyunlar','✦',active)}
    ${navBtn('photos','Fotoğraflar','▧',active)}
  </nav></section>`
}
function navBtn(id,label,icon,active){
  return `<button class="nav-btn ${active===id?'active':''}" data-tab="${id}" aria-current="${active===id?'page':'false'}"><span class="nav-icon">${icon}</span><span>${label}</span></button>`
}
function metrics(){const ch=chapterInfo();let first={};try{first=JSON.parse(safeGet(FIRST_KEY)||'{}')}catch{}const chapter1Done=!!first.done||Number(first.page)>=5;const chapter4Done=!!ch.letter||Number(ch.page)>=5;let nisan={};try{nisan=JSON.parse(safeGet(NISAN_KEY)||'{}')}catch{}const nisanDone=!!nisan.done;return {chapter1Done,chapter4Done,nisanDone,completed:Number(chapter1Done)+Number(chapter4Done)+Number(nisanDone)}}
function quickCard(title, body, actionLabel, href){
  return `<article class="panel action-card"><div><div class="mini-tag">SIRADAKİ ADIM</div><h3>${title}</h3><p>${body}</p></div>${href?`<a class="small-cta" href="${href}">${actionLabel} →</a>`:`<button class="small-cta disabled" disabled>${actionLabel}</button>`}</article>`
}

function showApp(tab='home'){
  clearTimers();
  const st=appState();
  st.tab=tab;
  saveAppState(st);
  const m=metrics();
  let content='';
  if(tab==='home'){
    const h=contentData.hero,days=getDates(),featured=[days.find(d=>d.id==='hello')||days[0],days.find(d=>d.id==='engagement')||days[1]].filter(Boolean);
    content=`<div class="home-v10">
      <section class="v10-photo-hero" style="--hero-image:url('${dailyPhoto()[1]}')"><div class="v10-hero-copy"><div class="v10-kicker">${h.eyebrow}</div><h1>${h.title}</h1><p>${h.description}</p></div></section>
      <section class="v10-section"><div class="v10-section-title"><h2>Özel Günlerimiz</h2><button type="button" data-open-dates>Tümünü Gör ↗</button></div><div class="v10-date-grid">${featured.map(d=>`<button type="button" class="v10-date-card" data-day="${d.id}"><span class="v10-date-icon">${d.icon}</span><span class="v10-date-label">${d.label}</span><strong>${d.title}</strong><small>${dateInfo(d)}</small></button>`).join('')}</div></section>
      
      
    </div>`;
  }else if(tab==='dates'){
    content=`<div class="v10-dates-page"><button class="v10-back" data-go="home">← Ana Sayfaya Dön</button><div class="v10-kicker">BİZİM TAKVİMİMİZ</div><div class="v15-heading"><h1>Özel Günlerimiz</h1></div><p class="v10-dates-intro">Birlikte biriktirdiğimiz ve heyecanla beklediğimiz tarihler.</p><div class="v10-all-dates">${getDates().map(d=>`<button class="v10-date-row" data-day="${esc(d.id)}"><span class="v10-date-icon">${esc(d.icon)}</span><span class="v10-date-detail"><strong>${esc(d.title)}</strong><small>${esc(d.label)}</small><em>${dateInfo(d)}</em></span><span class="v10-chevron">›</span></button>`).join('')}</div><div class="v16-add-footer"><button type="button" class="v15-add v16-add-btn" id="addSpecialDay">＋ Yeni Özel Gün Ekle</button></div></div><dialog id="dateDialog" class="v10-date-modal"><button class="v10-modal-close" data-close-day aria-label="Kapat">✕</button><div id="dateDialogBody"></div></dialog>
    <dialog id="editDateDialog" class="v10-date-modal v15-edit-dialog"><button type="button" class="v10-modal-close" id="closeEditDate" aria-label="Kapat">✕</button><h2 id="editDateHeading">Özel Gün Ekle</h2><form id="dateForm" class="v15-form"><input id="editDateId" type="hidden"><label>Başlık<input id="editDateTitle" maxlength="70" required placeholder="Örn: İlk Tatilimiz"></label><label>Tarih<input id="editDateValue" type="date" required></label><label>Simge<select id="editDateIcon"><option value="♡">♡ Kalp</option><option value="✦">✦ Yıldız</option><option value="◇">◇ Pırlanta</option><option value="✧">✧ Parıltı</option><option value="☀">☀ Güneş</option></select></label><label>Açıklama<textarea id="editDateDesc" rows="3" maxlength="400" placeholder="Bu tarihin sizin için anlamı..."></textarea></label><label class="v15-check"><input id="editDateRecurring" type="checkbox"> Her yıl tekrarlansın (doğum günü, yıldönümü gibi)</label><div class="v15-form-actions"><button type="button" id="deleteDate" class="v15-danger">Sil</button><button type="submit" class="v15-save">Kaydet</button></div><p class="v15-hint">Tarihler bu tarayıcıda saklanır. Başka telefona veya tarayıcıya kendiliğinden aktarılmaz.</p></form></dialog>`;
  }else if(tab==='story'){
    const items=[
      ['01 · 21 ŞUBAT 2026','Her Şey Böyle Başladı','İlk karşılaşma, ilk mesaj ve ilk buluşma.','bolum-1/index.html',m.chapter1Done?'✓ Tamamlandı':'Hazır'],
      ['02 · 28 HAZİRAN 2026','Bir Soru, Bir Ömür','Poyrazköy’de yaşadığımız o özel akşam.','bolum-4/index.html',m.chapter4Done?'✓ Tamamlandı':'Hazır'],
      ['03 · 22 AĞUSTOS 2026','Nişanımız','Birlikte attığımız yeni adımın anıları.','bolum-3/index.html',m.nisanDone?'✓ Tamamlandı':'Hazır'],
      ['04 · GELECEKTE','Düğünümüz ♡','Bu bölümü o güzel gün geldiğinde birlikte dolduracağız.',null,'Gelecekte açılacak']
    ];
    content=`<div class="v11-stories"><div class="v11-story-header"><div class="v10-kicker">HİKÂYEMİZ</div><h1>Bölümler</h1><p>Birlikte yazdığımız dört büyük hatıra.</p></div><div class="v11-story-list">${items.map((it,i)=>`<article class="v11-story-row ${it[3]?'':'is-locked'}"><div class="v11-story-num">${String(i+1).padStart(2,'0')}</div><div class="v11-story-detail"><small>${it[0].split(' · ')[1]}</small><h2>${it[1]}</h2><span class="v11-status">${it[4]}</span></div>${it[3]?`<a class="v11-story-open" href="${it[3]}" aria-label="${it[1]} bölümünü aç">↗</a>`:`<span class="v11-story-locked">♡</span>`}</article>`).join('')}</div></div>`;
  }else if(tab==='games'){
    const items=[
      ['01','Beni Ne Kadar Tanıyorsun?','Birbirimizi ne kadar iyi tanıdığımızı ölçen keyifli sorular.'],
      ['02','Siyah İnci Kararı','Siyah İnci’nin gerçek sahibini belirleyecek eğlenceli oyun.'],
      ['03','Fotoğraf Hafızası','Fotoğraflarla anılarımızı eşleştireceğimiz küçük oyun.']
    ];
    content=`<div class="fit-page"><div class="compact-head"><div class="eyebrow">OYUNLAR</div><h1>Oyun Zamanı</h1><p>Buradaki eğlence yakında başlıyor.</p></div><div class="paged-wrap"><div class="chapter-card-main locked-card" id="gameCard"></div><div class="pager"><button data-page-prev aria-label="Önceki oyun">←</button><span id="gameCount">1 / 3</span><button data-page-next aria-label="Sonraki oyun">→</button></div></div></div>`;
    root.innerHTML=appShell(tab,content);let idx=0;function draw(){const it=items[idx];root.querySelector('#gameCard').innerHTML=`<div class="meta">OYUN ${it[0]}</div><h2>${it[1]}</h2><p>${it[2]}</p><span class="chip">Yakında</span>`;root.querySelector('#gameCount').textContent=(idx+1)+' / 3';}
    root.querySelector('[data-page-prev]').onclick=()=>{idx=(idx+2)%3;draw()};
    root.querySelector('[data-page-next]').onclick=()=>{idx=(idx+1)%3;draw()};draw();
  }else if(tab==='photos'){
    const albums=[
      {id:'hello',title:'İlk Mesajımız',date:'21 Şubat 2026',cover:'bolum-1/media/mesaj.jpg',images:ALBUM_PHOTOS.slice(0,1)},
      {id:'proposal',title:'Evlilik Teklifimiz',date:'28 Haziran 2026',cover:'bolum-4/media/IMG_4618.jpeg',images:ALBUM_PHOTOS.slice(1,7)},
      {id:'engagement',title:'Nişanımız',date:'22 Ağustos 2026',cover:'bolum-3/media/nisan-01.jpg',images:ALBUM_PHOTOS.slice(7)},
      {id:'wedding',title:'Düğünümüz',date:'Birlikte yazacağız',cover:'',images:[]}
    ];
    content=`<div class="v12-album"><div class="v12-album-heading"><span class="v10-kicker">KÜBRA & CİHAN</span><h1>Fotoğraf Albümümüz</h1><p>Biriktirdiğimiz anıların her biri ayrı bir hikâye.</p></div><div class="v12-album-categories" id="albumCategories"></div><div id="albumInside" hidden><button type="button" class="v12-album-back" id="albumBack">← Tüm albümler</button><div class="v12-album-subhead"><h2 id="albumTitle"></h2><small id="albumSubtitle"></small></div><div class="v12-photo-grid" id="albumPhotoGrid"></div></div></div>
    <dialog id="photoViewer" class="photo-dialog v12-photo-dialog"><button id="closePhoto" class="photo-close" aria-label="Fotoğrafı kapat">✕</button><img id="photoBig" alt=""><div class="photo-controls"><button type="button" data-photo-prev>← Önceki</button><button type="button" data-photo-next>Sonraki →</button></div><div id="photoCaption" class="photo-caption"></div></dialog>`;
    root.innerHTML=appShell(tab,content);
    const categories=root.querySelector('#albumCategories'),inside=root.querySelector('#albumInside'),viewer=root.querySelector('#photoViewer');
    let active=albums[0],selected=0;
    function coverCards(){categories.innerHTML=albums.map((album,i)=>`<button type="button" class="v12-album-card ${album.images.length?'':'is-locked'}" data-album="${i}" ${album.images.length?'':'disabled'} aria-label="${album.title}${album.images.length?', '+album.images.length+' fotoğraf':' yakında'}"><div class="v12-album-cover" ${album.cover?`style="background-image:linear-gradient(0deg,#101925eb,#10192517),url('${album.cover}')"`:''}>${!album.cover?'<span class="v12-album-placeholder">♡</span>':''}<div class="v12-album-cover-copy"><small>${album.date}</small><strong>${album.title}</strong><span>${album.images.length?album.images.length+' fotoğraf':'Yakında'}</span></div></div></button>`).join('');categories.querySelectorAll('[data-album]').forEach(btn=>btn.onclick=()=>openAlbum(Number(btn.dataset.album)));}
    function openAlbum(index){active=albums[index];if(!active.images.length)return;categories.hidden=true;inside.hidden=false;root.querySelector('#albumTitle').textContent=active.title;root.querySelector('#albumSubtitle').textContent=active.date+' · '+active.images.length+' fotoğraf';root.querySelector('#albumPhotoGrid').innerHTML=active.images.map(([label,src],i)=>`<button class="v12-photo-tile" type="button" data-photo="${i}" aria-label="${label} fotoğrafını aç"><img src="${src}" alt="${label}" loading="lazy"></button>`).join('');root.querySelectorAll('[data-photo]').forEach(btn=>btn.onclick=()=>show(Number(btn.dataset.photo)));root.querySelector('.app-content').scrollTop=0;}
    function show(i){selected=(i+active.images.length)%active.images.length;const [label,src]=active.images[selected];root.querySelector('#photoBig').src=src;root.querySelector('#photoBig').alt=label;root.querySelector('#photoCaption').textContent=label+' · '+(selected+1)+' / '+active.images.length;if(!viewer.open)viewer.showModal();}
    root.querySelector('#albumBack').onclick=()=>{inside.hidden=true;categories.hidden=false;root.querySelector('.app-content').scrollTop=0;};
    root.querySelector('#closePhoto').onclick=()=>viewer.close();
    root.querySelector('[data-photo-prev]').onclick=()=>show(selected-1);
    root.querySelector('[data-photo-next]').onclick=()=>show(selected+1);
    viewer.onclick=e=>{if(e.target===viewer)viewer.close()};
    coverCards();

  }
  if(tab==='home'||tab==='dates'||tab==='story')root.innerHTML=appShell(tab,content);
  root.querySelectorAll('[data-tab]').forEach(btn=>btn.onclick=()=>showApp(btn.dataset.tab));
  root.querySelectorAll('[data-go]').forEach(btn=>btn.onclick=()=>showApp(btn.dataset.go));
  root.querySelectorAll('[data-open-dates]').forEach(btn=>btn.onclick=()=>showApp('dates'));
  root.querySelectorAll('[data-day]').forEach(btn=>btn.onclick=()=>{
    const d=getDates().find(x=>x.id===btn.dataset.day);if(!d)return;
    if(tab!=='dates'){showApp('dates');const target=root.querySelector(`[data-day="${d.id}"]`);if(target)target.click();return;}
    const dlg=root.querySelector('#dateDialog');if(!dlg)return;
    root.querySelector('#dateDialogBody').innerHTML=`<div class="v10-kicker">ÖZEL BİR HATIRA</div><div class="v10-modal-icon">${esc(d.icon)}</div><h2>${esc(d.title)}</h2><p class="v10-modal-date">${esc(d.label)}</p><strong class="v10-modal-count">${dateInfo(d)}</strong><p>${esc(d.desc||'')}</p><button type="button" class="v15-edit-button" id="editThisDate">✎ Düzenle</button>${d.href?`<a class="v10-modal-link" href="${d.href}">Bu bölümü aç →</a>`:''}`;
    dlg.showModal();
    root.querySelector('#editThisDate').onclick=()=>{dlg.close();openDateEditor(d.id)};
    root.querySelector('[data-close-day]').onclick=()=>dlg.close();
    dlg.onclick=e=>{if(e.target===dlg)dlg.close()};
  });
  if(tab==='dates'){
    const dialog=root.querySelector('#editDateDialog'), form=root.querySelector('#dateForm');
    root.querySelector('#addSpecialDay').onclick=()=>openDateEditor(null);
    root.querySelector('#closeEditDate').onclick=()=>dialog.close();
    dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
    form.onsubmit=e=>{e.preventDefault();const title=root.querySelector('#editDateTitle').value.trim(), date=root.querySelector('#editDateValue').value;
      if(!title||!/^\d{4}-\d{2}-\d{2}$/.test(date))return;
      const id=root.querySelector('#editDateId').value||'custom-'+Date.now();const items=getDates(),old=items.find(x=>x.id===id);
      const recurring=root.querySelector('#editDateRecurring').checked;
      const item={...old,id,title,date,recurring,label:dateLabel(date,recurring),icon:root.querySelector('#editDateIcon').value,desc:root.querySelector('#editDateDesc').value.trim()};
      const ix=items.findIndex(x=>x.id===id);if(ix===-1)items.push(item);else items[ix]=item;
      if(setDates(items)){dialog.close();showApp('dates')}
    };
    root.querySelector('#deleteDate').onclick=()=>{const id=root.querySelector('#editDateId').value;if(!id)return;
      if(confirm('Bu özel günü silmek istiyor musun?')){const items=getDates().filter(x=>x.id!==id);if(setDates(items)){dialog.close();showApp('dates')}}};
  }

}
function openDateEditor(id){const dlg=root.querySelector('#editDateDialog');if(!dlg)return;
  const item=id?getDates().find(d=>d.id===id):null;
  root.querySelector('#editDateHeading').textContent=item?'Özel Günü Düzenle':'Özel Gün Ekle';
  root.querySelector('#editDateId').value=item?.id||'';
  root.querySelector('#editDateTitle').value=item?.title||'';
  root.querySelector('#editDateValue').value=item?.date||'';
  root.querySelector('#editDateIcon').value=item?.icon||'♡';
  root.querySelector('#editDateDesc').value=item?.desc||'';
  root.querySelector('#editDateRecurring').checked=!!item?.recurring;
  root.querySelector('#deleteDate').hidden=!item;
  dlg.showModal();
}

if(safeGet(INTRO_KEY)) showApp((appState().tab==='surprises'?'photos':appState().tab)||'home');
else showScene(0);
