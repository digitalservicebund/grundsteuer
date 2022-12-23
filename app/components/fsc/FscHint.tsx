import Hint from "~/components/Hint";

export default function FscHint({
  antragDate,
  remainingDays,
}: {
  antragDate: string;
  remainingDays: number;
}) {
  return (
    <Hint type="status">
      Ihr Freischaltcode wurde am {antragDate} beantragt. Ihr Code ist noch{" "}
      {remainingDays} {remainingDays === 1 ? "Tag" : "Tage"} gültig.
    </Hint>
  );
}
