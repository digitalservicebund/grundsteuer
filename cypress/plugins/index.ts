/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)
import { db } from "../../app/db.server";
import {
  deleteEricaRequestIdFscAktivieren,
  deleteEricaRequestIdFscBeantragen,
  deletePdf,
  deleteTransferticket,
  saveEricaRequestIdFscAktivieren,
  saveEricaRequestIdFscBeantragen,
  saveFscRequest,
  savePdf,
  saveTransferticket,
  setUserIdentified,
} from "../../app/domain/user";

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
export default (on, config) => {
  on("task", {
    dbRemoveFsc: async (userEmail) => {
      return db.fscRequest.deleteMany({
        where: { User: { email: userEmail } },
      });
    },

    addFscRequestId: async ({ userEmail, fscRequestId }) => {
      await saveFscRequest(userEmail, fscRequestId);
      return null;
    },

    addEricaRequestIdFscAntrag: async ({ userEmail, ericaRequestId }) => {
      await saveEricaRequestIdFscBeantragen(userEmail, ericaRequestId);
      return null;
    },

    dbRemoveEricaRequestIdBeantragen: async (userEmail) => {
      await deleteEricaRequestIdFscBeantragen(userEmail);
      return null;
    },

    addEricaRequestIdFscAktivieren: async ({ userEmail, ericaRequestId }) => {
      await saveEricaRequestIdFscAktivieren(userEmail, ericaRequestId);
      return null;
    },

    dbRemoveEricaRequestIdAktivieren: async (userEmail) => {
      await deleteEricaRequestIdFscAktivieren(userEmail);
      return null;
    },

    setUserIdentifiedAttribute: async ({ userEmail, identified }) => {
      await setUserIdentified(userEmail, identified);
      return null;
    },

    setUserTransferticket: async ({ userEmail, transferticket }) => {
      await saveTransferticket(userEmail, transferticket);
      return null;
    },

    dbRemoveUserTransferticket: async ({ userEmail }) => {
      await deleteTransferticket(userEmail);
      return null;
    },

    setUserPdf: async ({ userEmail, pdf }) => {
      await savePdf(userEmail, pdf);
      return null;
    },

    dbRemoveUserPdf: async ({ userEmail }) => {
      await deletePdf(userEmail);
      return null;
    },
  });

  return config;
};
