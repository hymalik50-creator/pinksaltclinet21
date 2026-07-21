/**
 * Slug Generation Utility
 * Converts strings to URL-friendly slugs
 */

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
};

/**
 * Generate unique slug by appending timestamp if needed
 */
const generateUniqueSlug = (text, timestamp = false) => {
  const baseSlug = slugify(text);
  
  if (timestamp) {
    const uniqueId = Date.now().toString(36);
    return `${baseSlug}-${uniqueId}`;
  }
  
  return baseSlug;
};

module.exports = {
  slugify,
  generateUniqueSlug,
};
