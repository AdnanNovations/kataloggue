import sanitizeHtml from 'sanitize-html';

const ALLOWED_TAGS = [
  'h2', 'h3', 'p', 'br', 'strong', 'b', 'em', 'i', 'u',
  'ul', 'ol', 'li', 'a', 'blockquote', 'hr',
];

/** Sanitize HTML description — whitelist safe tags, force safe links */
export function sanitizeDescription(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: {
      a: ['href', 'target', 'rel'],
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

/** Detect legacy plain-text (no HTML tags) and convert \n to <br>.
 *  Also fixes double-encoded HTML (e.g. Tiptap wrapping raw HTML as text). */
export function normalizeDescription(text: string): string {
  if (!text) return '';
  // If content has real tags but also contains encoded tags inside, decode them
  if (/<[a-z][\s\S]*>/i.test(text) && /&lt;[a-z]/i.test(text)) {
    return decodeEntities(text);
  }
  // If text contains any HTML tags, return as-is
  if (/<[a-z][\s\S]*>/i.test(text)) return text;
  // Plain text — convert newlines to <br>
  return text.replace(/\n/g, '<br>');
}
