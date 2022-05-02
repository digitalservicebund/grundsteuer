import { ReactNode } from "react";
import Slash from "~/components/icons/mui/Slash";

export default function InputFraction(props: {
  zaehler: ReactNode;
  nenner: ReactNode;
}) {
  const { zaehler, nenner } = props;
  return (
    <fieldset className="flex-row flex items-baseline">
      <div className="inline-block w-full">{zaehler}</div>
      <div className="flex items-center self-end min-h-[4rem] mb-24">
        <Slash className="inline-block mx-10" role="img" />
      </div>
      <div className="inline-block w-full">{nenner}</div>
    </fieldset>
  );
}
