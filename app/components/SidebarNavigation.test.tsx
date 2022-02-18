import React from "react";
import { render, screen } from "@testing-library/react";
import SidebarNavigation from "~/components/SidebarNavigation";
import { defaults } from "~/domain/model";

describe("With default data", () => {
  const data = defaults;

  describe("No matching routes", () => {
    it("should render only home link", () => {
      render(<SidebarNavigation matchingRoutes={[]} data={data} />);
      expect(screen.getByText("Home").closest("a")).toHaveAttribute(
        "href",
        "/"
      );
    });
  });

  describe("With matching routes indicating to not show navigation", () => {
    it("should render only home link", () => {
      const matchingRoutes = [
        {
          id: "/route",
          pathname: "/route",
          params: {},
          data: {},
          handle: {
            showFormNavigation: false,
          },
        },
      ];
      render(<SidebarNavigation matchingRoutes={matchingRoutes} data={data} />);
      expect(screen.getByText("Home").closest("a")).toHaveAttribute(
        "href",
        "/"
      );
    });
  });

  describe("With matching routes indicating to show navigation", () => {
    it("should render the expected navigation links", () => {
      const matchingRoutes = [
        {
          id: "/route",
          pathname: "/route",
          params: {},
          data: {},
          handle: {
            showFormNavigation: true,
          },
        },
      ];
      render(<SidebarNavigation matchingRoutes={matchingRoutes} data={data} />);
      expect(screen.getByText("nav.eigentuemer").closest("a")).toHaveAttribute(
        "href",
        "/steps/eigentuemer/anzahl"
      );
      expect(screen.getByText("nav.grundstueck").closest("a")).toHaveAttribute(
        "href",
        "/steps/grundstueck"
      );
      expect(
        screen.getByText("nav.zusammenfassung").closest("a")
      ).toHaveAttribute("href", "/steps/zusammenfassung");
      expect(screen.queryByText("nav.gebaeude")).not.toBeInTheDocument();
    });
  });
});

describe("With bebaut data and matching routes indicating to show navigation", () => {
  const data = defaults;
  const matchingRoutes = [
    {
      id: "/route",
      pathname: "/route",
      params: {},
      data: {},
      handle: {
        showFormNavigation: true,
      },
    },
  ];

  describe("With bebaut false", () => {
    beforeEach(() => {
      data.grundstueck.bebaut = "false";
    });

    it("should render the expected navigation links, not gebaeude", () => {
      render(<SidebarNavigation matchingRoutes={matchingRoutes} data={data} />);
      expect(screen.getByText("nav.eigentuemer").closest("a")).toHaveAttribute(
        "href",
        "/steps/eigentuemer/anzahl"
      );
      expect(screen.getByText("nav.grundstueck").closest("a")).toHaveAttribute(
        "href",
        "/steps/grundstueck"
      );
      expect(
        screen.getByText("nav.zusammenfassung").closest("a")
      ).toHaveAttribute("href", "/steps/zusammenfassung");
      expect(screen.queryByText("nav.gebaeude")).not.toBeInTheDocument();
    });
  });

  describe("With bebaut true", () => {
    beforeEach(() => {
      data.grundstueck.bebaut = "true";
    });

    it("should render the expected navigation links, including gebaeude", () => {
      render(<SidebarNavigation matchingRoutes={matchingRoutes} data={data} />);
      expect(screen.getByText("nav.eigentuemer").closest("a")).toHaveAttribute(
        "href",
        "/steps/eigentuemer/anzahl"
      );
      expect(screen.getByText("nav.grundstueck").closest("a")).toHaveAttribute(
        "href",
        "/steps/grundstueck"
      );
      expect(
        screen.getByText("nav.zusammenfassung").closest("a")
      ).toHaveAttribute("href", "/steps/zusammenfassung");
      expect(screen.getByText("nav.gebaeude").closest("a")).toHaveAttribute(
        "href",
        "/steps/gebaeude"
      );
    });
  });
});
