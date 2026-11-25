// BetOnYou design tokens (approved design language, Nov 2026). Reference values for all V2 pages and shared components.
export const color = {
  ink: '#25103F', body: '#3A2B55', muted: '#6B5F82', night: '#0B0614',
  violet: '#7B45F5', violetDeep: '#5A2FD0', lavender: '#C9B6FB', lilac: '#B9A1FA',
  white: '#FFFFFF', mist: '#F6F2FE', tint: '#F3EFFA', tintStrong: '#EDE4FF', line: '#E6DEF4', lineStrong: '#D9CFF0',
  amber: '#F8B733', success: '#177A40'
};
// Illustration tints: only inside feature illustration panels that tell the matching product story.
export const panel = { lavender: ['#E6DAFD', '#F6F1FF'], peach: ['#FBD9C5', '#FDF0E8'], mint: ['#BFE9DA', '#EEF9F4'], butter: ['#FCE7B0', '#FFF8E6'] };
export const font = { family: "'Bricolage Grotesque', system-ui, sans-serif", regular: 400, medium: 500, semibold: 600 };
export const type = {
  display: { size: 'clamp(44px,6vw,96px)', weight: 400, lh: 1, ls: '-.05em' },
  displayHome: { size: 'clamp(40px,5vw,76px)', weight: 500, lh: 1.02, ls: '-.045em' },
  h2: { size: 'clamp(24px,3.6vw,52px)', weight: 500, lh: 1.08, ls: '-.04em' },
  h3: { size: 'clamp(22px,2.4vw,32px)', weight: 500, lh: 1.15, ls: '-.03em' },
  lead: { size: 'clamp(17px,1.4vw,20px)', weight: 400, lh: 1.6 },
  body: { size: '16px', weight: 400, lh: 1.6 },
  eyebrow: { size: '13px', weight: 600, ls: '.16em', color: '#7B45F5', transform: 'uppercase' }
};
export const radius = { xs: '8px', sm: '14px', md: '22px', lg: '32px', pill: '100px' };
export const shadow = { sm: '0 1px 2px rgba(37,16,63,.06), 0 8px 24px -16px rgba(37,16,63,.18)', lg: '0 40px 80px -40px rgba(37,16,63,.40)', float: '0 12px 28px -14px rgba(37,16,63,.22)' };
export const space = { container: '1400px', gutter: 'clamp(20px,5vw,80px)', section: 'clamp(72px,12vh,140px)', scale: [4, 8, 12, 16, 24, 32, 48, 64, 96] };
export const motion = { ease: 'cubic-bezier(.22,1,.36,1)', fast: 180, base: 400, slow: 800 };
