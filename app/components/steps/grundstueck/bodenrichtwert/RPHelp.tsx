import EnumeratedCard from "~/components/EnumeratedCard";
import rp1 from "~/assets/images/boris/info-rp-1.png";
import rp2 from "~/assets/images/boris/info-rp-2.png";

export const RPHelp = () => {
  return (
    <>
      <h2 className="mb-32 text-24">Eine Schritt-für-Schritt Anleitung</h2>
      <div className="mb-80">
        <EnumeratedCard
          image={rp1}
          imageAltText="Screenshot vom Bodenrichtwert-Portal Rheinland-Pfalz"
          number="1"
          heading="Das Datenstammblatt"
          text="Sie haben kürzlich ein Informationsschreiben von Ihrer Landesfinanzverwaltung erhalten. Diesem ist ein Datenstammblatt beigelegt. Darin finden Sie alle Angaben zu Ihrem Grundstück."
          className="mb-16"
        />
        <EnumeratedCard
          image={rp2}
          imageAltText="Screenshot vom Bodenrichtwert-Portal Rheinland-Pfalz"
          number="2"
          heading="Bodenrichtwert ablesen"
          text="Gehen Sie in die Tabelle des Datenstammblatts. Dort können Sie den Bodenrichtwert in Euro pro Quadratmeter ablesen."
          className="mb-16"
        />
      </div>
    </>
  );
};
