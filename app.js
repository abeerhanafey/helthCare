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

  const INGREDIENTS_DATABASE = [
    {
      id: 'water',
      keys: ['water', 'aqua', 'eau', 'ماء', 'مياه'],
      name: 'Aqua / Water (الماء)',
      type: 'مذيب أساسي وقاعدة للمستحضر',
      note: 'يشكل القاعدة الأساسية لغالبية المنتجات المائية لدمج وتذويب باقي العناصر.'
    },
    {
      id: 'sulfates',
      keys: ['sulfate', 'sulphate', 'sls', 'sles', 'salfete', 'sulfates', 'sodium lauryl sulfate', 'sodium laureth sulfate', 'سلفات', 'كبريتات', 'سلفيت'],
      name: 'Sulfates / كبريتات (السلفات)',
      type: 'عامل تنظيف خافض للتوتر السطحي ورغوي قوي',
      note: 'يزيل الزيوت والرواسب بفعالية، لكن قد يسبب جفافاً أو تهيجاً للبشرة الحساسة أو الشعر المعالج بالجفاف أو الصبغة.'
    },
    {
      id: 'glycerin',
      keys: ['glycerin', 'glycerol', 'glycerine', 'جلسرين', 'جليسرين'],
      name: 'Glycerin (الجلسرين)',
      type: 'مرطّب جاذب للماء (Humectant)',
      note: 'يساعد على جذب الماء إلى الطبقة الخارجية من الجلد ويدعم مرونة وحاجز البشرة.'
    },
    {
      id: 'niacinamide',
      keys: ['niacinamide', 'nicotinamide', 'vitamin b3', 'نياسيناميد', 'ناياسيناميد', 'فيتامين ب3'],
      name: 'Niacinamide (نياسيناميد / فيتامين B3)',
      type: 'مضاد أكسدة ومنظم للإفرازات الدهنية',
      note: 'يدعم حاجز البشرة، يحسن مظهر المسام وتفاوت اللون، ومناسب لمعظم أنواع البشرة بتراكيز معتدلة.'
    },
    {
      id: 'hyaluronic_acid',
      keys: ['hyaluronic acid', 'sodium hyaluronate', 'hyaluronate', 'هيالورونيك', 'حمض الهيالورونيك', 'هيالورونات الصوديوم'],
      name: 'Hyaluronic Acid (حمض الهيالورونيك)',
      type: 'مرطّب جاذب فائق للماء',
      note: 'يحبس الرطوبة في طبقات الجلد السطحية ويمنح مظهراً ممتلئاً ومرناً للبشرة.'
    },
    {
      id: 'ceramides',
      keys: ['ceramide', 'ceramides', 'ceramide np', 'ceramide ap', 'ceramide eop', 'سيراميد', 'سيراميدات'],
      name: 'Ceramides (السيراميد)',
      type: 'دهون داعمة ومطابقة لحاجز البشرة',
      note: 'تعيد بناء ودعم الحاجز الواقي للجلد، وتقلل فقدان الماء والجفاف خاصة للبشرة الحساسة أو الجافة.'
    },
    {
      id: 'salicylic_acid',
      keys: ['salicylic acid', 'salicylic', 'bha', 'حمض الساليسيليك', 'ساليسيليك'],
      name: 'Salicylic Acid (حمض الساليسيليك - BHA)',
      type: 'حمض مقشر ذائب في الدهون للمسام',
      note: 'ينظف المسام من الداخل ويقلل تراكم الدهون والرؤوس السوداء وحب الشباب؛ يُنصح بالتدرج لتفادي الجفاف.'
    },
    {
      id: 'glycolic_acid',
      keys: ['glycolic acid', 'glycolic', 'aha', 'حمض الجليكوليك', 'جليكوليك'],
      name: 'Glycolic Acid (حمض الجليكوليك - AHA)',
      type: 'مقشر كيميائي سطحي',
      note: 'يساعد على إزالة خلايا الجلد الميتة وتجديد مظهر البشرة وتوحيد لونها، ويزيد حساسية الجلد للشمس.'
    },
    {
      id: 'benzoyl_peroxide',
      keys: ['benzoyl peroxide', 'benzoyl', 'بنزويل بيروكسايد', 'بيروكسيد البنزويل'],
      name: 'Benzoyl Peroxide (بنزويل بيروكسايد)',
      type: 'مكوّن مضاد للبكتيريا المسببة لحب الشباب',
      note: 'فعال في تقليل البكتيريا والالتهاب، قد يسبب جفافاً أو تقشيراً في البداية.'
    },
    {
      id: 'retinol',
      keys: ['retinol', 'retinoid', 'retinyl palmitate', 'tretinoin', 'ريتينول', 'ريتينويد', 'تريتينوين'],
      name: 'Retinol / Retinoids (مشتقات فيتامين A)',
      type: 'محفز لتجدد الخلايا ومكافحة علامات التقدم بالسن',
      note: 'يحسن ملمس ومرونة البشرة وتجاعيدها؛ يُستخدم ليلاً مع واقٍ شمسي بالنهار ويُمنع أثناء الحمل والرضاعة دون استشارة طبية.'
    },
    {
      id: 'fragrance',
      keys: ['fragrance', 'parfum', 'aroma', 'flavor', 'perfume', 'عطر', 'عطور', 'بارفان'],
      name: 'Fragrance / Parfum (العطور)',
      type: 'مكون عطري وتجميلي',
      note: 'يمنح رائحة للمنتج دون فائدة علاجية، ويعد من أشهر مسببات التهيج للبشرة الحساسة أو المصابة بالإكزيما.'
    },
    {
      id: 'parabens',
      keys: ['paraben', 'methylparaben', 'propylparaben', 'butylparaben', 'ethylparaben', 'بارابين', 'ميثيل بارابين'],
      name: 'Parabens (البارابين)',
      type: 'مادة حافظة واسعة المجال',
      note: 'تمنع نمو البكتيريا والفطريات في التركيبة، وتستخدم بنسب دقيقة ومحددة قانونياً.'
    },
    {
      id: 'alcohol_denat',
      keys: ['alcohol denat', 'sd alcohol', 'isopropyl alcohol', 'ethanol', 'كحول', 'كحول متطاير', 'كحول دينات'],
      name: 'Alcohol Denat (الكحول المجفف / المتطاير)',
      type: 'مذيب وقابض ومحسن لسرعة الجفاف',
      note: 'يعطي إحساساً خفيفاً غير دهني، لكن تراكيزه المرتفعة قد تؤدي لجفاف البشرة وضعف الحاجز الجلدي.'
    },
    {
      id: 'fatty_alcohols',
      keys: ['cetyl alcohol', 'cetearyl alcohol', 'stearyl alcohol', 'سيتيل الكحول', 'سيتيريل الكحول'],
      name: 'Fatty Alcohols (كحولات دهنية مرطبة)',
      type: 'مطريات ومثبتات قوام لطيفة',
      note: 'تختلف تماماً عن الكحول المجفف؛ فهي مفيدة لترطيب وتنعيم البشرة ولا تسبب جفافاً.'
    },
    {
      id: 'dimethicone',
      keys: ['dimethicone', 'silicone', 'cyclopentasiloxane', 'cyclomethicone', 'amodimethicone', 'سيليكون', 'ديميثيكون'],
      name: 'Silicones / Dimethicone (السيليكون / ديميثيكون)',
      type: 'مادة ملينة وواقية حابسة للرطوبة',
      note: 'يمنح ملمساً مخملياً ناعماً ويقلل فقدان الرطوبة، وهو آمن عموماً لكن يُفضل غسله جيداً لتجنب تراكمه.'
    },
    {
      id: 'tocopherol',
      keys: ['tocopherol', 'tocopheryl acetate', 'vitamin e', 'توكوفيرول', 'فيتامين هـ', 'فيتامين e'],
      name: 'Tocopherol (فيتامين E)',
      type: 'مضاد أكسدة ومثبت للزيوت',
      note: 'يحمي المنتج والبشرة من الأكسدة والعوامل البيئية.'
    },
    {
      id: 'zinc_oxide',
      keys: ['zinc oxide', 'أكسيد الزنك', 'زنك اوكسايد'],
      name: 'Zinc Oxide (أكسيد الزنك)',
      type: 'مرشح فيزيائي واقٍ من الشمس وملطف',
      note: 'يحمي من الأشعة فوق البنفسجية (UVA/UVB) ويهدئ البشرة المتهيجة.'
    },
    {
      id: 'titanium_dioxide',
      keys: ['titanium dioxide', 'ثاني أكسيد التيتانيوم'],
      name: 'Titanium Dioxide (ثاني أكسيد التيتانيوم)',
      type: 'مرشح معدني واقٍ من أشعة الشمس',
      note: 'مرشح واسع المجال يعكس الأشعة فوق البنفسجية، مناسب للبشرة الحساسة.'
    },
    {
      id: 'panthenol',
      keys: ['panthenol', 'provitamin b5', 'بانثينول', 'برو فيتامين ب5'],
      name: 'Panthenol (بانثينول / فيتامين B5)',
      type: 'مهدئ ومرطب ومجدد للبشرة',
      note: 'يساعد على تسريع التئام الجلد وتسكين التهيج وتعزيز مستويات الترطيب.'
    },
    {
      id: 'centella',
      keys: ['centella asiatica', 'cica', 'madecassoside', 'سنتيلا', 'سيكا', 'ماديكاسوسيد'],
      name: 'Centella Asiatica / Cica (سنتيلا اسياتيكا)',
      type: 'خلاصة مهدئة ومضادة للالتهاب',
      note: 'ممتازة لتهدئة الاحمرار ودعم الحاجز الواقي وتسريع تعافي البشرة الحساسة.'
    }
  ];

  function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

  $('#checkIngredients').addEventListener('click',()=>{
    const raw=$('#ingredientInput').value.trim(), result=$('#checkerResult');
    if(!raw){toast('أدخل قائمة المكونات أولًا.');return;}
    
    const hay = raw.toLowerCase().replace(/\s+/g, ' ');
    const allergyText = (profile.allergies || '').toLowerCase();
    
    const personalMatches = allergyText
      ? allergyText.split(/[،,;\n\r]+/).map(x=>x.trim()).filter(x=>x.length>2 && hay.includes(x))
      : [];

    const matchedIngredients = INGREDIENTS_DATABASE.filter(item =>
      item.keys.some(k => hay.includes(k.toLowerCase()))
    );

    const name = $('#productName').value.trim() || 'المنتج';
    let html = `<h3>تحليل تعليمي مبدئي: ${escapeHtml(name)}</h3>`;
    html += `<span class="result-status ${personalMatches.length ? 'warn' : 'ok'}">`;
    html += personalMatches.length ? '⚠️ تنبيه: تطابق نصي محتمل مع بيانات الحساسية' : '✓ تم فحص ومطابقة المكونات بنجاح';
    html += `</span>`;

    if(personalMatches.length) {
      html += `<p style="margin-top:10px;"><b>تطابقات تستحق التحقق مع ملفك:</b> <span style="color:#e05252;font-weight:bold;">${personalMatches.map(escapeHtml).join('، ')}</span>. راجع العبوة بعناية واستشر مختصاً.</p>`;
    }

    if(matchedIngredients.length){
      html += `<p style="margin:8px 0;font-size:0.9rem;color:var(--text-muted);">تم التعرف على (${matchedIngredients.length}) من المكونات الشائعة في قائمتك:</p>`;
      html += '<div class="ingredient-analysis-list">';
      matchedIngredients.forEach(item => {
        html += `<div class="ingredient-analysis-item">
          <b>${escapeHtml(item.name)} — <span style="font-weight:normal;color:var(--accent-color);">${escapeHtml(item.type)}</span></b>
          <p>${escapeHtml(item.note)}</p>
        </div>`;
      });
      html += '</div>';
    } else {
      html += '<div style="margin:16px 0;padding:12px;background:rgba(0,0,0,0.04);border-radius:8px;">';
      html += '<p>لم يتم التعرف على مكونات من القاموس التعليمي الحالي بالصيغة المدخلة. هذا لا يعني أن القائمة خالية من مكونات فعالة أو مسببات تحسس.</p>';
      html += '<small style="display:block;margin-top:6px;color:var(--text-muted);">نصيحة: تأكد من كتابة أسماء المكونات بالإنجليزية مثل: Water, Glycerin, Niacinamide, Fragrance, Dimethicone أو بالعربية مثل: سلفات، جلسرين، عطر.</small>';
      html += '</div>';
    }

    html += `<p class="form-note">التقييم لا يحدد نوع بشرتك ولا يضمن أن المنتج مناسب أو آمن. التركيز، ترتيب المكونات، تركيبة المنتج، طريقة الاستخدام، والحساسية الفردية عوامل مهمة. راجع العبوة الرسمية واختبر المنتج وفق إرشادات مختص عند الحاجة.</p>`;
    result.innerHTML = html;
  });

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

  function assistantReply(q){
    const clean = q.trim();
    const low = clean.toLowerCase();

    if(/ألم صدر|الم صدر|ضيق تنفس|صعوبة التنفس|إغماء|اغماء|فقدان الوعي|نزيف شديد|جلطة|سكتة|شاش راسي|تنميل نصفي/i.test(low)) {
      return '🚨 تنبيه صحي حرج: هذه الأعراض قد تدل على حالة طارئة تستدعي تدخلاً فورياً. يرجى الاتصال بالإسعاف أو التوجه فوراً لأقرب قسم طوارئ ولا تنتظر أي نصيحة إلكترونية.';
    }

    if(/^(هاي|مرحبا|سلام|أهلا|اهلا|صباح الخير|مساء الخير|الو|ألو|hi|hello|hey)/i.test(low) || low === 'مين انت' || low.includes('من أنت')) {
      const docName = doctor === 'sara' ? 'د. سارة' : 'د. آدم';
      return `أهلاً وسهلاً بك! أنا ${docName}، رفيقك الصحي الذكي في Pharaoh AI 𓂀. يمكنني مساعدتك بإرشادات تثقيفية حول:
• التغذية الصحية وتنظيم الوجبات وحالات السكري والضغط.
• مكونات العناية بالبشرة وتحليل المنتجات.
• عادات النوم وشرب الماء والنشاط البدني.
• التعامل مع الأعراض اليومية الشائعة (مثل الصداع، الإرهاق، التوتر).
كيف يمكنني مساعدتك اليوم؟`;
    }

    if(/صداع|صداع نصفي|راسي يوجعني|راسي يعورني|الم بالراس|ألم بالرأس|headache/i.test(low)) {
      return 'أسباب الصداع اليومي الشائعة تشمل: قلة النوم، الجفاف وقلة شرب الماء، إجهاد العينين والشاشات، أو التوتر وتخطي الوجبات. جرّب شرب كوب ماء كبير والجلوس في مكان هادئ ومظلم مع أخذ نفس عميق. تنبيه: إذا كان الصداع مفاجئاً وشديداً جداً كأنه ضربة رعد، أو مصحوباً بارتفاع حرارة أو تيبس بالرقبة، فيجب مراجعة الطبيب فوراً.';
    }

    if(/سكري|سكر|كربوهيدرات|diabetes|انسولين|إنسولين/i.test(low)) {
      return 'مرض السكري يتطلب إدارة ذكية لنمط الحياة:\n1. وزّع وجباتك بانتظام وتجنب تخطيها، وركّز على الألياف (الخضار، الحبوب الكاملة) لتثبيت امتصاص السكر.\n2. احذر من السكريات السريعة والعصائر المحلاة حتى لو كانت طبيعية، لأنها ترفع السكر سريعاً.\n3. تابع قياسات السكر وفق توصيات طبيبك، ولا تقم بتغيير جرعات الإنسولين أو الأدوية ذاتياً أبداً.';
    }

    if(/ضغط|الضغط|hypertension|أملاح|صوديوم/i.test(low)) {
      return 'ارتفاع ضغط الدم يُعرف بالقاتل الصامت لأنه غالباً لا يسبب أعراضاً ملحوظة:\n• قلل استهلاك الصوديوم وتجنب المخللات واللحوم المصنعة والوجبات السريعة المعلبة.\n• احرص على تناول الأغذية الغنية بالبوتاسيوم والمغنيسيوم مثل الخضار الورقية والموز بعد استشارة طبيبك.\n• المشي اليومي لمدة 30 دقيقة يساعد في تحسين مرونة الأوعية الدموية.\n• لا توقف دواء الضغط أبداً لمجرد تحسن قراءة القياس المنزلي.';
    }

    if(/ماء|ميه|شرب|عطش|سوائل|water|hydration/i.test(low)) {
      return 'يُنصح عموماً بشرب ما بين 2 إلى 3 لترات من الماء يومياً (حوالي 8 إلى 10 أكواب). تزداد هذه الحاجة عند ممارسة الرياضة، الأجواء الحارة، أو عند تناول المشروبات التي تحتوي على الكافيين. (ملاحظة: لمرضى قصور القلب أو الكلى المتقدمة، يجب الالتزام بحجم السوائل الذي حدده الطبيب المعالج بدقة).';
    }

    if(/نوم|ارق|أرق|سهر|sleep|insomnia|مانمت/i.test(low)) {
      return 'لتحسين جودة النوم ومحاربة الأرق:\n1. ثبت موعد نوم واستيقاظ محدد يومياً، حتى في عطلة نهاية الأسبوع.\n2. أوقف الشاشات والأجهزة الإلكترونية قبل النوم بـ 60 دقيقة لتقليل الضوء الأزرق المثبط للميلاتونين.\n3. تجنب الكافيين والوجبات الدسمة بعد الساعة 5-6 مساءً.\n4. اجعل الغرفة مظلمة وباردة وهادئة قدر الإمكان.';
    }

    if(/أنيميا|انيميا|فقر الدم|حديد|انيمية|anemia/i.test(low)) {
      return 'فقر الدم له أنواع متعددة (مثل نقص الحديد، نقص B12، أو أسباب مناعية ووراثية). في حال نقص الحديد: يُفضل تناول الأغذية الغنية بالحديد مع مصدر لفيتامين C (كالبرتقال أو الليمون) لزيادة الامتصاص، وتجنب الشاي والقهوة مع أو بعد الوجبة مباشرة. استشر الطبيب واعمل تحليل CBC ومخزون الحديد (Ferritin) قبل أخذ مكملات الحديد.';
    }

    if(/مكونات|منتج|بشرة|شعر|سيروم|كريم|غسول|skincare|ingredient|شامبو|shampoo/i.test(low)) {
      return 'المكونات تعمل بتناغم مختلف حسب نوع بشرتك:\n• للترطيب والحاجز الواقي: ابحث عن الهيالورونيك، الجلسرين، والسيراميد والبانثينول.\n• لتنظيم الدهون والتفتيح: النياسيناميد خيار ممتاز ولطيف.\n• للحبوب والمسام: حمض الساليسيليك (BHA) يساعد على تقشير وتنظيف المسام.\n• الحذر: تجنب العطور والكحول المجفف إذا كانت بشرتك حساسة أو ملتهبة. يمكنك تجربة أداة "فاحص المكونات" في القائمة لتحليل أي منتج بالتفصيل!';
    }

    if(/رياضة|تمرين|حركة|دايت|رجيم|وزن|تنحيف|تخسيس|fitness|diet/i.test(low)) {
      return 'النشاط البدني المستدام يعتمد على التدرج لا القسوة:\n• توصي الهيئات الصحية بـ 150 دقيقة أسبوعياً من النشاط الهوائي المعتدل (مثل المشي السريع)، أو 75 دقيقة نشاط شديد.\n• ابدأ بخطوات بسيطة: 20-30 دقيقة مشي يومياً، واستخدم السلالم بدلاً من المصعد.\n• لخسارة الوزن، اعتمد عجزاً طفيفاً في السعرات مع التركيز على البروتين الكافي لتقليل خسارة الكتلة العضلية.';
    }

    if(/حساسية|allergy|تحسس|ارتكاريا|طفح/i.test(low)) {
      return 'الحساسية تتطلب فحصاً دقيقاً للملصقات ومكونات الأطعمة والمستحضرات. إذا كانت لديك حساسية مشخصة، تأكد دائماً من خلو المنتجات من مسببات الحساسية والتلوث التبادلي. إذا شعرت بصعوبة في التنفس أو انتفاخ في الشفاه أو اللسان، فهذه حالة طارئة تتطلب التوجه للمستشفى فوراً.';
    }

    if(/طبيب|مختص|عيادة|دكتور|استشارة|مستشفى/i.test(low)) {
      return 'يجب زيارة الطبيب المختص في الحالات التالية:\n1. استمرار الأعراض لأكثر من بضعة أيام دون تحسن، أو تفاقمها تدريجياً.\n2. ألم شديد ومفاجئ، أو ارتفاع مستمر في درجة الحرارة.\n3. التخطيط لبدء أدوية جديدة أو حميات علاجية لأمراض مزمنة.\n4. الأعراض غير المعتادة أثناء الحمل أو لدى كبار السن والأطفال.';
    }

    if(/شكرا|شكراً|تسلم|يعطيك العافية|thanks|thank you/i.test(low)) {
      return 'على الرحب والسعة دائماً! أتمنى لك دوام الصحة والعافية. إذا كان لديك أي استفسار آخر أنا هنا لمساعدتك.';
    }

    return `أنا هنا لمساعدتك بمعلومات تثقيفية موثوقة. يمكنك سؤالي بشكل محدد عن:\n• التغذية وإدارة الحالات الصحية (السكري، ضغط الدم، فقر الدم، الكولسترول).\n• فوائد ومحاذير مكونات مستحضرات العناية والشامبو (مثل السلفات، النياسيناميد، الريتينول).\n• العادات الحيوية (شرب الماء، تنظيم النوم، الرياضة والنشاط).\nما الذي تود مناقشته أو الاستفسار عنه؟`;
  }

  function sendChat(q){
    if(!q.trim())return;
    const box=$('#chatMessages');
    const user=document.createElement('div');
    user.className='message user';
    user.textContent=q;
    box.appendChild(user);

    const bot=document.createElement('div');
    bot.className='message bot';
    bot.textContent=assistantReply(q);
    box.appendChild(bot);
    box.scrollTop=box.scrollHeight;
  }

  $('#chatForm').addEventListener('submit',e=>{
    e.preventDefault();
    sendChat($('#chatInput').value);
    $('#chatInput').value='';
  });

  $$('.suggestions button').forEach(b=>b.addEventListener('click',()=>sendChat(b.dataset.question)));

  $$('.doctor-card').forEach(card=>card.addEventListener('click',()=>{
    doctor=card.dataset.doctor;
    $$('.doctor-card').forEach(c=>c.classList.toggle('selected',c===card));
    $('#doctorName').textContent=doctor==='sara'?'د. سارة':'د. آدم';
    $('#chatAvatar').textContent=doctor==='sara'?'👩🏻‍⚕️':'👨🏻‍⚕️';
    toast(`تم اختيار ${doctor==='sara'?'د. سارة':'د. آدم'} — رفيقك الافتراضي.`);
  }));

  $('#langBtn').addEventListener('click',()=>{
    lang=lang==='ar'?'en':'ar';
    document.documentElement.lang=lang;
    document.documentElement.dir=lang==='ar'?'rtl':'ltr';
    $$('[data-ar][data-en]').forEach(el=>el.textContent=el.dataset[lang]);
    $('#langBtn').textContent=lang==='ar'?'EN / ع':'ع / EN';
    const active=$('.nav-link.active')?.dataset.page||'dashboard';
    navigate(active);
    toast(lang==='ar'?'تم تغيير اللغة إلى العربية.':'Language switched to English. Note: some demo content remains Arabic.');
  });

  updateStats();
  updateHabits();
})();
