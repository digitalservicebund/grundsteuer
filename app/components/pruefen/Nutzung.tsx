import { StepComponentFunction } from "~/routes/pruefen/_step";
import IntroText from "../IntroText";
import successImage from "~/assets/images/pruefen-yes.svg";

const Nutzung: StepComponentFunction = ({ i18n }) => {
  return (
    <div>
      <IntroText className="mb-32">{i18n.specifics.explanation}</IntroText>
      <img src={successImage} alt="" className="mb-80 mx-auto" />
    </div>
  );
};

export default Nutzung;
