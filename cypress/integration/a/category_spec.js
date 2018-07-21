context('Product Category', () => {

    // TODO: refactor these tests to avoid duplicates
    before(() => {
        cy.visit('/add-category');
    });

    specify('should add food category', () => {
        cy.get('#addCategoryForm').within(() => {
            cy.get('#category-name').type('food');
            cy.root().submit();
        });
        cy.get('#cat-confirmation').should('have.text', 'Info! Successfully added a category');
    });

    specify('should add clothes category', () => {
        cy.get('#addCategoryForm').within(() => {
            cy.get('#category-name').type('clothes');
            cy.root().submit();
        });
        cy.get('#cat-confirmation').should('have.text', 'Info! Successfully added a category');
    });
});