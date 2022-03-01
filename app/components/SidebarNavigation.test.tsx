import React from "react";
//import { render, screen } from "@testing-library/react";
//import SidebarNavigation from "~/components/SidebarNavigation";
//import { grundModelFactory } from "test/factories";

//jest.mock("react-i18next", () => ({
//  useTranslation: () => ({ t: (key: string) => key }),
//}));

//describe("With default data", () => {
//  const data = {};

//  describe("No matching routes", () => {
//    it("should render only home link", () => {
//      render(<SidebarNavigation matchingRoutes={[]} data={data} />);
//      expect(screen.getByText("Home").closest("a")).toHaveAttribute(
//        "href",
//        "/"
//      );
//    });
//  });

//  describe("With matching routes indicating to not show navigation", () => {
//    it("should render only home link", () => {
//      const matchingRoutes = [
//        {
//          id: "/route",
//          pathname: "/route",
//          params: {},
//          data: {},
//          handle: {
//            showFormNavigation: false,
//          },
//        },
//      ];
//      render(<SidebarNavigation matchingRoutes={matchingRoutes} data={data} />);
//      expect(screen.getByText("Home").closest("a")).toHaveAttribute(
//        "href",
//        "/"
//      );
//    });
//  });

//  describe("With matching routes indicating to show navigation", () => {
//    it("should render the expected navigation links", () => {
//      const matchingRoutes = [
//        {
//          id: "/route",
//          pathname: "/route",
//          params: {},
//          data: {},
//          handle: {
//            showFormNavigation: true,
//          },
//        },
//      ];
//      render(<SidebarNavigation matchingRoutes={matchingRoutes} data={data} />);
//      expect(screen.getByText("nav.eigentuemer").closest("a")).toHaveAttribute(
//        "href",
//        "/formular/eigentuemer/anzahl"
//      );
//      expect(screen.getByText("nav.grundstueck").closest("a")).toHaveAttribute(
//        "href",
//        "/formular/grundstueck/adresse"
//      );
//      expect(
//        screen.getByText("nav.zusammenfassung").closest("a")
//      ).toHaveAttribute("href", "/formular/zusammenfassung");
//      expect(screen.queryByText("nav.gebaeude")).not.toBeInTheDocument();
//    });
//  });
//});

//describe("With bebaut data and matching routes indicating to show navigation", () => {
//  const matchingRoutes = [
//    {
//      id: "/route",
//      pathname: "/route",
//      params: {},
//      data: {},
//      handle: {
//        showFormNavigation: true,
//      },
//    },
//  ];

//  describe("With bebaut false", () => {
//    const data = grundModelFactory
//      .grundstueckTyp({ typ: "abweichendeEntwicklung" })
//      .build();

//    it("should render the expected navigation links, not gebaeude", () => {
//      render(<SidebarNavigation matchingRoutes={matchingRoutes} data={data} />);
//      expect(screen.getByText("nav.eigentuemer").closest("a")).toHaveAttribute(
//        "href",
//        "/formular/eigentuemer/anzahl"
//      );
//      expect(screen.getByText("nav.grundstueck").closest("a")).toHaveAttribute(
//        "href",
//        "/formular/grundstueck/adresse"
//      );
//      expect(
//        screen.getByText("nav.zusammenfassung").closest("a")
//      ).toHaveAttribute("href", "/formular/zusammenfassung");
//      expect(screen.queryByText("nav.gebaeude")).not.toBeInTheDocument();
//    });
//  });

//  describe("With bebaut true", () => {
//    const data = grundModelFactory
//      .grundstueckTyp({ typ: "einfamilienhaus" })
//      .build();

//    it("should render the expected navigation links, including gebaeude", () => {
//      render(<SidebarNavigation matchingRoutes={matchingRoutes} data={data} />);
//      expect(screen.getByText("nav.eigentuemer").closest("a")).toHaveAttribute(
//        "href",
//        "/formular/eigentuemer/anzahl"
//      );
//      expect(screen.getByText("nav.grundstueck").closest("a")).toHaveAttribute(
//        "href",
//        "/formular/grundstueck/adresse"
//      );
//      expect(
//        screen.getByText("nav.zusammenfassung").closest("a")
//      ).toHaveAttribute("href", "/formular/zusammenfassung");
//      expect(screen.getByText("nav.gebaeude").closest("a")).toHaveAttribute(
//        "href",
//        "/formular/gebaeude/ab1949"
//      );
//    });
//  });
//});
