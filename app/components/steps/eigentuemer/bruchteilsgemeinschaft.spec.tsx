import { getI18nObject, grundModelFactory } from "test/factories";
import { render, screen } from "@testing-library/react";
import { eigentuemerBruchteilsgemeinschaft } from "~/domain/steps/eigentuemer/bruchteilsgemeinschaft";
import Bruchteilsgemeinschaft from "~/components/steps/eigentuemer/bruchteilsgemeinschaft";
import { I18nObject } from "~/i18n/getStepI18n";

const missingNameText = "Bitte geben Sie die Adresse des Grundstücks an.";
const missingAddressText =
  "Bitte füllen Sie die Adresse von Eigentümer:in 1 aus.";

describe("Bruchteilsgemeinschaft page component", () => {
  const defaultInput = {
    stepDefinition: eigentuemerBruchteilsgemeinschaft,
    formData: {},
    allData: {},
    i18n: {} as I18nObject,
    backUrl: "back/url",
    currentStateWithoutId: "current/state",
    errors: {},
  };

  beforeEach(async () => {
    defaultInput.i18n = await getI18nObject(
      "eigentuemer.bruchteilsgemeinschaft"
    );
  });

  it("should render radio fields", () => {
    render(<Bruchteilsgemeinschaft {...defaultInput} />);
    expect(screen.getAllByRole("radio")).toHaveLength(2);
  });

  describe("With no data set", () => {
    it("should render disclaimer for name and address", () => {
      render(<Bruchteilsgemeinschaft {...defaultInput} />);
      expect(
        screen.getByText(missingNameText, { exact: false })
      ).toBeInTheDocument();
      expect(
        screen.getByText(missingAddressText, { exact: false })
      ).toBeInTheDocument();
    });
  });

  describe("With grundstueck adresse set", () => {
    beforeEach(async () => {
      defaultInput.allData = grundModelFactory
        .grundstueckAdresse({ strasse: "Postr.", hausnummer: "10" })
        .build();
    });

    it("should render name correctly", () => {
      render(<Bruchteilsgemeinschaft {...defaultInput} />);
      expect(
        screen.getByText("Bruchteilsgemeinschaft Postr. 10")
      ).toBeInTheDocument();
    });

    it("should render only disclaimer for address", () => {
      render(<Bruchteilsgemeinschaft {...defaultInput} />);
      expect(
        screen.queryByText(missingNameText, { exact: false })
      ).not.toBeInTheDocument();
      expect(
        screen.getByText(missingAddressText, { exact: false })
      ).toBeInTheDocument();
    });
  });

  describe("With grundstueck adresse set without hausnummer", () => {
    beforeEach(async () => {
      defaultInput.allData = grundModelFactory
        .grundstueckAdresse({ strasse: "Postr.", hausnummer: "" })
        .build();
    });

    it("should render name correctly", () => {
      render(<Bruchteilsgemeinschaft {...defaultInput} />);
      expect(
        screen.getByText("Bruchteilsgemeinschaft Postr.")
      ).toBeInTheDocument();
    });
  });

  describe("With eigentuemer adresse set with street", () => {
    beforeEach(async () => {
      defaultInput.allData = grundModelFactory
        .eigentuemerPersonAdresse({
          strasse: "Postr.",
          hausnummer: "10",
          plz: "12345",
          ort: "Berlin",
        })
        .build();
    });

    it("should render adresse correctly", () => {
      render(<Bruchteilsgemeinschaft {...defaultInput} />);
      expect(
        screen.getByText("Postr. 10", { exact: false })
      ).toBeInTheDocument();
      expect(
        screen.getByText("12345 Berlin", { exact: false })
      ).toBeInTheDocument();
    });

    it("should render only disclaimer for name", () => {
      render(<Bruchteilsgemeinschaft {...defaultInput} />);
      expect(
        screen.queryByText(missingNameText, { exact: false })
      ).toBeInTheDocument();
      expect(
        screen.queryByText(missingAddressText, { exact: false })
      ).not.toBeInTheDocument();
    });
  });

  describe("With eigentuemer adresse set with postfach", () => {
    beforeEach(async () => {
      defaultInput.allData = grundModelFactory
        .eigentuemerPersonAdresse({
          postfach: "3 22 63",
          plz: "12345",
          ort: "Berlin",
        })
        .build();
    });

    it("should render adresse correctly", () => {
      render(<Bruchteilsgemeinschaft {...defaultInput} />);
      expect(screen.getByText("3 22 63", { exact: false })).toBeInTheDocument();
      expect(
        screen.getByText("12345 Berlin", { exact: false })
      ).toBeInTheDocument();
    });

    it("should render only disclaimer for name", () => {
      render(<Bruchteilsgemeinschaft {...defaultInput} />);
      expect(
        screen.queryByText(missingNameText, { exact: false })
      ).toBeInTheDocument();
      expect(
        screen.queryByText(missingAddressText, { exact: false })
      ).not.toBeInTheDocument();
    });
  });

  describe("With grundstueck and eigentuemer adresse set with street", () => {
    beforeEach(async () => {
      defaultInput.allData = grundModelFactory
        .grundstueckAdresse({
          strasse: "Hausstr.",
          hausnummer: "1",
          plz: "12345",
          ort: "Berlin",
        })
        .eigentuemerPersonAdresse({
          strasse: "Eigenstr.",
          hausnummer: "2a",
          plz: "23456",
          ort: "Brandenburg",
        })
        .build();
    });

    it("should render adresse correctly", () => {
      render(<Bruchteilsgemeinschaft {...defaultInput} />);
      expect(
        screen.getByText("Bruchteilsgemeinschaft Hausstr. 1")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Eigenstr. 2a", { exact: false })
      ).toBeInTheDocument();
      expect(
        screen.getByText("23456 Brandenburg", { exact: false })
      ).toBeInTheDocument();
    });

    it("should render only disclaimer for name", () => {
      render(<Bruchteilsgemeinschaft {...defaultInput} />);
      expect(
        screen.queryByText(missingNameText, { exact: false })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(missingAddressText, { exact: false })
      ).not.toBeInTheDocument();
    });
  });
});
