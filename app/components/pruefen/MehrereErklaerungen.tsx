import { StepComponentFunction } from "~/routes/__infoLayout/pruefen/_step";
import image from "~/assets/images/pruefen-complex.svg";
import EnumeratedList from "~/components/EnumeratedList";

const MehrereErklaerungen: StepComponentFunction = () => {
  return (
    <div>
      <div className="mb-48 text-18 leading-26">
        <p className="mb-48">
          Auf Basis Ihrer Angaben haben wir festgestellt, dass Sie mehrere
          Grundsteuererklärungen abgeben müssen:
        </p>
        <EnumeratedList
          items={[
            "Eine Erklärung für das Grundvermögen des Grundstücks wie Ihr Wohnhaus",
            "Eine Erklärung für land- und forstwirtschaftliche Teile des Grundstücks, wie Grünflächen oder Wirtschaftsgebäude",
          ]}
          className="mb-48"
        />
        <p>
          In unserem{" "}
          <a
            href="https://grundsteuererklaerung-fuer-privateigentum.zammad.com/help/de-de/64-land-und-forstwirtschaftliche-flachen-acker-waldstucke-wiesen"
            className="underline font-bold"
            target="_blank"
          >
            Hilfebereich
          </a>{" "}
          haben wir weiterführende Informationen und Schritte zusammengestellt.
        </p>
      </div>
      <img src={image} alt="" className="mb-80" />
    </div>
  );
};

export default MehrereErklaerungen;
