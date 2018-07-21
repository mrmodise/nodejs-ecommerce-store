context('Product Category', () => {
    specify('should add food category', () => {
        cy.visit('/add-category');
        cy.get('#addCategoryForm').within(() => {
            cy.get('#category-name').type('groceries');
            cy.root().submit();
        });
        cy.get('#cat-confirmation').should('have.text', 'Info! Successfully added a category');
    });
});