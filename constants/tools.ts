export type CategoryType = 'pdf' | 'convert' | 'ai' | 'business' | 'text' | 'design' | 'dev';
export type IconSet = 'Ionicons' | 'MaterialCommunityIcons';

export interface Tool {
  id: string;
  name: string;
  description: string;
  iconSet: IconSet;
  iconName: string;
  category: CategoryType;
}

export const ALL_TOOLS: Tool[] = [
  // ─── PDF ───
  { id: 'merge',            name: 'دمج PDF',              description: 'ادمج أكثر من ملف في مستند واحد.',          iconSet: 'MaterialCommunityIcons', iconName: 'set-merge',                   category: 'pdf' },
  { id: 'split',            name: 'تقسيم PDF',            description: 'قسّم الملف إلى صفحات أو ملفات مستقلة.',    iconSet: 'MaterialCommunityIcons', iconName: 'content-cut',                 category: 'pdf' },
  { id: 'compress',         name: 'ضغط PDF',              description: 'خفّض حجم الملف مع الحفاظ على الجودة.',      iconSet: 'MaterialCommunityIcons', iconName: 'archive-arrow-down-outline',  category: 'pdf' },
  { id: 'rotate',           name: 'تدوير الصفحات',        description: 'غيّر اتجاه الصفحات داخل الملف.',            iconSet: 'MaterialCommunityIcons', iconName: 'rotate-right',                category: 'pdf' },
  { id: 'extract-pages',    name: 'استخراج الصفحات',      description: 'استخرج صفحات محددة في ملف مستقل.',          iconSet: 'MaterialCommunityIcons', iconName: 'file-export-outline',         category: 'pdf' },
  { id: 'delete-pages',     name: 'حذف الصفحات',          description: 'احذف الصفحات غير المطلوبة بسهولة.',         iconSet: 'MaterialCommunityIcons', iconName: 'delete-outline',              category: 'pdf' },
  { id: 'organize',         name: 'تنظيم الصفحات',        description: 'رتّب الصفحات وأعد ترتيبها بسهولة.',         iconSet: 'MaterialCommunityIcons', iconName: 'sort',                        category: 'pdf' },
  { id: 'crop',             name: 'قص الصفحات',           description: 'قص الحواف والمساحات البيضاء.',               iconSet: 'MaterialCommunityIcons', iconName: 'crop',                        category: 'pdf' },
  { id: 'resize',           name: 'تغيير المقاس',         description: 'عدّل مقاس الصفحة إلى أبعاد محددة.',         iconSet: 'MaterialCommunityIcons', iconName: 'resize',                      category: 'pdf' },
  { id: 'add-page-numbers', name: 'ترقيم الصفحات',        description: 'أضف أرقام الصفحات بتنسيق واضح.',            iconSet: 'MaterialCommunityIcons', iconName: 'numeric',                     category: 'pdf' },
  { id: 'header-footer',    name: 'رأس وتذييل',           description: 'أضف نصًا ثابتًا أعلى وأسفل الصفحات.',       iconSet: 'MaterialCommunityIcons', iconName: 'format-header-pound',         category: 'pdf' },
  { id: 'watermark',        name: 'علامة مائية',          description: 'أضف ختمًا أو نصًا مائيًا على الملف.',       iconSet: 'MaterialCommunityIcons', iconName: 'water-outline',               category: 'pdf' },
  { id: 'protect',          name: 'حماية PDF',            description: 'أضف كلمة مرور للملف.',                      iconSet: 'MaterialCommunityIcons', iconName: 'lock-outline',                category: 'pdf' },
  { id: 'unlock',           name: 'فتح الحماية',          description: 'أزل كلمة المرور من ملف PDF.',               iconSet: 'MaterialCommunityIcons', iconName: 'lock-open-outline',           category: 'pdf' },
  { id: 'edit-metadata',    name: 'تعديل الوصف',          description: 'حدّث عنوان الملف وبياناته.',                 iconSet: 'MaterialCommunityIcons', iconName: 'file-edit-outline',           category: 'pdf' },
  { id: 'flatten',          name: 'تسطيح المستند',        description: 'حوّل العناصر التفاعلية إلى محتوى ثابت.',     iconSet: 'MaterialCommunityIcons', iconName: 'layers-triple-outline',       category: 'pdf' },
  { id: 'repair',           name: 'إصلاح PDF',            description: 'جرّب إصلاح ملف PDF التالف.',                iconSet: 'MaterialCommunityIcons', iconName: 'tools',                       category: 'pdf' },
  { id: 'grayscale',        name: 'أبيض وأسود',           description: 'حوّل الملف إلى تدرج رمادي.',                iconSet: 'MaterialCommunityIcons', iconName: 'circle-half-full',            category: 'pdf' },
  { id: 'extract-images',   name: 'استخراج الصور',        description: 'استخرج الصور الأصلية من الملف.',             iconSet: 'MaterialCommunityIcons', iconName: 'image-multiple-outline',      category: 'pdf' },
  { id: 'ocr',              name: 'استخراج النص OCR',     description: 'استخرج النص من الملفات الممسوحة.',           iconSet: 'MaterialCommunityIcons', iconName: 'text-recognition',            category: 'pdf' },

  // ─── تحويل ───
  { id: 'pdf-to-jpg',       name: 'PDF إلى JPG',          description: 'حوّل صفحات PDF إلى صور.',                   iconSet: 'MaterialCommunityIcons', iconName: 'file-image-outline',          category: 'convert' },
  { id: 'jpg-to-pdf',       name: 'صور إلى PDF',          description: 'حوّل صورة أو أكثر إلى PDF واحد.',            iconSet: 'MaterialCommunityIcons', iconName: 'image-plus',                  category: 'convert' },
  { id: 'word-to-pdf',      name: 'Word إلى PDF',         description: 'حوّل ملفات Word إلى PDF.',                   iconSet: 'MaterialCommunityIcons', iconName: 'file-word-box',               category: 'convert' },
  { id: 'excel-to-pdf',     name: 'Excel إلى PDF',        description: 'حوّل ملفات Excel إلى PDF.',                  iconSet: 'MaterialCommunityIcons', iconName: 'file-excel-box',              category: 'convert' },

  // ─── ذكاء اصطناعي ───
  { id: 'ai-chat',          name: 'محادثة PDF',           description: 'اسأل مباشرة عن محتوى الملف.',               iconSet: 'MaterialCommunityIcons', iconName: 'message-processing-outline',  category: 'ai' },
  { id: 'ai-summarize',     name: 'ملخص ذكي',             description: 'ملخص عربي سريع وواضح للمستند.',              iconSet: 'MaterialCommunityIcons', iconName: 'text-box-search-outline',     category: 'ai' },
  { id: 'ai-tables',        name: 'استخراج الجداول',      description: 'استخرج الجداول بصيغة أوضح.',                 iconSet: 'MaterialCommunityIcons', iconName: 'table-large',                 category: 'ai' },
  { id: 'ai-image-gen',     name: 'توليد الصور',          description: 'ولّد صورة احترافية من وصف نصي.',              iconSet: 'MaterialCommunityIcons', iconName: 'image-edit-outline',          category: 'ai' },
  { id: 'prompt-gen',       name: 'مولد الأوامر',         description: 'ولّد برومبت احترافي بسرعة.',                  iconSet: 'MaterialCommunityIcons', iconName: 'lightning-bolt-outline',      category: 'ai' },
  { id: 'prompt-check',     name: 'فاحص الأوامر',         description: 'افحص البرومبت وحسّنه.',                      iconSet: 'MaterialCommunityIcons', iconName: 'clipboard-check-outline',     category: 'ai' },
  { id: 'ai-detector',      name: 'كاشف الذكاء',          description: 'تحقق إن كان النص مولدًا آليًا.',              iconSet: 'MaterialCommunityIcons', iconName: 'robot-outline',               category: 'ai' },
  { id: 'humanizer',        name: 'أنسنة النصوص',         description: 'حوّل النص إلى صياغة أكثر سلاسة.',            iconSet: 'MaterialCommunityIcons', iconName: 'account-edit-outline',        category: 'ai' },

  // ─── أعمال وإدارة ───
  { id: 'qr-code',          name: 'مولّد QR',             description: 'ولّد رمز QR لأي رابط أو نص.',                iconSet: 'MaterialCommunityIcons', iconName: 'qrcode',                      category: 'business' },
  { id: 'barcode',          name: 'مولّد الباركود',       description: 'ولّد باركود لمنتجاتك وخدماتك.',              iconSet: 'MaterialCommunityIcons', iconName: 'barcode',                     category: 'business' },
  { id: 'invoice',          name: 'مولّد الفواتير',       description: 'أنشئ فاتورة احترافية في ثوانٍ.',              iconSet: 'MaterialCommunityIcons', iconName: 'receipt',                     category: 'business' },
  { id: 'whatsapp-link',    name: 'رابط واتساب',          description: 'ولّد رابط واتساب مباشر بدون حفظ الرقم.',     iconSet: 'MaterialCommunityIcons', iconName: 'whatsapp',                    category: 'business' },
  { id: 'email-signature',  name: 'توقيع البريد',         description: 'صمّم توقيع بريد إلكتروني احترافي.',           iconSet: 'MaterialCommunityIcons', iconName: 'email-edit-outline',          category: 'business' },

  // ─── نصوص ───
  { id: 'text-tools',       name: 'معالجة النصوص',        description: 'أدوات تحويل النصوص وتنسيقها.',               iconSet: 'MaterialCommunityIcons', iconName: 'format-text',                 category: 'text' },
  { id: 'calculators',      name: 'الحاسبات',             description: 'حاسبات متنوعة للأعمال والحياة اليومية.',     iconSet: 'MaterialCommunityIcons', iconName: 'calculator-variant-outline',  category: 'text' },

  // ─── تصميم وصور ───
  { id: 'color-tools',      name: 'أدوات الألوان',        description: 'تحويل ومقارنة وتوليد الألوان.',               iconSet: 'MaterialCommunityIcons', iconName: 'palette-outline',             category: 'design' },
  { id: 'image-tools',      name: 'محرر الصور',           description: 'ضغط وتحويل وتعديل الصور.',                   iconSet: 'MaterialCommunityIcons', iconName: 'image-multiple-outline',        category: 'design' },

  // ─── مطورين ───

  { id: 'sign-pdf',       name: 'توقيع PDF',          description: 'أضف توقيعك الإلكتروني على الملف.',        iconSet: 'MaterialCommunityIcons', iconName: 'draw-pen',                        category: 'pdf' },
  { id: 'scan-document',  name: 'مسح المستندات',       description: 'امسح المستندات بالكاميرا وحوّلها PDF.',    iconSet: 'MaterialCommunityIcons', iconName: 'camera-outline',              category: 'pdf' },
  { id: 'fill-pdf-form',  name: 'ملء النماذج',         description: 'املأ نماذج PDF إلكترونياً.',               iconSet: 'MaterialCommunityIcons', iconName: 'file-edit-outline',                    category: 'pdf' },
  { id: 'edit-pdf-text',  name: 'تحرير نص PDF',        description: 'أضف نصوصاً على ملف PDF.',                  iconSet: 'MaterialCommunityIcons', iconName: 'pencil-box-outline',               category: 'pdf' },
  { id: 'pdf-reader',     name: 'قارئ PDF',            description: 'اعرض ملفات PDF في التطبيق.',               iconSet: 'MaterialCommunityIcons', iconName: 'file-pdf-box',                category: 'pdf' },
  { id: 'pdf-to-pptx',   name: 'PDF إلى PowerPoint',  description: 'حوّل PDF إلى عرض تقديمي.',                 iconSet: 'MaterialCommunityIcons', iconName: 'file-powerpoint-box',         category: 'convert' },
  { id: 'pdf-to-excel',  name: 'PDF إلى Excel',        description: 'حوّل PDF إلى جدول Excel.',                 iconSet: 'MaterialCommunityIcons', iconName: 'file-excel-box',              category: 'convert' },
  { id: 'pdf-a',         name: 'PDF/A أرشفة',          description: 'حوّل PDF لصيغة الأرشفة الدولية.',          iconSet: 'MaterialCommunityIcons', iconName: 'archive-outline',             category: 'convert' },
  { id: 'html-to-pdf',   name: 'HTML إلى PDF',         description: 'حوّل صفحات الويب إلى PDF.',                iconSet: 'MaterialCommunityIcons', iconName: 'web',                         category: 'convert' },
  { id: 'translate-pdf', name: 'ترجمة PDF',            description: 'ترجم محتوى PDF بالذكاء الاصطناعي.',        iconSet: 'MaterialCommunityIcons', iconName: 'translate',                   category: 'ai' },
  { id: 'compare-pdf',   name: 'مقارنة مستندين',       description: 'قارن بين ملفين PDF واكتشف الفروقات.',      iconSet: 'MaterialCommunityIcons', iconName: 'compare-horizontal',                     category: 'ai' },
  { id: 'redact-pdf',    name: 'حجب المعلومات',        description: 'احجب النصوص الحساسة من PDF.',               iconSet: 'MaterialCommunityIcons', iconName: 'eraser-variant',                      category: 'pdf' },
  { id: 'zakat',         name: 'حاسبة الزكاة',         description: 'احسب زكاة مالك بسهولة.',                   iconSet: 'MaterialCommunityIcons', iconName: 'calendar-star',               category: 'business' },
  { id: 'support',       name: 'الدعم الفني',          description: 'أرسل بلاغ دعم فني مع صورة.',               iconSet: 'MaterialCommunityIcons', iconName: 'headset',                     category: 'business' },
  { id: 'dev-tools',        name: 'أدوات المطورين',       description: 'Base64، JSON، UUID وأكثر.',                  iconSet: 'MaterialCommunityIcons', iconName: 'code-braces',                 category: 'dev' },
];

