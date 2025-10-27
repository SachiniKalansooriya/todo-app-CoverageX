import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskCard from '../taskComponents/TaskCard';

const sampleTask = {
	id: 1,
	title: 'Sample Task',
	description: 'Do something important',
	completed: false,
	scheduledAt: '2025-10-27T10:30:00',
	created_at: '2025-10-27T09:00:00',
	updated_at: '2025-10-27T09:00:00',
};

describe('TaskCard', () => {
	test('renders title and description and dates', () => {
		render(<TaskCard task={sampleTask as any} onComplete={jest.fn()} />);

		expect(screen.getByText('Sample Task')).toBeInTheDocument();
		expect(screen.getByText('Do something important')).toBeInTheDocument();
		expect(screen.getByText(/Created:/)).toBeInTheDocument();
		expect(screen.getByText(/Scheduled:/)).toBeInTheDocument();
	});

	test('clicking Done calls onComplete and disables button', async () => {
		const mockComplete = jest.fn(() => Promise.resolve());
		render(<TaskCard task={sampleTask as any} onComplete={mockComplete} />);

		const btn = screen.getByTestId('done-button') as HTMLButtonElement;
		expect(btn).toBeEnabled();

		fireEvent.click(btn);

		// onComplete should be called with task id
		expect(mockComplete).toHaveBeenCalledWith(1);
	});
});

