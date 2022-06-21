import DefaultHelpContent, {
  HelpComponentFunction,
} from "~/components/form/help/Default";
import freischaltcodeImg from "~/assets/images/help/freischaltcode.png";

const FreischaltcodeHelp: HelpComponentFunction = () => {
  return (
    <DefaultHelpContent
      elements={[
        {
          type: "paragraph",
          value: (
            <span>
              Der Freischaltcode besteht immer aus 12 Zeichen und sieht zum
              Beispiel so aus: <strong>A1B2-C3D4-E5F$</strong>.
            </span>
          ),
        },
        {
          type: "image",
          source: freischaltcodeImg,
          altText: "Beispiel Freischaltcode Brief",
        },
      ]}
    />
  );
};

export default FreischaltcodeHelp;
