import { render, screen, within } from "@testing-library/react";
import ZusammenfassungAccordion, {
  ZusammenfassungAccordionProps,
} from "~/components/form/ZusammenfassungAccordion";
import { I18nObject } from "~/i18n/getStepI18n";
import { grundModelFactory } from "test/factories";

describe("ZusammenfassungAccordion component", () => {
  const defaultProps: ZusammenfassungAccordionProps = {
    allData: {},
    i18n: {
      specifics: {
        sectionUnfilled: "sectionUnfilled",
      },
    } as unknown as I18nObject,
    errors: undefined,
  };

  describe("with no errors set", () => {
    it("should display eigentuemer and grundstueck areas", () => {
      render(<ZusammenfassungAccordion {...defaultProps} />);

      expect(screen.getByText("Grundstück")).toBeInTheDocument();
      expect(screen.getByText("Eigentümer:innen")).toBeInTheDocument();
      expect(screen.queryByText("Gebäude")).not.toBeInTheDocument();
    });

    it("should display section finished icons", () => {
      render(<ZusammenfassungAccordion {...defaultProps} />);

      expect(screen.queryAllByRole("img", { name: "Fertig" })).toHaveLength(2);
      expect(
        screen.queryByRole("img", { name: "Unfertig" })
      ).not.toBeInTheDocument();
    });

    describe("with no data", () => {
      it("should display eigentuemer and grundstueck areas with disclaimer", () => {
        render(<ZusammenfassungAccordion {...defaultProps} />);

        screen.getByText("Grundstück").click();
        expect(
          within(screen.getByTestId("grundstueck-area")).getByText(
            "sectionUnfilled"
          )
        ).toBeInTheDocument();
        screen.getByText("Eigentümer:innen").click();
        expect(
          within(screen.getByTestId("eigentuemer-area")).getByText(
            "sectionUnfilled"
          )
        ).toBeInTheDocument();
      });

      it("should show edit link", () => {
        render(<ZusammenfassungAccordion {...defaultProps} />);

        screen.getByText("Grundstück").click();
        expect(
          within(screen.getByTestId("grundstueck-area")).getByRole("link")
        ).toBeInTheDocument();

        screen.getByText("Eigentümer:innen").click();
        expect(
          within(screen.getByTestId("eigentuemer-area")).getByRole("link")
        ).toBeInTheDocument();
      });
    });

    describe("with grundstueck partly filled", () => {
      beforeEach(() => {
        defaultProps.allData = grundModelFactory
          .grundstueckTyp({ typ: "baureif" })
          .build();
      });

      afterEach(() => {
        defaultProps.allData = {};
      });

      it("should display eigentuemer with disclaimer and grundstueck fields", () => {
        render(<ZusammenfassungAccordion {...defaultProps} />);

        screen.getByText("Grundstück").click();
        expect(
          within(screen.getByTestId("grundstueck-area")).queryByText(
            "sectionUnfilled"
          )
        ).not.toBeInTheDocument();
        expect(
          within(screen.getByTestId("grundstueck-area")).queryByText(
            "Art des Grundstücks"
          )
        ).toBeInTheDocument();
        screen.getByText("Eigentümer:innen").click();
        expect(
          within(screen.getByTestId("eigentuemer-area")).getByText(
            "sectionUnfilled"
          )
        ).toBeInTheDocument();
      });
    });

    describe("with grundstueck typ bebaut", () => {
      beforeEach(() => {
        defaultProps.allData = grundModelFactory
          .grundstueckTyp({ typ: "einfamilienhaus" })
          .build();
      });

      afterEach(() => {
        defaultProps.allData = {};
      });

      it("should display gebaeude and eigentuemer areas with disclaimer", () => {
        render(<ZusammenfassungAccordion {...defaultProps} />);

        expect(screen.getByText("Grundstück")).toBeInTheDocument();
        expect(screen.getByText("Eigentümer:innen")).toBeInTheDocument();
        expect(screen.queryByText("Gebäude")).toBeInTheDocument();

        screen.getByText("Eigentümer:innen").click();
        expect(
          within(screen.getByTestId("eigentuemer-area")).getByText(
            "sectionUnfilled"
          )
        ).toBeInTheDocument();
        screen.getByText("Gebäude").click();
        expect(
          within(screen.getByTestId("gebaeude-area")).getByText(
            "sectionUnfilled"
          )
        ).toBeInTheDocument();
      });
    });
  });

  describe("with errors set", () => {
    beforeEach(() => {
      defaultProps.allData = grundModelFactory
        .grundstueckSteuernummer({ steuernummer: "12345678900" })
        .build();
      defaultProps.errors = {
        grundstueck: {
          typ: {
            typ: "error in typ",
          },
        },
      };
    });

    afterEach(() => {
      defaultProps.allData = {};
      defaultProps.errors = undefined;
    });

    it("should display (un)finished section icons correctly", () => {
      render(<ZusammenfassungAccordion {...defaultProps} />);

      expect(
        screen.getByRole("img", { name: "Fertig" }).nextSibling
      ).toContainHTML("Eigentümer:innen");
      expect(
        screen.getByRole("img", { name: "Unfertig" }).nextSibling
      ).toContainHTML("Grundstück");
    });

    describe("with no data for field with error", () => {
      it("should display error", () => {
        render(<ZusammenfassungAccordion {...defaultProps} />);

        screen.getByText("Grundstück").click();
        expect(
          within(screen.getByTestId("grundstueck-area")).getByText(
            "error in typ"
          )
        ).toBeInTheDocument();
      });
    });

    describe("with data set for field with error", () => {
      beforeEach(() => {
        defaultProps.allData = grundModelFactory
          .grundstueckSteuernummer({ steuernummer: "12345678900" })
          .grundstueckTyp({ typ: "einfamilienhaus" })
          .build();
      });

      afterEach(() => {
        defaultProps.allData = {};
      });

      it("should display error", () => {
        render(<ZusammenfassungAccordion {...defaultProps} />);

        screen.getByText("Grundstück").click();
        expect(
          within(screen.getByTestId("grundstueck-area")).getByText(
            "error in typ"
          )
        ).toBeInTheDocument();
      });
    });
  });
});