export const CATEGORIES: { id: 'all' | CategoryType; name: string }[] = [
  { id: 'all',      name: 'الكل' },
  { id: 'pdf',      name: 'PDF' },
  { id: 'convert',  name: 'تحويل' },
  { id: 'ai',       name: 'ذكاء اصطناعي' },
  { id: 'business', name: 'أعمال' },
  { id: 'text',     name: 'نصوص' },
  { id: 'design',   name: 'تصميم' },
  { id: 'dev',      name: 'مطورين' },
];

export const PDF_TOOLS      = ALL_TOOLS.filter((t) => t.category === 'pdf');
export const AI_TOOLS       = ALL_TOOLS.filter((t) => t.category === 'ai');
export const CONVERT_TOOLS  = ALL_TOOLS.filter((t) => t.category === 'convert');
export const BUSINESS_TOOLS = ALL_TOOLS.filter((t) => t.category === 'business');

export const HOME_PDF_IDS = ['merge', 'split', 'compress', 'protect', 'ocr', 'rotate'];
export const HOME_AI_IDS  = ['ai-chat', 'ai-summarize', 'prompt-gen', 'humanizer'];

export const getToolById = (id?: string) => ALL_TOOLS.find((t) => t.id === id);// سيتم إضافتها قبل السطر الأخير
