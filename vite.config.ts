import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

const proxyTarget = process.env.VITE_RPC_PROXY_TARGET || 'http://localhost:3000';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	ssr: {
			noExternal: process.env.NODE_ENV === 'production' ? ['svelte-canvas', 'layerchart'] : []
	},
  optimizeDeps: {
    include: ['svelte-canvas', 'layerchart']
  },
	server: {
    proxy: {
      '/rpc': proxyTarget
    }
  }
});
