/// <reference types="../../cypress/support" />
// @ts-check
describe("CSRF protection", () => {
  describe("on formular", () => {
    it("should fail on direct post", () => {
      cy.login();
      cy.request({
        method: "POST",
        url: "/formular/grundstueck/bebaut",
        body: "typ=bebaut",
        form: true,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });

    it("should succeed on user submitting form", () => {
      cy.login();
      cy.visit("/formular/grundstueck/bebaut");
      cy.get("input[name='csrf']")
        .invoke("val")
        .then((csrfToken) => {
          cy.request({
            method: "POST",
            url: "/formular/grundstueck/bebaut",
            body: `csrf=${csrfToken}&typ=bebaut`,
            form: true,
            failOnStatusCode: false,
          }).then((response) => {
            expect(response.status).to.eq(200);
          });
        });
    });
  });

  describe("on /registrieren", () => {
    it("should fail on direct post", () => {
      cy.request({
        method: "POST",
        url: "/registrieren?index",
        body: "email=foo@bar.com&password=12345678",
        form: true,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });
  });

  describe("on /anmelden", () => {
    it("should fail on direct post", () => {
      cy.request({
        method: "POST",
        url: "/anmelden?index",
        body: "email=foo@bar.com&password=12345678",
        form: true,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });
  });

  describe("on zusammenfassung", () => {
    it("should fail on direct post", () => {
      cy.login();
      cy.visit("/formular");
      cy.request({
        method: "POST",
        url: "/formular/zusammenfassung",
        body: "csrf=bar",
        form: true,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });
  });

  describe("on /formular/weitereErklaerung", () => {
    it("should fail on direct post", () => {
      cy.login();
      cy.visit("/formular/weitereErklaerung");
      cy.request({
        method: "POST",
        url: "/formular/weitereErklaerung",
        body: "datenUebernehmen=true",
        form: true,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });
  });

  describe("on pruefen", () => {
    it("should fail on direct post", () => {
      cy.login();
      cy.visit("/pruefen/bundesland");
      cy.request({
        method: "POST",
        url: "/pruefen/bundesland",
        body: "csrf=bar",
        form: true,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });
  });

  describe("on /fsc", () => {
    it("should fail on direct post to /beantragen", () => {
      cy.login();
      cy.visit("/formular");
      cy.request({
        method: "POST",
        url: "/fsc/beantragen?index",
        body: "csrf=bar",
        form: true,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });

    it("should fail on direct post to /eingeben", () => {
      cy.login();
      cy.visit("/formular");
      cy.request({
        method: "POST",
        url: "/fsc/eingeben?index",
        body: "csrf=bar",
        form: true,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });
  });
});

export {};
