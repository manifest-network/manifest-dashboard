import Color from 'colorjs.io';

// Get the color from CSS variable
// The variable should be formatted as --variable-name. Example: --color-tertiary-500
export function getColorFromCSS(variable: string, fallback?: string) {
  let themeColor = fallback ? fallback : '#E5703D';

  if (typeof window !== 'undefined') {
    const color = getComputedStyle(document.documentElement)
      .getPropertyValue(variable).trim();
    if (color) themeColor = color;
  }

  return themeColor
}

export function computedColor(cssColor: string): string {
  const el = document.createElement('div');
  el.style.color = cssColor;
  document.body.append(el);
  const val = getComputedStyle(el).color;  // "rgb(r, g, b)"
  el.remove();

  let color = new Color(val);
  color = color.to('srgb');
  return color.toString({format: 'hex'});
}