describe('Drinking Leaderboard', () => {
  it('adds drinks and updates ranking', () => {
    cy.visit('/');
    cy.get('[aria-label="user-select"]').select('lina');
    cy.get('[aria-label="drink-type"]').clear().type('cola');
    cy.get('[aria-label="drink-amount"]').clear().type('4');
    cy.contains('Add Drink').click();

    cy.contains('lina added 4 cola').should('be.visible');
    cy.get('[data-testid="leaderboard-row-1"]').should('contain.text', 'lina');
  });
});
