import { StepHeadline } from "~/components/StepHeadline";
import EmpfangsbevollmaechtigterNameHeadline from "~/components/headlines/eigentuemer/EmpfangsbevollmaechtigterNameHeadline";
import FlurstueckAngabenHeadline from "~/components/headlines/grundstueck/flurstueck/FlurstueckAngabenHeadline";

export { StepHeadline as FallbackHeadlineComponent };

export default {
  grundstueck: {
    flurstueck: {
      angaben: FlurstueckAngabenHeadline,
    },
  },
  eigentuemer: {
    empfangsbevollmaechtigter: {
      name: EmpfangsbevollmaechtigterNameHeadline,
    },
  },
};
