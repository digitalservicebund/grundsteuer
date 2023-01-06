import startImage from "~/assets/images/start.svg";
import { Button } from "~/components/index";

export default function HomepageAction(props: { pruefenPath: string }) {
  return (
    <div>
      <div className="md:hidden mb-36 flex justify-center">
        <Button
          look="primary"
          size="large"
          className="w-full max-w-[412px]"
          to={props.pruefenPath}
        >
          Grundsteuererklärung starten
        </Button>
      </div>

      <div className="relative">
        <div className="flex items-center justify-center">
          <img
            src={startImage}
            alt=""
            role="presentation"
            className="relative w-[154px] md:w-auto mr-64"
            width={238}
            height={227}
          />
          <div className="ml-20 pb-64 hidden md:block">
            <Button
              look="primary"
              size="large"
              className="w-[412px]"
              to={props.pruefenPath}
            >
              Grundsteuererklärung starten
            </Button>
          </div>
        </div>
        <div className="border-b border-gray-900" />
      </div>
    </div>
  );
}
