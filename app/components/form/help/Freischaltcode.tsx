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
          value:
            "Ihren Freischaltcode finden Sie in dem Brief, den Sie von Ihrem Finanzamt erhalten haben. Der Code steht auf der letzten Seite.",
        },
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
