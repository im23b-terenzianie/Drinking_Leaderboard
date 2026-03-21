import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from './page';

describe('Home integration flow', () => {
  it('updates leaderboard after adding a drink', async () => {
    const user = userEvent.setup();

    render(<Home />);

    await user.selectOptions(screen.getByLabelText('user-select'), '2');
    await user.clear(screen.getByLabelText('drink-type'));
    await user.type(screen.getByLabelText('drink-type'), 'cola');
    await user.clear(screen.getByLabelText('drink-amount'));
    await user.type(screen.getByLabelText('drink-amount'), '3');
    await user.click(screen.getByRole('button', { name: 'Add Drink' }));

    expect(screen.getByText('lina added 3 cola')).toBeInTheDocument();

    const firstRow = screen.getByTestId('leaderboard-row-1');
    expect(firstRow).toHaveTextContent('lina');
    expect(firstRow).toHaveTextContent('3');
  });

  it('shows validation message for invalid input', async () => {
    const user = userEvent.setup();

    render(<Home />);

    await user.clear(screen.getByLabelText('drink-type'));
    await user.click(screen.getByRole('button', { name: 'Add Drink' }));

    expect(screen.getByText('Invalid drink input')).toBeInTheDocument();
  });
});
