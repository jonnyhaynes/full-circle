/* eslint-disable @typescript-eslint/no-explicit-any */

export function lexicalToHtml(value: unknown): string {
  if (!value || typeof value !== 'object') {
    return ''
  }

  const root = (value as any).root
  if (!root || !Array.isArray(root.children)) {
    return ''
  }

  return root.children.map((node: any) => renderNode(node)).join('')
}

function renderNode(node: any): string {
  if (!node) return ''

  if (node.type === 'paragraph') {
    return `<p>${(node.children || []).map((child: any) => renderNode(child)).join('')}</p>`
  }

  if (node.type === 'text') {
    let text = escapeHtml(node.text || '')
    if (node.format & 1) text = `<strong>${text}</strong>` // bold
    if (node.format & 2) text = `<em>${text}</em>` // italic
    if (node.format & 8) text = `<u>${text}</u>` // underline
    if (node.format & 4) text = `<s>${text}</s>` // strikethrough
    if (node.format & 64) text = `<sup>${text}</sup>` // superscript
    if (node.format & 128) text = `<sub>${text}</sub>` // subscript
    return text
  }

  if (node.type === 'link') {
    return `<a href="${node.url}">${(node.children || []).map((child: any) => renderNode(child)).join('')}</a>`
  }

  if (node.type === 'heading') {
    return `<h${node.tag}>${(node.children || []).map((child: any) => renderNode(child)).join('')}</h${node.tag}>`
  }

  return ''
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
