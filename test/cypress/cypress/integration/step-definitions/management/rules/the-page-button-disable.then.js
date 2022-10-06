import { Then } from 'cypress-cucumber-preprocessor/steps';
import { getSelector } from '../../../utils/driver';
import { RULES_PAGE as pageName } from '../../../utils/pages-constants';
const paginatorNextSelector = getSelector('paginatorNextSelector', pageName);
const paginatorPreviousSelector = getSelector('paginatorPreviousSelector', pageName);


Then('The {} page button should be disable',(positionPage) => {
    cy.wait(1500);
    (positionPage == 'next') ? cy.get(paginatorNextSelector).should('have.attr', 'disabled') : cy.get(paginatorPreviousSelector).should('have.attr', 'disabled');
});