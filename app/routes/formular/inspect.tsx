import { LoaderFunction, useLoaderData } from "remix";
import { useState, useEffect } from "react";
import { createMachine } from "xstate";
import { inspect } from "@xstate/inspect";
import { useMachine } from "@xstate/react";
import { getFormDataCookie } from "~/cookies";
import { defaults } from "~/domain/model";
import { getMachineConfig } from "~/domain/steps";
import { conditions as guards } from "~/domain/guards";
import { actions } from "~/domain/actions";

export const loader: LoaderFunction = async ({ request }) => {
  const cookie = await getFormDataCookie(request);
  const context = Object.keys(cookie).length < 1 ? defaults : cookie.records;
  const machineConfig = getMachineConfig(context);
  return { machineConfig };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function StateMachineInstance(props: any) {
  useMachine(props.machine, { devTools: true });
  return <div>Machine loaded. See other tab or check popup blocker.</div>;
}

export default function Machine() {
  const { machineConfig } = useLoaderData();

  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    inspect({
      url: "https://statecharts.io/inspect",
      iframe: false,
    });
    setInitialized(true);
  }, []);

  if (initialized) {
    const machine = createMachine(machineConfig, { guards, actions });
    return <StateMachineInstance machine={machine} />;
  } else {
    return <div>Loading</div>;
  }
}
