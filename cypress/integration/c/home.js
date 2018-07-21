const chance = new Chance();
context('Navigate to search page', () => {
    let chance;
    before(() => {
        chance = new Chance();
        cy.visit('/signup');
    });

    specify('should navigate to the search page once logged in', () => {
        cy.get('#navbar').click();
        cy.get('#main-heading').should('have.text', 'Shop Smart, Save Big!');
        cy.get('#sub-heading').should('have.text', 'Starting point to create something more unique');
    });

    specify('search for random products', () => {
        cy.get('#searchForm').within(() => {
            cy.get('#search-box').type(chance.word());
            cy.root().submit();
        });

        cy.get('#no-products').should('have.text', 'No products found');

    });
});