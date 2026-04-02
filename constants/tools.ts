export type CategoryType = 'pdf' | 'convert' | 'ai' | 'business' | 'dev';

export interface Tool {
  id: string;
  name: string;
  icon: string;
  category: CategoryType;
  url: string;
}

export const ALL_TOOLS: Tool[] = [
  { id: 'merge', name: 'دمج PDF', icon: '🔗', category: 'pdf', url: 'https://pdf.amr7.io/tools/merge' },
  { id: 'split', name: 'تقسيم PDF', icon: '✂️', category: 'pdf', url: 'https://pdf.amr7.io/tools/split' },
  { id: 'compress', name: 'ضغط PDF', icon: '🗜️', category: 'pdf', url: 'https://pdf.amr7.io/tools/compress' },
  { id: 'rotate', name: 'تدوير الصفحات', icon: '🔄', category: 'pdf', url: 'https://pdf.amr7.io/tools/rotate' },
  { id: 'extract-pages', name: 'استخراج الصفحات', icon: '📄', category: 'pdf', url: 'https://pdf.amr7.io/tools/extract-pages' },
  { id: 'delete-pages', name: 'حذف الصفحات', icon: '🗑️', category: 'pdf', url: 'https://pdf.amr7.io/tools/delete-pages' },
  { id: 'organize', name: 'تنظيم الصفحات', icon: '📋', category: 'pdf', url: 'https://pdf.amr7.io/tools/organize' },
  { id: 'crop', name: 'قص الصفحات', icon: '📐', category: 'pdf', url: 'https://pdf.amr7.io/tools/crop' },
  { id: 'resize', name: 'تغيير المقاس', icon: '📏', category: 'pdf', url: 'https://pdf.amr7.io/tools/resize' },
  { id: 'add-page-numbers', name: 'ترقيم الصفحات', icon: '🔢', category: 'pdf', url: 'https://pdf.amr7.io/tools/add-page-numbers' },
  { id: 'header-footer', name: 'رأس وتذييل', icon: '📝', category: 'pdf', url: 'https://pdf.amr7.io/tools/header-footer-pdf' },
  { id: 'watermark', name: 'علامة مائية', icon: '💧', category: 'pdf', url: 'https://pdf.amr7.io/tools/watermark' },
  { id: 'protect', name: 'حماية PDF', icon: '🔒', category: 'pdf', url: 'https://pdf.amr7.io/tools/protect' },
  { id: 'unlock', name: 'فتح الحماية', icon: '🔓', category: 'pdf', url: 'https://pdf.amr7.io/tools/unlock' },
  { id: 'edit-metadata', name: 'تعديل الوصف', icon: '✏️', category: 'pdf', url: 'https://pdf.amr7.io/tools/edit-metadata' },
  { id: 'flatten', name: 'تسطيح المستند', icon: '📑', category: 'pdf', url: 'https://pdf.amr7.io/tools/flatten' },
  { id: 'repair', name: 'إصلاح PDF', icon: '🔧', category: 'pdf', url: 'https://pdf.amr7.io/tools/repair' },
  { id: 'grayscale', name: 'أبيض وأسود', icon: '⬛', category: 'pdf', url: 'https://pdf.amr7.io/tools/grayscale' },
  { id: 'extract-images', name: 'استخراج الصور', icon: '🖼️', category: 'pdf', url: 'https://pdf.amr7.io/tools/extract-images' },
  { id: 'ocr', name: 'استخراج النص OCR', icon: '🔍', category: 'pdf', url: 'https://pdf.amr7.io/tools/ocr' },
  { id: 'pdf-editor', name: 'محرر PDF', icon: '📝', category: 'pdf', url: 'https://pdf.amr7.io/tools/pdf-editor' },
  { id: 'pdf-to-jpg', name: 'PDF إلى JPG', icon: '🖼️', category: 'convert', url: 'https://pdf.amr7.io/tools/pdf-to-jpg' },
  { id: 'jpg-to-pdf', name: 'صور إلى PDF', icon: '📸', category: 'convert', url: 'https://pdf.amr7.io/tools/jpg-to-pdf' },
  { id: 'word-to-pdf', name: 'Word إلى PDF', icon: '📘', category: 'convert', url: 'https://pdf.amr7.io/tools/word-to-pdf' },
  { id: 'excel-to-pdf', name: 'Excel إلى PDF', icon: '📊', category: 'convert', url: 'https://pdf.amr7.io/tools/excel-to-pdf' },
  { id: 'ai-chat', name: 'محادثة PDF', icon: '💬', category: 'ai', url: 'https://pdf.amr7.io/tools/ai-chat-pdf' },
  { id: 'ai-summarize', name: 'ملخص ذكي', icon: '📝', category: 'ai', url: 'https://pdf.amr7.io/tools/ai-summarizer' },
  { id: 'ai-tables', name: 'استخراج الجداول', icon: '📊', category: 'ai', url: 'https://pdf.amr7.io/tools/ai-extract-tables' },
  { id: 'ai-image', name: 'توليد الصور', icon: '🎨', category: 'ai', url: 'https://pdf.amr7.io/tools/ai-image-gen' },
  { id: 'prompt-gen', name: 'مولد الأوامر', icon: '⚡', category: 'ai', url: 'https://pdf.amr7.io/tools/prompt-generator' },
  { id: 'prompt-check', name: 'فاحص الأوامر', icon: '✅', category: 'ai', url: 'https://pdf.amr7.io/tools/prompt-checker' },
  { id: 'ai-detector', name: 'كاشف الذكاء', icon: '🤖', category: 'ai', url: 'https://pdf.amr7.io/tools/ai-detector' },
  { id: 'humanizer', name: 'أنسنة النصوص', icon: '🧠', category: 'ai', url: 'https://pdf.amr7.io/tools/humanizer' },
  { id: 'qr', name: 'مولّد QR', icon: '⬛', category: 'business', url: 'https://pdf.amr7.io/tools/qr-code' },
  { id: 'barcode', name: 'مولّد الباركود', icon: '📊', category: 'business', url: 'https://pdf.amr7.io/tools/barcode' },
  { id: 'invoice', name: 'مولّد الفواتير', icon: '🧾', category: 'business', url: 'https://pdf.amr7.io/tools/invoice' },
  { id: 'whatsapp', name: 'رابط واتساب', icon: '📱', category: 'business', url: 'https://pdf.amr7.io/tools/whatsapp-link' },
  { id: 'email-sig', name: 'توقيع البريد', icon: '✉️', category: 'business', url: 'https://pdf.amr7.io/tools/email-signature' },
  { id: 'dev-tools', name: 'أدوات المطورين', icon: '💻', category: 'dev', url: 'https://pdf.amr7.io/tools/dev-tools' },
  { id: 'text-tools', name: 'معالجة النصوص', icon: '📝', category: 'dev', url: 'https://pdf.amr7.io/tools/text-tools' },
  { id: 'calculators', name: 'الحاسبات', icon: '🧮', category: 'dev', url: 'https://pdf.amr7.io/tools/calculators' },
  { id: 'color-tools', name: 'أدوات الألوان', icon: '🎨', category: 'dev', url: 'https://pdf.amr7.io/tools/color-tools' },
  { id: 'image-tools', name: 'محرر الصور', icon: '🖼️', category: 'dev', url: 'https://pdf.amr7.io/tools/image-tools' },
];

export const CATEGORIES = [
  { id: 'all', name: 'الكل' },
  { id: 'pdf', name: 'PDF' },
  { id: 'convert', name: 'تحويل' },
  { id: 'ai', name: 'ذكاء اصطناعي' },
  { id: 'business', name: 'أعمال' },
  { id: 'dev', name: 'مطورين' },
];

export const AI_TOOLS = ALL_TOOLS.filter(t => t.category === 'ai');
export const PDF_TOOLS = ALL_TOOLS.filter(t => t.category === 'pdf');
export const CONVERT_TOOLS = ALL_TOOLS.filter(t => t.category === 'convert');
export const BUSINESS_TOOLS = ALL_TOOLS.filter(t => t.category === 'business');
export const DEV_TOOLS = ALL_TOOLS.filter(t => t.category === 'dev');
