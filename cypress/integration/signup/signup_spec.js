// load chance library
const Chance = require('chance');
describe('User Registration', () => {
    let chance;
    before(() => {
        // instantiate chance
        chance = new Chance();
        cy.visit('/signup');
    });

    it('should register user given correct information', () => {
        cy.get('#signUpForm').within(() => {
            cy.get('input[name="name"]').type(chance.word());
            cy.get('input[name="email"]').type(chance.email());
            cy.get('input[name="password"]').type('password123');
            cy.root().submit();
        });
        cy.get('#heading').should('have.text', 'History');
    });

    it('should not register an existing user', () => {
        cy.visit('/signup');
        cy.get('#signUpForm').within(() => {
            cy.get('input[name="name"]').type('tester tester');
            cy.get('input[name="email"]').type('more@gmail.com');
            cy.get('input[name="password"]').type('password123');
            cy.root().submit();
        });
        cy.get('#error-signup').should('have.text', 'Error! Account with that email address already exists');
    });
});