// cypress/components/MyComponent.cy.js

import React from 'react';
import { mount } from 'cypress/react'; // Importerar Cypress mount-funktionen
import MyComponent from '../../src/components/MyComponent'; // Importera komponenten

describe('MyComponent', () => {
  it('should render the correct text', () => {
    // Använd Cypress för att montera komponenten
    mount(<MyComponent />);

    // Testa att rätt text visas
    cy.contains('Hello, Cypress!').should('be.visible');
    cy.contains('This is a test component for Cypress testing.').should('be.visible');
  });
});
