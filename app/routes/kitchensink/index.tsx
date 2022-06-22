import { ContentContainer, Footer, HomepageSharing } from "~/components";

import CloseIcon from "~/components/icons/mui/Close";
import AddIcon from "~/components/icons/mui/Add";
import RemoveIcon from "~/components/icons/mui/Remove";
import FileCopyIcon from "~/components/icons/mui/FileCopy";
import cardImage from "~/assets/images/lohnsteuerbescheinigung_idnr.svg";

import bmfLogoImage from "~/assets/images/bmf-logo.svg";
import EnumeratedCard from "~/components/EnumeratedCard";
import ErrorBar from "~/components/ErrorBar";
import WarningBar from "~/components/WarningBar";
import ErrorBarStandard from "~/components/ErrorBarStandard";

export default function KitchenSinkIndex() {
  return (
    <ContentContainer>
      <div className="text-orange-500">
        <img src={bmfLogoImage} className="w-[298px]" />

        <p className="font-sans">
          font-sans <strong>bold</strong>{" "}
          <em>
            italic <strong>bold</strong>
          </em>
        </p>
        <p className="font-serif">
          font-serif <strong>bold</strong>{" "}
          <em>
            italic <strong>bold</strong>
          </em>
        </p>
        <p className="font-condensed">font-condensed</p>
      </div>

      <HomepageSharing />

      <CloseIcon className="w-24 h-24 fill-current" />
      <AddIcon className="w-24 h-24 fill-blue-500" />
      <RemoveIcon className="w-24 h-24 fill-black" />
      <FileCopyIcon className="w-36 h-36 fill-blue-800 mb-32" />

      <EnumeratedCard
        image={cardImage}
        imageAltText="Lohnsteuerbescheinigung"
        number="1"
        heading="Sie geben die Daten ein"
        text="Geben Sie Ihre Steuer-Identifikationsnummer und Ihr Geburtsdatum ein. Ihre Steuer-ID finden Sie zum Beispiel auf Ihren Steuerbescheiden, Lohnsteuerabrechnungen oder anderen Unterlagen vom Finanzamt. "
        className="mb-24"
      />

      <WarningBar heading="Eigene Headline" className="mb-8">
        Bitte beachten Sie, dass …
      </WarningBar>

      <ErrorBar heading="Eigene Headline" className="mb-8">
        Es ist ein Fehler aufgetreten.
      </ErrorBar>
      <ErrorBarStandard />

      <Footer />
    </ContentContainer>
  );
}
