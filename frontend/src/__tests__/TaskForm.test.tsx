import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskForm from '../taskComponents/TaskForm';

describe('TaskForm', () => {
	test('submits title/description and builds scheduledAt correctly', async () => {
		const user = userEvent.setup();
		const onSubmit = jest.fn();

		render(<TaskForm onSubmit={onSubmit} />);

		const titleInput = screen.getByTestId('title-input') as HTMLInputElement;
		const descInput = screen.getByTestId('description-input') as HTMLTextAreaElement;
		const submitBtn = screen.getByTestId('submit-button') as HTMLButtonElement;

		await user.type(titleInput, 'My Task');
		await user.type(descInput, 'Details');

		// submit
		await user.click(submitBtn);

		expect(onSubmit).toHaveBeenCalledTimes(1);
		const [title, desc, scheduledAt] = (onSubmit as jest.Mock).mock.calls[0];
		expect(title).toBe('My Task');
		expect(desc).toBe('Details');
		// scheduledAt should be a string in local ISO-like format
		expect(typeof scheduledAt).toBe('string');
		expect(scheduledAt).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
	});

	test('submit button disabled when loading', () => {
		const onSubmit = jest.fn();
		render(<TaskForm onSubmit={onSubmit} isLoading={true} />);
		const submitBtn = screen.getByTestId('submit-button') as HTMLButtonElement;
		expect(submitBtn).toBeDisabled();
	});
});

