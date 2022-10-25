/// <reference types="cypress" />
/// <reference types="node" />
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
import fetch from "node-fetch";
import {
  createUser,
  deleteEricaRequestIdFscAktivieren,
  deleteEricaRequestIdFscBeantragen,
  deleteEricaRequestIdFscStornieren,
  deletePdf,
  deleteTransferticket,
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
    createUser: async ({ email }) => {
      await createUser(email);
      return null;
    },

    deleteUser: async ({ email }) => {
      db.user.delete({
        where: {
          email: email,
        },
      });
      return null;
    },

    dbRemoveFsc: async (email) => {
      return db.fscRequest.deleteMany({
        where: { User: { email: email } },
      });
    },

    addFscRequestId: async ({ email, fscRequestId }) => {
      await saveFscRequest(email, fscRequestId);
      return null;
    },

    dbRemoveAllEricaRequestIds: async (email) => {
      await deleteEricaRequestIdFscBeantragen(email);
      await deleteEricaRequestIdFscAktivieren(email);
      await deleteEricaRequestIdFscStornieren(email);
      return null;
    },

    dbResetUser: async (email) => {
      await deleteEricaRequestIdFscBeantragen(email);
      await deleteEricaRequestIdFscAktivieren(email);
      await deleteEricaRequestIdFscStornieren(email);
      await db.user.update({
        where: { email: email },
        data: {
          identified: false,
          identifiedAt: null,
        },
      });
      await deletePdf(email);
      await deleteTransferticket(email);
      await setUserInDeclarationProcess(email, true);
      return null;
    },

    addEricaRequestIdFscAntrag: async ({ email, ericaRequestId }) => {
      await saveEricaRequestIdFscBeantragen(email, ericaRequestId);
      return null;
    },

    addEricaRequestIdFscAktivieren: async ({ email, ericaRequestId }) => {
      await saveEricaRequestIdFscAktivieren(email, ericaRequestId);
      return null;
    },

    addEricaRequestIdFscStornieren: async ({ email, ericaRequestId }) => {
      await saveEricaRequestIdFscStornieren(email, ericaRequestId);
      return null;
    },

    getFscRequest: async ({ email }) => {
      return db.fscRequest.findMany({
        where: { User: { email: email } },
      });
    },

    getUser: async ({ email }) => {
      return db.user.findMany({
        where: { email: email },
      });
    },

    setIdentified: async ({ email, identified }) => {
      await db.user.update({
        where: { email: email },
        data: {
          identified: identified,
          identifiedAt: identified ? new Date() : null,
        },
      });
      return null;
    },

    setUserIdentified: async ({ email }) => {
      await setUserIdentified(email);
      return null;
    },

    setUserUnidentified: async ({ email }) => {
      await db.user.update({
        where: { email: email },
        data: {
          identified: false,
          identifiedAt: null,
        },
      });
      return null;
    },

    dbRemoveUserTransferticket: async ({ email }) => {
      await deleteTransferticket(email);
      return null;
    },

    dbRemoveUserPdf: async ({ email }) => {
      await deletePdf(email);
      return null;
    },

    setDeclarationMetadata: async ({ email, transferticket, pdf }) => {
      await saveDeclaration(email, transferticket, pdf);
      return null;
    },

    setUserInDeclarationProcessAttribute: async ({
      email,
      inDeclarationProcess,
    }) => {
      await setUserInDeclarationProcess(email, inDeclarationProcess);
      return null;
    },

    enableFlag: async ({ name }) => {
      await fetch(
        `${process.env.UNLEASH_HOST}/api/admin/projects/default/features/${name}` +
          "/environments/development/on",
        {
          method: "post",
          headers: {
            Authorization: process.env.UNLEASH_ADMIN_TOKEN,
            "Content-Type": "application/json",
          },
        }
      );
      return null;
    },

    disableFlag: async ({ name }) => {
      await fetch(
        `${process.env.UNLEASH_HOST}/api/admin/projects/default/features/${name}` +
          "/environments/development/off",
        {
          method: "post",
          headers: {
            Authorization: process.env.UNLEASH_ADMIN_TOKEN,
            "Content-Type": "application/json",
          },
        }
      );
      return null;
    },
  });

  return config;
};
