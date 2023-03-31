import sanitizeHtml from 'sanitize-html';

export const sanitize = str =>
  sanitizeHtml(str, {
    allowedTags: [],
    allowedAttributes: {},
  });
