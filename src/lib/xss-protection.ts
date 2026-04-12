/**
 * XSS Protection Utilities
 * Sanitizes user-generated content to prevent XSS attacks
 */

/**
 * Basic HTML escaping - for simple cases
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

/**
 * Remove dangerous HTML tags and attributes
 * Whitelist approach for safer content
 */
export function sanitizeHTML(dirty: string): string {
  // Create a temporary element to parse HTML
  const div =
    typeof window !== "undefined" ? document.createElement("div") : null;
  if (!div) return escapeHtml(dirty); // Server-side fallback

  div.innerHTML = dirty;

  // Whitelist of allowed tags
  const allowedTags = new Set([
    "p",
    "br",
    "strong",
    "em",
    "u",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "ul",
    "ol",
    "li",
    "a",
    "code",
    "pre",
    "blockquote",
  ]);

  // Whitelist of allowed attributes
  const allowedAttributes = new Map([
    ["a", ["href", "title"]],
    ["img", ["src", "alt", "width", "height"]],
  ]);

  function cleanNode(node: Node): void {
    if (node.nodeType === Node.TEXT_NODE) {
      return;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;
      // Remove if tag is not allowed
      if (!allowedTags.has(element.tagName.toLowerCase())) {
        while (node.firstChild) {
          cleanNode(node.firstChild);
          element.parentNode?.insertBefore(node.firstChild, element);
        }
        element.parentNode?.removeChild(element);
        return;
      }

      // Remove disallowed attributes
      const allowed =
        allowedAttributes.get(element.tagName.toLowerCase()) || [];
      for (let i = element.attributes.length - 1; i >= 0; i--) {
        const attr = element.attributes[i];
        if (!allowed.includes(attr.name)) {
          element.removeAttribute(attr.name);
        }
      }

      // Validate href to prevent javascript: protocol
      if (element.tagName.toLowerCase() === "a") {
        const href = element.getAttribute("href") || "";
        if (
          href.toLowerCase().startsWith("javascript:") ||
          href.toLowerCase().startsWith("data:")
        ) {
          element.setAttribute("href", "#");
        }
      }
    }

    // Recursively clean child nodes
    const childNodes = Array.from(node.childNodes);
    childNodes.forEach((child) => cleanNode(child));
  }

  cleanNode(div);
  return div.innerHTML;
}

/**
 * Server-side sanitization using regex
 * This is a simplified version for server-side rendering
 */
export function sanitizeHTMLServer(dirty: string): string {
  // Remove script tags and their content
  let sanitized = dirty.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    "",
  );

  // Remove event handlers
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, "");
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, "");

  // Remove style tags
  sanitized = sanitized.replace(
    /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi,
    "",
  );

  // Remove iframe, embed, object tags
  sanitized = sanitized.replace(/<(iframe|embed|object)[^>]*>/gi, "");

  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, "");

  // Remove data: protocol (for images)
  sanitized = sanitized.replace(/\bdata:/gi, "");

  return sanitized;
}

/**
 * Safely render HTML in React
 * Returns sanitized HTML for dangerouslySetInnerHTML
 */
export function createSafeHTML(html: string): { __html: string } {
  return {
    __html: sanitizeHTMLServer(html),
  };
}

/**
 * Validate and sanitize blog content
 */
export function validateAndSanitizeBlogContent(content: string): string {
  if (!content || typeof content !== "string") {
    throw new Error("Content must be a non-empty string");
  }

  if (content.length > 50000) {
    throw new Error("Content exceeds maximum length of 50000 characters");
  }

  return sanitizeHTMLServer(content);
}
