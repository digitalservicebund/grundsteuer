import { GrundModel } from "~/domain/steps";

export type ValidateSteuernummer = ({
  value,
  allData,
}: {
  value: string;
  allData: GrundModel;
}) => boolean;
const faNumbersBe = [
  "13",
  "14",
  "16",
  "17",
  "18",
  "19",
  "21",
  "23",
  "24",
  "25",
  "31",
  "32",
  "33",
  "34",
  "35",
  "36",
];
const faNumbersHb = ["57", "77"];
export const validateSteuernummer: ValidateSteuernummer = ({
  value,
  allData,
}) => {
  const steuernummer = value.replace(/\D/g, "");
  const bundesland = allData.grundstueck?.adresse?.bundesland;
  if (!bundesland) return false;

  switch (bundesland) {
    case "BE":
      if (steuernummer.length !== 10) return false;
      if (+steuernummer.charAt(2) < 7) return false;
      if (!faNumbersBe.includes(steuernummer.substring(0, 2))) return false;
      return true;

    case "HB":
      if (steuernummer.length !== 10) return false;
      if (!faNumbersHb.includes(steuernummer.substring(0, 2))) return false;
      return true;

    case "NW":
      if (steuernummer.length !== 13) return false;
      if (steuernummer.charAt(6) !== "3") return false;
      return true;

    case "SH":
      if (steuernummer.length !== 10) return false;
      if (!["7", "8", "9"].includes(steuernummer.charAt(0))) return false;
      return true;

    default:
      if (steuernummer.length !== 17) return false;
      return true;
  }
};
