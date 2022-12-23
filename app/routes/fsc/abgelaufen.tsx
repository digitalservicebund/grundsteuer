import {
  BreadcrumbNavigation,
  Button,
  ContentContainer,
  Headline,
} from "~/components";
import ArrowRight from "~/components/icons/mui/ArrowRight";

export default function FscAbgelaufen() {
  return (
    <ContentContainer size="sm">
      <BreadcrumbNavigation />
      <Headline>Ihr Freischaltcode ist leider abgelaufen.</Headline>
      <div className="text-18">
        <p className="mb-32">
          Sie haben verpasst Ihren Freischaltcode einzugeben oder Ihren Brief
          nicht erhalten. 90 Tage nach Beantragung des Freischaltcodes verliert
          dieser seine Gültigkeit und kann nicht mehr eingegeben werden.
        </p>
        <p className="mb-32">
          Sie können versuchen erneut einen Freischaltcode zu beantragen.{" "}
          <strong>Achtung:</strong> dies kann aber wiederum einige Wochen dauern
          und gegebenenfalls die Abgabe Ihrer Grundsteuererklärung verzögern.
          Wir empfehlen einen Freischaltcode maximal einmal neu zu beantragen.
        </p>
      </div>

      <Button to="/fsc/stornieren">Freischaltcode neu beantragen</Button>

      <h2 className="mt-80 mb-16 text-24 font-bold">
        Nutzen Sie eine Alternative, um sich zu identifizieren
      </h2>
      <p className="text-18 mb-16">
        Ihr Freischaltcode ist ungültig und die Abgabfrist rückt näher. Hier
        finden Sie Tipps und Alternativen.
      </p>
      <div className="flex items-center mb-32">
        <ArrowRight className="inline-block mr-16" />
        <a
          href="/fsc/hilfe"
          className="font-bold underline text-18 text-blue-800"
        >
          Hilfe zum Freischaltcode
        </a>
      </div>
    </ContentContainer>
  );
}
