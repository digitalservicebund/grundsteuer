import { useTranslation } from "react-i18next";
import { ExternalLinkButton } from "~/components/ExternalLinkButton";

const PortalList = ({
  header,
  items,
}: {
  header: string;
  items: PortalLinkProps[];
}) => {
  return (
    <div className="bg-white border-b-4 border-t-4 border-blue-800">
      <div className="w-full p-24 flex items-center justify-between bg-blue-200">
        <h2 className="pr-10 font-bold text-left text-16 leading-22 md:text-18 md:leading-24 text-blue-800">
          {header}
        </h2>
      </div>

      {items.map((item) => (
        <PortalLink
          key={item.bundesland}
          bundesland={item.bundesland}
          description={item.description}
        />
      ))}
    </div>
  );
};

interface PortalLinkProps {
  bundesland: string;
  description?: string;
}

const PortalLink = ({
  bundesland,
  description,
}: {
  bundesland: string;
  description?: string;
}) => {
  const { t } = useTranslation();

  const i18nPref = "grundstueck.bodenrichtwertInfo";
  const portalUrl = t(`${i18nPref}.${bundesland}.specifics.portalUrl`);
  const portalLabel = t(`${i18nPref}.${bundesland}.specifics.portalLabel`);
  const bundeslandName = t(`${i18nPref}.${bundesland}.specifics.bundesland`);

  return (
    <div className="pt-24 ml-24 mr-24 text-18 border-b-gray-200 border-b-2">
      <h3 className="font-sans uppercase text-14 font-bold">
        Bodenrichtwertportal {bundeslandName}
      </h3>
      <ExternalLinkButton
        url={portalUrl}
        border={false}
        classNames={"my-16 pl-0"}
      >
        {portalLabel}
      </ExternalLinkButton>
      {description && <div className="mb-16">{description}</div>}
    </div>
  );
};

export const DefaultHelp = () => {
  const props: { header: string; items: PortalLinkProps[] } = {
    header: "Links zu länderspezifischen Bodenrichtwert-Portalen",
    items: [
      { bundesland: "bb" },
      { bundesland: "be" },
      { bundesland: "hb" },
      { bundesland: "mv" },
      {
        bundesland: "nw",
        description:
          "Sie sollten mit der Post ein Datenblatt erhalten haben, in dem Sie alle Informationen zu Ihrem Grundstück finden. Auch den Bodenrichwert. Geben Sie diesen auf der nächsten Seite ein.",
      },
      {
        bundesland: "rp",
        description:
          "Sie sollten mit der Post ein Datenblatt erhalten haben, in dem Sie alle Informationen zu Ihrem Grundstück finden. Auch den Bodenrichwert. Geben Sie diesen auf der nächsten Seite ein.",
      },
      { bundesland: "sh" },
      {
        bundesland: "sl",
        description:
          "Sie sollten mit der Post ein Datenblatt erhalten haben, in dem Sie alle Informationen zu Ihrem Grundstück finden. Auch den Bodenrichwert. Geben Sie diesen auf der nächsten Seite ein.",
      },
      { bundesland: "sn" },
      {
        bundesland: "st",
        description:
          "Sie sollten mit der Post ein Datenblatt erhalten haben, in dem Sie alle Informationen zu Ihrem Grundstück finden. Auch den Bodenrichwert. Geben Sie diesen auf der nächsten Seite ein.",
      },
      { bundesland: "th" },
    ],
  };

  return <PortalList {...props} />;
};
