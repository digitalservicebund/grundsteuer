import { InputProps } from "~/components/form/Input";
import MaskedInput from "~/components/form/MaskedInput";
import { Bundesland } from "~/domain/steps/grundstueck/adresse.server";

const getSteuernummerMaskProps = (
  bundesland?: Bundesland
): {
  mask: string;
  definitions?: Record<string, RegExp>;
} => {
  switch (bundesland) {
    case "BE":
      return {
        mask: "XX/XXX/XXXXX",
        definitions: {
          X: /[0-9]/,
        },
      };
    case "HB":
      return {
        mask: "XX/XXX/XXXXX",
        definitions: {
          X: /[0-9]/,
        },
      };
    case "NW":
      return {
        mask: "XXX/XXX-X-XXXXX.X",
        definitions: {
          X: /[0-9]/,
        },
      };
    case "SH":
      return {
        mask: "XX XXX XXXXX",
        definitions: {
          X: /[0-9]/,
        },
      };

    default:
      return {
        mask: "XXX/XXX/XXXX/XXX/XXX/X",
        definitions: {
          X: /[0-9]/,
        },
      };
  }
};

export default function SteuernummerField(
  props: InputProps & { bundesland?: Bundesland }
) {
  const mask = getSteuernummerMaskProps(props.bundesland);
  return <MaskedInput {...mask} {...props} />;
}
