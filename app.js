(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  let profile = {name:'', age:'', skinType:'', activityLevel:'', conditions:'', allergies:'', foodPrefs:'', limitations:''};
  let water = 0, sleep = 0, movement = 0, mood = '—', doctor = 'sara', lang = 'ar';
  const toast = (msg) => { const el=$('#toast'); el.textContent=msg; el.classList.add('show'); clearTimeout(toast.timer); toast.timer=setTimeout(()=>el.classList.remove('show'),2400); };
  const translations = {
    dashboard:['الرئيسية','Dashboard'], profile:['ملفي الصحي','My profile'], nutrition:['التغذية','Nutrition'], fitness:['النشاط والحركة','Activity'], skincare:['العناية بالبشرة','Skincare'], checker:['فحص المكونات','Ingredient checker'], assistant:['المساعد الصحي','AI assistant'], library:['المكتبة الصحية','Health library'], diseases:['دليل الحالات الصحية','Health conditions']
  };
  function navigate(page){
    $$('.page').forEach(p=>p.classList.toggle('active',p.id===`page-${page}`));
    $$('.nav-link[data-page]').forEach(b=>b.classList.toggle('active',b.dataset.page===page));
    const title=translations[page] || translations.dashboard;
    $('#pageTitle').textContent=lang==='ar'?(page==='dashboard'?'صباح الخير 👋':title[0]):(page==='dashboard'?'Good day 👋':title[1]);
    $('#sidebar').classList.remove('open');
    window.scrollTo({top:0,behavior:'smooth'});
  }
  $$('.nav-link[data-page]').forEach(b=>b.addEventListener('click',()=>navigate(b.dataset.page)));
  $$('[data-go]').forEach(b=>b.addEventListener('click',()=>navigate(b.dataset.go)));
  $('#menuBtn').addEventListener('click',()=>$('#sidebar').classList.toggle('open'));
  $('#themeBtn').addEventListener('click',toggleTheme); $('#themeTopBtn').addEventListener('click',toggleTheme);
  function toggleTheme(){document.body.classList.toggle('dark');}
  $('#todayDate').textContent=new Intl.DateTimeFormat('ar-EG',{weekday:'long',day:'numeric',month:'long'}).format(new Date());
  function updateStats(){
    $('#waterValue').textContent=water; $('#waterProgress').style.width=Math.min(100,water/8*100)+'%';
    $('#sleepValue').textContent=sleep; $('#sleepProgress').style.width=Math.min(100,sleep/8*100)+'%';
    $('#moveValue').textContent=movement; $('#moveProgress').style.width=Math.min(100,movement/30*100)+'%';
    $('#moodValue').textContent=mood;
  }
  $('#addWater').addEventListener('click',()=>{water=Math.min(20,water+1);updateStats();toast('تم تسجيل كوب ماء في هذه الجلسة.');});
  $('#sleepBtn').addEventListener('click',()=>{const v=prompt('كم ساعة نمت؟ (رقم من 0 إلى 24)');if(v!==null&&v.trim()!==''&&Number.isFinite(+v)&&+v>=0&&+v<=24){sleep=+v;updateStats();toast('تم تسجيل النوم.');}});
  $$('[data-mood]').forEach(b=>b.addEventListener('click',()=>{mood=b.dataset.mood;updateStats();toast('تم تسجيل حالتك المزاجية.');}));
  function updateHabits(){const checks=$$('.habit-check');const n=checks.filter(c=>c.checked).length;$('#habitCount').textContent=`${n} / ${checks.length}`;}
  $$('.habit-check').forEach(c=>c.addEventListener('change',updateHabits));

  $('#profileForm').addEventListener('submit',e=>{
    e.preventDefault();
    profile={name:$('#fullName').value.trim(),age:$('#age').value.trim(),skinType:$('#skinType').value,activityLevel:$('#activityLevel').value,conditions:$('#conditions').value.trim(),allergies:$('#allergies').value.trim(),foodPrefs:$('#foodPrefs').value.trim(),limitations:$('#limitations').value.trim()};
    $('#sidebarName').textContent=profile.name||'ضيفنا العزيز';
    $('#profileStatus').textContent='تم حفظ البيانات في ذاكرة الصفحة لهذه الجلسة فقط.';
    toast('تم حفظ الملف التجريبي.');
  });
  $('#clearProfile').addEventListener('click',()=>{profile={name:'',age:'',skinType:'',activityLevel:'',conditions:'',allergies:'',foodPrefs:'',limitations:''};$('#profileForm').reset();$('#sidebarName').textContent='ضيفنا العزيز';$('#profileStatus').textContent='تم مسح البيانات.';toast('تم مسح بيانات الملف.');});

  $('#activityForm').addEventListener('submit',e=>{e.preventDefault();const n=Number($('#activityMinutes').value);if(!Number.isFinite(n)||n<1||n>300){$('#activityStatus').textContent='أدخل مدة بين 1 و300 دقيقة.';return;}movement+=n;updateStats();$('#activityStatus').textContent=`تم تسجيل ${n} دقيقة من ${$('#activityType').value}.`;$('#activityMinutes').value='';toast('تم تحديث سجل الحركة.');});

  const ingredientInfo = {
    'glycerin':['مرطّب جاذب للماء','يساعد على جذب الماء إلى الطبقة الخارجية من الجلد.','شائع في منتجات الترطيب؛ قد يناسب أنواعًا كثيرة حسب التركيبة.'],
    'niacinamide':['فيتامين B3','قد يدعم حاجز البشرة ويساعد في مظهر تفاوت اللون والدهون.','قد يسبب تهيجًا لدى بعض الأشخاص؛ التركيز والتركيبة مهمان.'],
    'hyaluronic acid':['مرطّب جاذب للماء','يساعد على ترطيب الطبقة السطحية.','غالبًا يُستخدم مع مرطب؛ النتيجة تعتمد على التركيبة والبيئة.'],
    'ceramide':['دهون داعمة لحاجز البشرة','تساعد في دعم الحاجز الواقي وتقليل فقدان الماء.','شائعة في المرطبات، خاصة للبشرة الجافة.'],
    'salicylic acid':['حمض مقشّر BHA','يساعد على تقشير المسام والجلد السطحي.','قد يسبب جفافًا أو تهيجًا؛ تجنّب الإفراط واطلب نصيحة مختص عند الحمل أو الحالات الجلدية.'],
    'benzoyl peroxide':['مكوّن مضاد لحب الشباب','يقلل البكتيريا المرتبطة بحب الشباب والالتهاب.','قد يسبب جفافًا وتهيجًا ويبهت الأقمشة؛ استخدامه العلاجي يحتاج إرشادًا مناسبًا.'],
    'retinol':['مشتق من فيتامين A','يُستخدم في بعض منتجات تحسين مظهر البشرة.','قد يسبب تهيجًا وحساسية للشمس؛ يُتجنب أثناء الحمل، واستشر مختصًا قبل استخدامه.'],
    'fragrance':['عطر / مزيج عطري','يُضاف للرائحة وليس لعلاج البشرة.','قد يسبب تحسسًا أو تهيجًا لبعض الأشخاص، خاصة ذوي البشرة الحساسة.'],
    'parfum':['عطر / مزيج عطري','يُضاف للرائحة وليس لعلاج البشرة.','قد يسبب تحسسًا أو تهيجًا لبعض الأشخاص.'],
    'alcohol denat':['كحول متطاير','قد يعمل كمذيب أو يساعد على سرعة جفاف المنتج.','قد يزيد الجفاف أو التهيج لبعض الأشخاص؛ ليس كل أنواع الكحول متشابهة.'],
    'dimethicone':['سيليكون ملطّف','يساعد على تقليل فقدان الماء وتحسين ملمس المنتج.','غالبًا يتحمله كثيرون، لكن التركيبة الكاملة مهمة.'],
    'tocopherol':['فيتامين E','مضاد أكسدة يُستخدم في التركيبات.','قد يسبب تحسسًا نادرًا لدى بعض الأشخاص.'],
    'zinc oxide':['أكسيد الزنك','مرشح معدني للأشعة فوق البنفسجية في بعض واقيات الشمس.','فعاليته تعتمد على المنتج كاملًا وتصنيف الحماية وطريقة الاستخدام.'],
    'titanium dioxide':['ثاني أكسيد التيتانيوم','مرشح معدني للأشعة فوق البنفسجية في بعض المنتجات.','لا يمكن تقييم حماية الشمس من مكوّن منفرد؛ راجع تصنيف SPF والعبوة.']
  };
  $('#checkIngredients').addEventListener('click',()=>{
    const raw=$('#ingredientInput').value.trim(), result=$('#checkerResult');
    if(!raw){toast('أدخل قائمة المكونات أولًا.');return;}
    const hay=raw.toLowerCase();
    const allergyText=(profile.allergies||'').toLowerCase();
    const personalMatches=allergyText.split(/[،,;\n]+/).map(x=>x.trim()).filter(x=>x.length>2&&hay.includes(x));
    const hits=Object.keys(ingredientInfo).filter(k=>hay.includes(k));
    const name=$('#productName').value.trim()||'المنتج';
    let html=`<h3>تحليل تعليمي مبدئي: ${escapeHtml(name)}</h3><span class="result-status ${personalMatches.length?'warn':'ok'}">${personalMatches.length?'تطابق نصي محتمل مع بيانات الحساسية':'تم فحص الكلمات المدخلة'}</span>`;
    if(personalMatches.length) html+=`<p><b>تطابقات تستحق التحقق:</b> ${personalMatches.map(escapeHtml).join('، ')}. لا يعني ذلك تأكيد وجود المادة المسببة للحساسية.</p>`;
    if(hits.length){
      html+='<div class="ingredient-analysis-list">';
      hits.forEach(k=>{const x=ingredientInfo[k];html+=`<div class="ingredient-analysis-item"><b>${escapeHtml(k)} — ${escapeHtml(x[0])}</b><p>${escapeHtml(x[1])}</p><small>${escapeHtml(x[2])}</small></div>`;});
      html+='</div>';
    } else html+='<p>لم يتم التعرف على مكونات من القاموس التعليمي الحالي. هذا لا يعني أن القائمة خالية من مكونات فعالة أو مسببات تحسس.</p>';
    html+=`<p class="form-note">التقييم لا يحدد نوع بشرتك ولا يضمن أن المنتج مناسب أو آمن. التركيز، ترتيب المكونات، تركيبة المنتج، طريقة الاستخدام، والحساسية الفردية عوامل مهمة. راجع العبوة الرسمية واختبر المنتج وفق إرشادات مختص عند الحاجة.</p>`;
    result.innerHTML=html;
  });
  function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}


  const conditionGuides = {
    diabetes: ['السكري','وزّع مصادر الكربوهيدرات بوعي، وفضّل الأطعمة الغنية بالألياف ضمن الخطة التي وضعها مختصك.','العصائر والمشروبات المحلاة قد ترفع سكر الدم بسرعة. لا تغيّر جرعات الدواء أو الإنسولين ولا تتخطَّ الوجبات دون خطة علاجية.','ناقش توزيع الكربوهيدرات، ومراقبة السكر، وخطة التعامل مع انخفاضه.'],
    pressure: ['ارتفاع ضغط الدم','قد يساعد تقليل الصوديوم واختيار أطعمة متنوعة قليلة التصنيع ضمن نمط غذائي متوازن.','الصوديوم قد يختبئ في المخللات واللحوم المصنعة والصلصات والشوربات الجاهزة. لا توقف الدواء عند تحسن القراءة.','اسأل عن هدف الضغط المناسب وطريقة القياس المنزلية.'],
    anemia: ['فقر الدم','مصادر الحديد تشمل اللحوم والبقول والخضروات الورقية والأطعمة المدعمة، لكن الفائدة تعتمد على سبب فقر الدم.','الشاي والقهوة مع الوجبات قد يقللان امتصاص الحديد غير الهيمي. لا تبدأ مكملات الحديد قبل معرفة السبب.','اسأل عن CBC وFerritin ونوع فقر الدم وما إذا كان يلزم فحص B12 أو الفولات.'],
    celiac: ['مرض السيلياك','بعد تأكيد التشخيص، يلزم اتباع نظام خالٍ من الجلوتين بدقة مع مختص تغذية.','التلوث التبادلي في المحمصة وأدوات المطبخ والأسطح قد يكون مهمًا. لا تبدأ الحمية قبل الفحوصات دون مراجعة الطبيب.','اسأل عن قراءة الملصقات والتلوث التبادلي والبدائل الغذائية.'],
    kidney: ['أمراض الكلى','الخطة تعتمد على مرحلة المرض والتحاليل والأدوية؛ لا توجد قائمة واحدة تناسب الجميع.','قد تحتاج بعض الحالات إلى تعديل البوتاسيوم أو الفوسفور أو البروتين أو السوائل، لكن التقييد غير المناسب قد يضر.','اطلب من فريقك تحديد احتياجات السوائل والبروتين والمعادن بناءً على التحاليل.'],
    cholesterol: ['ارتفاع الكوليسترول','قد يفيد استبدال بعض الدهون المشبعة بدهون غير مشبعة وزيادة الألياف القابلة للذوبان ضمن نمط متوازن.','الدهون المتحولة وبعض الأطعمة العالية بالدهون المشبعة قد تؤثر في LDL. الطعام وحده لا يغني دائمًا عن العلاج.','اسأل عن LDL وHDL والدهون الثلاثية ومخاطر القلب الإجمالية.'],
    lactose: ['عدم تحمّل اللاكتوز','تختلف الكمية التي يتحملها الأشخاص؛ قد تناسب بعضهم منتجات خالية من اللاكتوز أو بدائل مدعمة.','عدم التحمل يختلف عن حساسية بروتين الحليب، التي قد تكون خطيرة. انتبه للحصول على الكالسيوم وفيتامين D من بدائل مناسبة.','ناقش كيفية تأكيد السبب واختيار بدائل غذائية مناسبة.']
  };
  $('#nutritionCondition')?.addEventListener('change',e=>{
    const g=conditionGuides[e.target.value], box=$('#nutritionConditionResult');
    if(!g){box.textContent='ستظهر هنا معلومات عامة عند اختيار الحالة.';return;}
    box.innerHTML=`<h4>${g[0]}</h4><p><b>معلومات غذائية:</b> ${g[1]}</p><p><b>انتبه إلى:</b> ${g[2]}</p><p><b>ناقش مع المختص:</b> ${g[3]}</p><small>هذه معلومات تثقيفية وليست خطة وجبات أو توصية علاجية شخصية.</small>`;
  });
  const skinGuides={
    dry:'اختاري منظفًا لطيفًا غير مجفف، ومرطبًا يحتوي على مكونات داعمة للحاجز مثل السيراميد أو الجلسرين. تجنبي الإفراط في التقشير.',
    oily:'استخدمي منظفًا لطيفًا ومرطبًا خفيفًا لا يسد المسام إذا كان مناسبًا لك. تجنبي غسل البشرة بعنف أو استخدام عدة مواد مقشرة معًا.',
    combination:'يمكن استخدام عناية لطيفة ومتوازنة، مع مرطب مناسب للمناطق الجافة ومنتجات خفيفة للمناطق الأكثر دهنية.',
    sensitive:'ابدئي بمنتجات قليلة المكونات وخالية من العطر قدر الإمكان، وأدخلي منتجًا واحدًا في كل مرة. أوقفي ما يسبب تهيجًا واضحًا.',
    normal:'حافظي على تنظيف لطيف وترطيب عند الحاجة وواقٍ شمسي واسع الطيف وفق تعليمات المنتج.'
  };
  $('#skinRoutineType')?.addEventListener('change',e=>{
    const text=skinGuides[e.target.value], box=$('#skinRoutineResult');
    box.textContent=text||'اختاري نوع البشرة لعرض روتين لطيف قابل للتعديل.';
  });

  const replies=[
    {keys:['عادة','روتين','أبدأ','ابدأ'],text:'ابدأ بخطوة صغيرة يسهل تكرارها، مثل ترتيب وقت النوم أو إضافة استراحة قصيرة. اختر هدفًا يناسب ظروفك، ولا تضغط على نفسك.'},
    {keys:['مكونات','ingredient','قائمة'],text:'تُكتب المكونات عادةً على العبوة بترتيب تنازلي حسب الكمية وقت التصنيع، لكن قواعد الملصقات تختلف. راجع العبوة الرسمية وتواصل مع الشركة عند الشك.'},
    {keys:['مختص','طبيب','استشارة','متى'],text:'اطلب رأي مختص إذا كانت لديك أعراض مستمرة أو متفاقمة، أو إذا احتجت قرارًا متعلقًا بالتشخيص أو الدواء أو خطة غذائية ورياضية لحالة صحية.'},
    {keys:['حساسية','allergy'],text:'إذا كانت لديك حساسية معروفة، لا تعتمد على فحص الكلمات وحده. تحقق من الملصق وتحذيرات التلوث التبادلي واسأل مختصًا أو الشركة المصنّعة عند عدم الوضوح.'},
    {keys:['ماء','شرب'],text:'احتياجات السوائل تختلف من شخص لآخر وقد تتأثر بالحالة الصحية والأدوية والطقس. اتبع أي حد أو تعليمات سوائل أوصى بها فريقك الطبي.'}
  ];
  function assistantReply(q){
    const low=q.toLowerCase();
    if(/ألم صدر|ضيق تنفس شديد|صعوبة التنفس|إغماء|فقدان الوعي|نزيف شديد|علامات السكتة/.test(q))
      return 'قد تكون هذه حالة طارئة. اطلب المساعدة الطبية الطارئة المحلية فورًا، ولا تنتظر ردًا من الموقع.';
    if(/سكري|السكر|diabetes/.test(low))
      return 'السكري يشمل حالات تختلف في أسبابها وعلاجها. من المعلومات العامة المفيدة: توزيع الكربوهيدرات، اختيار مصادر ألياف مناسبة، ومتابعة قراءات السكر حسب خطة الفريق الطبي. العصائر والمشروبات المحلاة قد ترفع السكر بسرعة. لا تغيّر الدواء أو جرعته ولا تتخطَّ الوجبات اعتمادًا على هذه المحادثة. هل تريد شرحًا عامًا عن الكربوهيدرات أم قراءة الملصقات؟';
    if(/ضغط|hypertension/.test(low))
      return 'ارتفاع ضغط الدم قد لا يسبب أعراضًا واضحة. قد يساعد تقليل الصوديوم الموجود في المخللات واللحوم المصنعة والوجبات الجاهزة، لكن الخطة تعتمد على حالتك. لا توقف الدواء بسبب قراءة واحدة. ناقش هدف الضغط وطريقة القياس مع مختص.';
    if(/أنيميا|فقر الدم|حديد|anemia/.test(low))
      return 'فقر الدم له أسباب مختلفة، وليس كل فقر دم سببه نقص الحديد. الشاي والقهوة مع الوجبات قد يقللان امتصاص الحديد غير الهيمي. لا تبدأ مكمل الحديد ذاتيًا؛ اسأل عن CBC وFerritin والفحوصات التي تناسب حالتك.';
    if(/كلى|kidney/.test(low))
      return 'في أمراض الكلى تختلف احتياجات السوائل والبروتين والبوتاسيوم والفوسفور حسب التحاليل ومرحلة المرض. لذلك لا تتبع قائمة منع عامة ولا ترفع أو تقلل شرب الماء دون توجيه فريقك الطبي.';
    if(/جلوتين|سيلياك|celiac/.test(low))
      return 'مرض السيلياك مرض مناعي ذاتي يتطلب تجنب الجلوتين بدقة بعد تأكيد التشخيص. التلوث التبادلي في أدوات المطبخ قد يكون مهمًا. لا تبدأ حمية خالية من الجلوتين قبل الفحوصات دون مناقشة الطبيب.';
    if(/لاكتوز|حليب|lactose/.test(low))
      return 'عدم تحمّل اللاكتوز يختلف عن حساسية بروتين الحليب. تختلف الكمية التي يتحملها كل شخص، وقد تناسب بعض الأشخاص منتجات خالية من اللاكتوز أو بدائل مدعمة. إذا ظهرت أعراض تحسسية مثل صعوبة التنفس أو تورم اللسان فهذه حالة طارئة.';
    if(/كوليسترول|cholesterol/.test(low))
      return 'ارتفاع LDL قد يتأثر بالدهون المشبعة والمتحولة والعوامل الوراثية وغيرها. قد يفيد استبدال بعض الدهون المشبعة بدهون غير مشبعة وزيادة الألياف ضمن نمط متوازن. لا توقف علاج الدهون دون الرجوع للطبيب.';
    if(/جلسرين|نياسيناميد|هيالورونيك|ريتينول|salicylic|glycerin|niacinamide|hyaluronic|retinol/.test(low))
      return 'المكونات لها وظائف مختلفة: الجلسرين وحمض الهيالورونيك مرطبان جاذبان للماء، والنياسيناميد قد يدعم حاجز البشرة، وحمض الساليسيليك مقشر، والريتينول قد يسبب تهيجًا ويُتجنب أثناء الحمل. النتيجة تعتمد على التركيز والتركيبة وتحمل البشرة.';
    if(/مكونات|ingredient|منتج|بشرة|جلد|skincare/.test(low))
      return 'أستطيع شرح وظيفة مكونات شائعة مثل الجلسرين والسيراميد والنياسيناميد وحمض الساليسيليك والعطور. لكن لا يمكن الحكم على المنتج من مكوّن واحد فقط؛ التركيز والتركيبة والحساسية الفردية مهمة. انسخ قائمة المكونات في قسم فاحص المكونات.';
    if(/طبيب|مختص|استشارة|متى/.test(low))
      return 'اطلب تقييمًا طبيًا للأعراض المستمرة أو المتفاقمة، أو عند الحاجة لتشخيص أو دواء أو خطة غذائية لحالة مزمنة. اطلب الطوارئ فورًا عند ألم الصدر أو صعوبة التنفس الشديدة أو الإغماء أو علامات السكتة.';
    if(/ماء|سوائل|شرب/.test(low))
      return 'احتياجات السوائل تختلف حسب العمر والطقس والنشاط والحالة الصحية والأدوية. بعض حالات القلب والكلى تتطلب تعليمات خاصة؛ اتبع أي حد للسوائل حدده فريقك الطبي.';
    if(/روتين|عادة|نوم|نشاط/.test(low))
      return 'ابدأ بعادة صغيرة قابلة للاستمرار مثل وقت نوم منتظم أو استراحة حركة لطيفة إذا كانت مناسبة لك. عدّل النشاط وفق قدراتك وأي تعليمات طبية، ولا تضغط على نفسك لتحقيق أرقام ثابتة.';
    return 'أقدر أساعدك بمعلومات تثقيفية عامة عن التغذية والحالات الصحية ومكونات العناية بالبشرة. اكتب اسم الحالة أو المكوّن بشكل محدد لأشرح وظيفته وما الذي يستحق الانتباه. لا أستطيع التشخيص أو وصف علاج أو إعداد حمية علاجية شخصية، ولا أملك اتصالًا بنموذج AI خارجي في هذه النسخة.';
  }
  function sendChat(q){
    if(!q.trim())return;const box=$('#chatMessages');
    const user=document.createElement('div');user.className='message user';user.textContent=q;box.appendChild(user);
    const bot=document.createElement('div');bot.className='message bot';bot.textContent=assistantReply(q);box.appendChild(bot);box.scrollTop=box.scrollHeight;
  }
  $('#chatForm').addEventListener('submit',e=>{e.preventDefault();sendChat($('#chatInput').value);$('#chatInput').value='';});
  $$('.suggestions button').forEach(b=>b.addEventListener('click',()=>sendChat(b.dataset.question)));
  $$('.doctor-card').forEach(card=>card.addEventListener('click',()=>{
    doctor=card.dataset.doctor;$$('.doctor-card').forEach(c=>c.classList.toggle('selected',c===card));
    $('#doctorName').textContent=doctor==='sara'?'د. سارة':'د. آدم';$('#chatAvatar').textContent=doctor==='sara'?'👩🏻‍⚕️':'👨🏻‍⚕️';
    toast(`تم اختيار ${doctor==='sara'?'د. سارة':'د. آدم'} — شخصية افتراضية.`);
  }));

  $('#langBtn').addEventListener('click',()=>{
    lang=lang==='ar'?'en':'ar';document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';
    $$('[data-ar][data-en]').forEach(el=>el.textContent=el.dataset[lang]);
    $('#langBtn').textContent=lang==='ar'?'EN / ع':'ع / EN';
    const active=$('.nav-link.active')?.dataset.page||'dashboard';navigate(active);
    toast(lang==='ar'?'تم تغيير اللغة إلى العربية.':'Language switched to English. Note: some demo content remains Arabic.');
  });
  updateStats();updateHabits();
})();