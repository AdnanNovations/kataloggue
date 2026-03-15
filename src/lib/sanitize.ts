import sanitizeHtml from 'sanitize-html';

const ALLOWED_TAGS = [
  'h2', 'h3', 'h4', 'p', 'br', 'strong', 'b', 'em', 'i', 'u',
  'ul', 'ol', 'li', 'a', 'blockquote', 'hr',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'pre', 'code',
];

/** Sanitize HTML description — whitelist safe tags, force safe links */
export function sanitizeDescription(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: {
      a: ['href', 'target', 'rel'],
      table: ['border', 'cellpadding', 'cellspacing'],
      th: ['style'],
      td: ['style'],
      tr: ['style'],
      pre: ['style'],
    },
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', {
        target: '_blank',
        rel: 'noopener noreferrer',
      }),
    },
  });
}

/** Strip all HTML tags — for SEO meta/JSON-LD */
export function stripHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [],
    allowedAttributes: {},
  }).trim();
}

/** Decode HTML entities (handles double-encoded content from Tiptap) */
function decodeEntities(html: string): string {
  return html
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&mdash;/g, '\u2014')
    .replace(/&ndash;/g, '\u2013');
}

/** Clean up Tiptap-wrapped raw HTML after decoding.
 *  Tiptap wraps every line in <p>, creating <p><h2>...</h2></p> and <p><br></p> spacers. */
function unwrapTiptapParagraphs(html: string): string {
  const blockTags = 'h[1-6]|ul|ol|li|blockquote|hr|table|thead|tbody|tr|td|th|pre|div';
  // Remove <p> wrapper around block elements: <p><h2>...</h2></p> → <h2>...</h2>
  let cleaned = html.replace(
    new RegExp(`<p>\\s*(<(?:${blockTags})[\\s>])`, 'gi'),
    '$1',
  );
  cleaned = cleaned.replace(
    new RegExp(`(</(?:${blockTags})>)\\s*</p>`, 'gi'),
    '$1',
  );
  // Remove empty paragraphs: <p><br></p>, <p><br /></p>, <p></p>
  cleaned = cleaned.replace(/<p>\s*(?:<br\s*\/?>)?\s*<\/p>/gi, '');
  // Collapse multiple <br> in a row to one
  cleaned = cleaned.replace(/(?:<br\s*\/?\s*>){3,}/gi, '<br><br>');
  return cleaned.trim();
}

/** Detect legacy plain-text (no HTML tags) and convert \n to <br>.
 *  Also fixes double-encoded HTML (e.g. Tiptap wrapping raw HTML as text). */
export function normalizeDescription(text: string): string {
  if (!text) return '';
  // If content has real tags but also contains encoded tags inside, decode + unwrap
  if (/<[a-z][\s\S]*>/i.test(text) && /&lt;[a-z]/i.test(text)) {
    return unwrapTiptapParagraphs(decodeEntities(text));
  }
  // If text contains any HTML tags, return as-is
  if (/<[a-z][\s\S]*>/i.test(text)) return text;
  // Plain text — convert newlines to <br>
  return text.replace(/\n/g, '<br>');
}
