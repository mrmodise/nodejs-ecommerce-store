describe('Logging users into the application', () => {
    it('should fail to login user with incorrect credentials', () => {
        cy.visit('/login');
        cy.get('#email').type('tester1@gmail.com');
        cy.get('#password').type('tester1');
        cy.get('#submit').click();
        cy.get('#error-login').should('have.text', 'Error! No user with such credentials found');
    })
});