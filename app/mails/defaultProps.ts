const productName = "Grundsteuererklärung für Privateigentum";

export const defaultProps = {
  greetings: "Guten Tag!",
  signature: "Support-Team",
  productName,
  productNameApostrophized: `„${productName}“`,
  company: {
    name: "DigitalService GmbH des Bundes",
    shortName: "DigitalService",
    website: {
      label: "Website",
      url: "https://digitalservice.bund.de",
    },
    street: "Prinzessinnenstraße 8-14",
    zip: "10969",
    city: "Berlin",
    vatId: "Ust-IdNr.: DE327075535",
    directors: "Geschäftsführung: Christina Lang",
    registerNumber: "Handelsregisternummer: HRB 212879 B",
    registerCourt: "Registergericht: Berlin Charlottenburg",
    twitter: {
      label: "Twitter",
      url: "https://twitter.com/DigitalServBund",
    },
    linkedIn: {
      label: "LinkedIn",
      url: "https://www.linkedin.com/company/digitalservicebund",
    },
  },
};
