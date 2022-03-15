import { HelpComponentFunction } from "~/routes/formular/_step";
import SteuernummerGrundbuch from "~/components/icons/help/SteuernummerGrundbuch";

export const SteuernummerHelp: HelpComponentFunction = ({ i18n }) => {
  return (
    <>
      <h2 className="font-bold mb-8">{i18n.help.heading}</h2>
      <p className="mb-8">{i18n.help.paragraph}</p>
      <SteuernummerGrundbuch className="w-full h-auto" />
    </>
  );
};
