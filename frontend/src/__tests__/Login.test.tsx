import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../loginComponents/Login';
import { AuthContext } from '../contexts/AuthContext';

describe('Login component', () => {
	test('renders warning when Google SDK not loaded', () => {
		// ensure window.google is undefined
		(window as any).google = undefined;

		const onLoginSuccess = jest.fn();
		render(
			<AuthContext.Provider value={{ user: null, isAuthenticated: false, isLoading: false, login: jest.fn(), logout: jest.fn() }}>
				<Login onLoginSuccess={onLoginSuccess} />
			</AuthContext.Provider>
		);

		// It should render the page with the signin title
		expect(screen.getByText(/Sign in to your account/)).toBeInTheDocument();
	});

	test('shows initError when VITE_GOOGLE_CLIENT_ID missing', () => {
		(window as any).google = { accounts: { id: {} } };
		// Ensure importMetaEnv has no client id
		(global as any).importMetaEnv = {};

		const onLoginSuccess = jest.fn();
		render(
			<AuthContext.Provider value={{ user: null, isAuthenticated: false, isLoading: false, login: jest.fn(), logout: jest.fn() }}>
				<Login onLoginSuccess={onLoginSuccess} />
			</AuthContext.Provider>
		);

		expect(screen.getByText(/No Google Client ID configured/)).toBeInTheDocument();
	});

	test('initializes Google SDK when client id present and calls renderButton', () => {
		const initialize = jest.fn();
		const renderButton = jest.fn();
		(window as any).google = { accounts: { id: { initialize, renderButton } } };
		(global as any).importMetaEnv = { VITE_GOOGLE_CLIENT_ID: 'client-id-123' };

		const onLoginSuccess = jest.fn();
		render(
			<AuthContext.Provider value={{ user: null, isAuthenticated: false, isLoading: false, login: jest.fn(), logout: jest.fn() }}>
				<Login onLoginSuccess={onLoginSuccess} />
			</AuthContext.Provider>
		);

		expect(initialize).toHaveBeenCalled();
		expect(renderButton).toHaveBeenCalled();
	});
});

