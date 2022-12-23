import Hint from "~/components/Hint";

export default function FscLetterHint({
  antragDate,
  letterArrivalDate,
}: {
  antragDate: string;
  letterArrivalDate: number;
}) {
  return (
    <Hint type="status">
      Ihr Freischaltcode wurde am {antragDate} beantragt. Ihr Brief kommt
      voraussichtlich bis zum {letterArrivalDate} an.
    </Hint>
  );
}
