import ErrorBar from "~/components/ErrorBar";

export default function ErrorBarStandard() {
  return (
    <ErrorBar className="mb-24" heading="Es ist ein Fehler aufgetreten.">
      Überprüfen Sie Ihre Eingaben.
    </ErrorBar>
  );
}
