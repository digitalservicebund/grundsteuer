import { StepComponentFunction } from "~/routes/pruefen/_step";
import successImage from "~/assets/images/pruefen-yes.svg";

const Nutzung: StepComponentFunction = () => {
  return (
    <div>
      <img src={successImage} alt="" className="mb-80 mx-auto" />
    </div>
  );
};

export default Nutzung;
