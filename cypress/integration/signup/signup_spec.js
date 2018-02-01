// load chance library
var Chance = require('chance');
describe('User Registration', function () {
    var chance;
    before(function () {
        // instantiate chance
        chance = new Chance();
        cy.visit('/signup');
    });

    it('should register user given correct information', function () {
        cy.get('#signUpForm').within(function () {
            cy.get('input[name="name"]').type(chance.word());
            cy.get('input[name="email"]').type(chance.email());
            cy.get('input[name="password"]').type('password123');
            cy.root().submit();
        });
        cy.get('#heading').should('have.text', 'History');
    });

    it('should not register an existing user', function () {
        cy.visit('/signup');
        cy.get('#signUpForm').within(function () {
            cy.get('input[name="name"]').type('tester tester');
            cy.get('input[name="email"]').type('more@gmail.com');
            cy.get('input[name="password"]').type('password123');
            cy.root().submit();
        });
        cy.get('#error-signup').should('have.text', 'Error! Account with that email address already exists');
    });
});