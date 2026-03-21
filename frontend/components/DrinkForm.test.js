import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DrinkForm from './DrinkForm';

describe('DrinkForm', () => {
  const users = [
    { id: 1, nickname: 'enzo' },
    { id: 2, nickname: 'lina' },
  ];

  it('submits selected drink payload', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();

    render(<DrinkForm users={users} onSubmit={onSubmit} />);

    await user.selectOptions(screen.getByLabelText('user-select'), '2');
    await user.clear(screen.getByLabelText('drink-type'));
    await user.type(screen.getByLabelText('drink-type'), 'wine');
    await user.clear(screen.getByLabelText('drink-amount'));
    await user.type(screen.getByLabelText('drink-amount'), '4');
    await user.click(screen.getByRole('button', { name: 'Add Drink' }));

    expect(onSubmit).toHaveBeenCalledWith({ userId: 2, drinkType: 'wine', amount: 4 });
  });

  it('supports empty user list fallback', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();

    render(<DrinkForm users={[]} onSubmit={onSubmit} />);

    await user.click(screen.getByRole('button', { name: 'Add Drink' }));

    expect(onSubmit).toHaveBeenCalledWith({ userId: 0, drinkType: 'beer', amount: 1 });
  });
});
