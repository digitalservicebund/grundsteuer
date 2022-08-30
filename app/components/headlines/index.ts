import { StepHeadline } from "~/components/StepHeadline";
import EmpfangsbevollmaechtigterNameHeadline from "~/components/headlines/eigentuemer/EmpfangsbevollmaechtigterNameHeadline";

export { StepHeadline as FallbackHeadlineComponent };

export default {
  eigentuemer: {
    empfangsbevollmaechtigter: {
      name: EmpfangsbevollmaechtigterNameHeadline,
    },
  },
};
