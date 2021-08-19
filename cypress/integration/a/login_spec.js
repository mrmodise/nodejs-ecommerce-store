context("Logging users into the application", () => {
  specify("should fail to login user with incorrect credentials", () => {
    cy.visit("/login");
    cy.get("#email").type("tester1@gmail.com");
    cy.get("#password").type("password123");
    cy.get("#submit").click();
    cy.get("#error-login").should(
      "have.text",
      "Error! Oops! Wrong credentials"
    );
  });
});
