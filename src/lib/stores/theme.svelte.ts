type ThemeMode = 'light' | 'dark';

/**
 * Svelte 5 runes-based theme store with localStorage persistence.
 * Handles SSR safely by deferring browser-only operations.
 */
function createThemeState() {
  let mode = $state<ThemeMode>('dark');
  let initialized = $state(false);

  return {
    get mode() {
      return mode;
    },
    get initialized() {
      return initialized;
    },
    get isDark() {
      return mode === 'dark';
    },
    /**
     * Initialize theme from localStorage. Call this in a client-side effect.
     */
    init() {
      if (typeof window === 'undefined') return;

      const stored = window.localStorage.getItem('mode');
      if (stored === 'light' || stored === 'dark') {
        mode = stored;
      }

      // Apply initial theme to DOM
      document.documentElement.setAttribute('data-mode', mode);
      initialized = true;
    },
    /**
     * Set the theme mode and persist to localStorage.
     */
    set(value: ThemeMode) {
      mode = value;

      if (typeof window === 'undefined') return;

      document.documentElement.setAttribute('data-mode', value);
      window.localStorage.setItem('mode', value);
    },
    /**
     * Toggle between light and dark mode.
     */
    toggle() {
      this.set(mode === 'dark' ? 'light' : 'dark');
    }
  };
}

export const theme = createThemeState();
