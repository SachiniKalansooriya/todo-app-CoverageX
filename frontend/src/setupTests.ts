import '@testing-library/jest-dom';

// Provide a minimal implementation for import.meta.env used in components during tests
// Jest doesn't provide import.meta by default; components access import.meta.env.VITE_GOOGLE_CLIENT_ID
// Tests can set (global as any).importMetaEnv to override values if needed.
if (!(global as any).importMetaEnv) {
	(global as any).importMetaEnv = {};
}

// Helper to expose import.meta.env.VITE_GOOGLE_CLIENT_ID in components that read import.meta.env
Object.defineProperty(global, 'importMeta', {
	get: () => ({ env: (global as any).importMetaEnv }),
});
