export const API_URL = import.meta.env.VITE_API_URL || (() => {
    console.error("❌ VITE_API_URL is not set! Add it to Vercel → Settings → Environment Variables.");
    return "";
})();