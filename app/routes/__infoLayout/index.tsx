import { useTranslation } from "react-i18next";
import {
  BmfLogo,
  BreadcrumbNavigation,
  ContentContainer,
  FaqAccordion,
  HomepageAction,
  HomepageFeatures,
} from "~/components";
import germanyMapImage from "~/assets/images/germany-map.svg";
import TeaserBox from "~/components/TeaserBox";
import HelpInfoBox from "~/components/HelpInfoBox";
import HomepageCallToAction from "~/components/HomepageCallToAction";
import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getSession } from "~/session.server";
import { rememberCookieExists } from "~/rememberLogin.server";

export const loader: LoaderFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie");
  const session = await getSession(cookieHeader);

  return json({
    userIsLoggedIn: !!session.get("user"),
    userWasLoggedIn: await rememberCookieExists({ cookieHeader }),
  });
};

export default function Index() {
  const { userIsLoggedIn, userWasLoggedIn } = useLoaderData();
  const { t } = useTranslation("all");

  return (
    <>
      <BreadcrumbNavigation />
      <ContentContainer>
        <BmfLogo />
        <div className="mb-64 md:mb-96 xl:mb-80">
          <h1 className="mb-24">
            <div className="max-w-[300px] text-32 leading-40 mb-8 mt-18 sm:max-w-[560px] sm:text-[3.5rem] sm:leading-68 md:mb-24 lg:text-64 lg:mb-8">
              {t("homepage.headline")}
            </div>
            <div className="text-20 leading-26 sm:text-28 sm:leading-26 lg:text-32 lg:leading-40">
              {t("homepage.tagline")}
            </div>
          </h1>

          <ContentContainer size="sm">
            <HomepageCallToAction
              userIsLoggedIn={userIsLoggedIn}
              userWasLoggedIn={userWasLoggedIn}
            />
          </ContentContainer>
        </div>

        <div className="mb-64 md:mb-80 lg:mb-96">
          <TeaserBox />
        </div>

        <div className="mb-64 md:mb-80 lg:mb-96">
          <HomepageFeatures />
        </div>

        <div className="mb-64 md:max-w-screen-sm md:mb-32 lg:max-w-screen-md">
          <h2 className="text-32 leading-40 mb-16">
            {t("homepage.about.headline")}
          </h2>
          <p className="mb-24">{t("homepage.about.text1")}</p>
          <p className="font-bold">{t("homepage.about.text2")}</p>
        </div>

        <div
          className="mb-64 md:mb-24 flex flex-col md:flex-row"
          id="teilnehmende-bundeslaender"
        >
          <div className="mb-32 md:mb-0 lg:pt-64">
            <h2 className="text-32 leading-40 mb-16">
              {t("homepage.states.headline")}
            </h2>
            <p className="mb-24">{t("homepage.states.text")}</p>
            <div className="font-bold md:flex">
              <ul className="list-disc pl-24">
                <li>Berlin</li>
                <li>Brandenburg</li>
                <li>Bremen</li>
                <li>Mecklenburg-Vorpommern</li>
                <li>Nordrhein-Westfalen</li>
                <li>Rheinland-Pfalz</li>
              </ul>
              <ul className="list-disc pl-24 md:ml-24">
                <li>Saarland</li>
                <li>Sachsen</li>
                <li>Sachsen-Anhalt</li>
                <li>Schleswig-Holstein</li>
                <li>Thüringen</li>
              </ul>
            </div>
          </div>
          <img
            src={germanyMapImage}
            alt={t("homepage.states.mapAlt")}
            aria-describedby="teilnehmende-bundeslaender"
            className="mx-auto md:ml-48 lg:ml-112 xl:ml-176"
            width={255}
            height={391}
          />
        </div>

        <div className="mb-80" id="faq">
          <h2 className="text-32 leading-40 mb-16 md:mb-32">
            {t("homepage.faq.headline")}
          </h2>
          <div className="xl:pr-96">
            <HelpInfoBox />
          </div>
          <div className="xl:pr-96">
            <FaqAccordion />
          </div>
        </div>

        {userIsLoggedIn ? (
          ""
        ) : (
          <div className="mb-0 md:mb-160 xl:pr-96">
            <h2 className="text-32 leading-40 mb-32 md:mb-64">
              {t("homepage.action.headline")}
            </h2>
            <HomepageAction />
          </div>
        )}
      </ContentContainer>
    </>
  );
}
