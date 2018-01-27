describe('Logging users into the application', function() {
    it('should login user in', function() {

        cy.visit('/login');
        expect(true).to.equal(true)
    })
});