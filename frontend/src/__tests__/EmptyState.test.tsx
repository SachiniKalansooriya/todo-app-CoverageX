import React from 'react';
import { render, screen } from '@testing-library/react';
import EmptyState from '../taskComponents/EmptyState';

test('renders empty state message', () => {
	render(<EmptyState />);
	expect(screen.getByText(/No Tasks Yet!/)).toBeInTheDocument();
	expect(screen.getByText(/Your task list is empty/)).toBeInTheDocument();
});

