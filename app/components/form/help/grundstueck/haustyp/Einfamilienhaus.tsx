import DefaultHelpContent, {
  HelpComponentFunction,
} from "~/components/form/help/Default";

export const EinfamilienhausHelp: HelpComponentFunction = () => {
  return (
    <DefaultHelpContent
      elements={[
        {
          type: "paragraph",
          value:
            "Entscheidend ist die Anzahl der abgeschlossenen Wohnungen, also Wohnungen mit einem separaten Eingang. Die Wohnung muss alle Nebenräume enthalten, welche die Führung eines selbständigen Haushalts ermöglichen (Küche, Bad oder Dusche, Toilette).",
        },
        {
          type: "paragraph",
          value:
            "Wenn Ihr Reihenhaus oder Ihre Doppelhaushälfte genau eine Wohnung hat, dann zählt sie als ein Einfamilienhaus. Wenn es aber in Ihrem Haus eine zusätzliche Wohnung im Dachgeschoss gibt und diese einen eigenen Eingang hat, dann zählt Ihr Haus als ein Zweifamilienhaus.",
        },
        {
          type: "paragraph",
          value:
            "Hier geht es um die größte Immobilie Ihres Grundvermögens - auch wenn zu Ihrer Immobilie eine Garage, ein Garten oder ein Privatweg gehören.",
        },
      ]}
    />
  );
};
