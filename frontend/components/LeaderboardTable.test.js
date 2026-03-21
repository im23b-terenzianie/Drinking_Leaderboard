import { render, screen } from '@testing-library/react';
import LeaderboardTable from './LeaderboardTable';

describe('LeaderboardTable', () => {
  it('sorts users by total drinks descending', () => {
    render(
      <LeaderboardTable
        users={[
          { id: 1, nickname: 'enzo', totalDrinks: 2 },
          { id: 2, nickname: 'lina', totalDrinks: 5 },
          { id: 3, nickname: 'mika', totalDrinks: 5 },
        ]}
      />
    );

    const firstRow = screen.getByTestId('leaderboard-row-1');
    expect(firstRow).toHaveTextContent('lina');
  });

  it('matches snapshot', () => {
    const { container } = render(
      <LeaderboardTable users={[{ id: 1, nickname: 'enzo', totalDrinks: 3 }]} />
    );

    expect(container).toMatchSnapshot();
  });
});
