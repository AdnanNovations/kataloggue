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

/** Detect legacy plain-text (no HTML tags) and convert \n to <br> */
export function normalizeDescription(text: string): string {
  if (!text) return '';
  // If text contains any HTML tags, return as-is
  if (/<[a-z][\s\S]*>/i.test(text)) return text;
  // Plain text — convert newlines to <br>
  return text.replace(/\n/g, '<br>');
}
