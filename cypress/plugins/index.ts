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
  createUser,
  deleteEricaRequestIdFscAktivieren,
  deleteEricaRequestIdFscBeantragen,
  deleteEricaRequestIdFscStornieren,
  deleteFscRequest,
  deletePdf,
  deleteTransferticket,
  findUserByEmail,
  saveDeclaration,
  saveEricaRequestIdFscAktivieren,
  saveEricaRequestIdFscBeantragen,
  saveEricaRequestIdFscStornieren,
  saveFscRequest,
  setUserIdentified,
  setUserInDeclarationProcess,
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

    dbRemoveAllEricaRequestIds: async (userEmail) => {
      await deleteEricaRequestIdFscBeantragen(userEmail);
      await deleteEricaRequestIdFscAktivieren(userEmail);
      await deleteEricaRequestIdFscStornieren(userEmail);
      return null;
    },

    dbResetUser: async (userEmail) => {
      await deleteEricaRequestIdFscBeantragen(userEmail);
      await deleteEricaRequestIdFscAktivieren(userEmail);
      await deleteEricaRequestIdFscStornieren(userEmail);
      await db.user.update({
        where: { email: userEmail },
        data: {
          identified: false,
          identifiedAt: null,
        },
      });
      await deletePdf(userEmail);
      await deleteTransferticket(userEmail);
      await setUserInDeclarationProcess(userEmail, true);
      return null;
    },

    addEricaRequestIdFscAntrag: async ({ userEmail, ericaRequestId }) => {
      await saveEricaRequestIdFscBeantragen(userEmail, ericaRequestId);
      return null;
    },

    addEricaRequestIdFscAktivieren: async ({ userEmail, ericaRequestId }) => {
      await saveEricaRequestIdFscAktivieren(userEmail, ericaRequestId);
      return null;
    },

    addEricaRequestIdFscStornieren: async ({ userEmail, ericaRequestId }) => {
      await saveEricaRequestIdFscStornieren(userEmail, ericaRequestId);
      return null;
    },

    setUserIdentified: async ({ userEmail }) => {
      await setUserIdentified(userEmail);
      return null;
    },

    setUserUnidentified: async ({ userEmail }) => {
      await db.user.update({
        where: { email: userEmail },
        data: {
          identified: false,
          identifiedAt: null,
        },
      });
      return null;
    },

    dbRemoveUserTransferticket: async ({ userEmail }) => {
      await deleteTransferticket(userEmail);
      return null;
    },

    dbRemoveUserPdf: async ({ userEmail }) => {
      await deletePdf(userEmail);
      return null;
    },

    setDeclarationMetadata: async ({ userEmail, transferticket, pdf }) => {
      await saveDeclaration(userEmail, transferticket, pdf);
      return null;
    },

    setUserInDeclarationProcessAttribute: async ({
      userEmail,
      inDeclarationProcess,
    }) => {
      await setUserInDeclarationProcess(userEmail, inDeclarationProcess);
      return null;
    },
  });

  return config;
};
