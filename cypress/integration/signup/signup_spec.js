// load chance library
var Chance = require('chance');
describe('User Registration', function () {
    // instantiate chance
    var chance = new Chance();

    it('should register user given correct information', function () {
        cy.visit('/signup');
        cy.get('#signUpForm').within(function ($form) {
            cy.get('input[name="fullName"]').type(chance.word());
            cy.get('input[name="email"]').type(chance.email());
            cy.get('input[name="password"]').type('password123');
            cy.root().submit();
        });
        cy.get('#heading').should('have.text', 'History');
    })
});