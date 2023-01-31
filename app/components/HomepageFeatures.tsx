import { ReactNode } from "react";
import feature1Image from "~/assets/images/feature1.svg";
import feature2Image from "~/assets/images/feature2.svg";
import feature3Image from "~/assets/images/feature3.svg";

type HomepageFeatureProps = {
  children: ReactNode;
  headline: string;
  image: string;
};

function HomepageFeature(props: HomepageFeatureProps) {
  const { children, headline, image } = props;
  return (
    <div className="flex flex-col">
      <img
        src={image}
        alt=""
        role="presentation"
        className="w-full"
        width={312}
        height={182}
        loading="lazy"
      />
      <div className="flex-grow bg-blue-300 p-32 rounded-b-md border-t-gray-800 border-t-4">
        <h2 className="text-20 leading-26 mb-24">{headline}</h2>
        {children}
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <div className="grid grid-cols-1 md:auto-rows-fr gap-x-24 gap-y-48 md:grid-cols-2 lg:grid-cols-3">
      <HomepageFeature
        headline="Ich möchte meine Erklärung korrigieren"
        image={feature1Image}
      >
        <p>
          Ich habe einen Fehler in meiner Erklärung bemerkt oder Angaben
          vergessen und möchte diese nachträglich korrigieren. Den
          Grundsteuerwertbescheid habe ich noch nicht bekommen.
        </p>
        <p className="mt-24">
          Mehr zum Thema{" "}
          <a href="#" className="font-bold underline">
            Korrektur der Erklärung{" "}
          </a>
        </p>
      </HomepageFeature>
      <HomepageFeature
        headline="Ich habe ein Erinnerungsschreiben erhalten"
        image={feature3Image}
      >
        <p className="mb-24">
          Sie haben Ihre Grundsteuererklärung nicht eingereicht und ein
          Erinnerungsschreiben erhalten oder sie haben Fragen zu diesem
          Schreiben?
        </p>
        <p className="mb-24">
          Mehr zum Thema{" "}
          <a href="#" className="font-bold underline">
            Erinnerungsschreiben
          </a>
        </p>
      </HomepageFeature>
      <HomepageFeature
        headline="Ich habe Fragen zu einem Bescheid"
        image={feature2Image}
      >
        <p className="mb-24">
          Sie haben einen Bescheid nach der Abgabe Ihrer Grundsteuererklärung
          erhalten und haben Fragen?
        </p>
        <p>
          Mehr zum Thema{" "}
          <a href="#" className="font-bold underline">
            Grundsteuerwertbescheid
          </a>
        </p>
      </HomepageFeature>
    </div>
  );
}
