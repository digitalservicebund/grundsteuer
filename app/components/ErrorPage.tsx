import { Trans, useTranslation } from "react-i18next";
import { Button, SimplePageLayout } from "~/components";
import illustrationImage404 from "~/assets/images/404.svg";
import illustrationImage500 from "~/assets/images/500.svg";

type ErrorPageProps = {
  statusCode: 404 | 500;
};

export default function ErrorPage(props: ErrorPageProps) {
  const { t } = useTranslation("all");
  const { statusCode } = props;

  return (
    <SimplePageLayout>
      <h1 className="text-32 leading-40 mb-32 max-w-screen-sm md:text-64 md:leading-68 md:mb-48">
        {statusCode}
        <br />
        {t(`${statusCode}.headline`)}
      </h1>

      <p className="text-20 leading-26 md:text-32 md:leading-40 max-w-screen-md mb-24 md:mb-32">
        {t(`${statusCode}.text`)}
      </p>

      {statusCode === 404 && (
        <p className="max-w-screen-md mb-64 md:mb-96">
          <Trans
            components={{
              bold: <strong />,
              nowrap: <span className="whitespace-nowrap" />,
            }}
          >
            {t(`${statusCode}.smallprint`)}
          </Trans>
        </p>
      )}

      <Button to="/" className="mb-64">
        {t(`${statusCode}.backButton`)}
      </Button>

      <img
        src={statusCode === 404 ? illustrationImage404 : illustrationImage500}
        alt=""
        role="presentation"
        className="mb-80 md:mb-160"
      />
    </SimplePageLayout>
  );
}
