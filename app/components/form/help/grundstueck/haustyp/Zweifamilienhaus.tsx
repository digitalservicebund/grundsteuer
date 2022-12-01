import DefaultHelpContent, {
  HelpComponentFunction,
} from "~/components/form/help/Default";

export const ZweifamilienhausHelp: HelpComponentFunction = () => {
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
            "Wenn Ihr Reihenhaus oder Ihre Doppelhaushälfte zwei Wohnungen hat, dann zählt sie als ein Zweifamilienhaus. Wenn es aber in Ihrem Haus zwei Wohnungen gibt und eine zusätzliche Wohnung im Dachgeschoss mit einem eigenen Eingang, dann zählt Ihr Haus als ein Mehrfamilienhaus. Geben Sie in diesem Fall Ihre Erklärung über ELSTER ab.",
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
