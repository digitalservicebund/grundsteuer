export class Formular {
  navigationData = () => {
    return {
      items: [
        {
          id: "metadaten",
        },
        {
          id: "eigentuemer",
          title: "Eigentümer",
          items: [
            {
              id: "eigentuemer-1",
              title: "Eigentümer 1",
              urlName: "eigentuemer",
              resourceId: 1,
              items: [
                {
                  id: "persoenliche-angaben",
                  title: "Persönliche Angaben",
                },
                {
                  id: "adresse",
                  title: "Adresse",
                },
                {
                  id: "telefonnummer",
                  title: "Telefonnummer",
                },
                {
                  id: "gesetzlicher-vertreter",
                  title: "Gesetzlicher Vertreter",
                  items: [
                    {
                      id: "persoenliche-daten",
                      title: "Persönliche Daten",
                    },
                    {
                      id: "adresse",
                      title: "Adresse",
                    },
                  ],
                },
              ],
            },
            {
              id: "eigentuemer-2",
              title: "Eigentümer 2",
              urlName: "eigentuemer",
              resourceId: 2,
            },
          ],
        },
      ],
    };
  };
}
