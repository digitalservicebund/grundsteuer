import DefaultHelpContent, {
  HelpComponentFunction,
} from "~/components/form/help/Default";

const FreischaltcodeHelp: HelpComponentFunction = () => {
  return (
    <DefaultHelpContent
      elements={[
        {
          type: "paragraph",
          value:
            "Ihr persönlicher Freischaltcode ist für die erstmalige Anmeldung 90 Tage nach der Registrierung gültig. Nach der ersten Anmeldung mit Ihrem persönlichen Freischaltcode haben Sie weitere 60 Tage Zeit, Ihre Grundsteuererklärung auszufüllen und abzuschicken. Danach verliert der Freischaltcode seine Gültigkeit und Sie müssen einen neuen Freischaltcode beantragen.",
        },
      ]}
    />
  );
};

export default FreischaltcodeHelp;
