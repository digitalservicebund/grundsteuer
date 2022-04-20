import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState, useEffect } from "react";
import { createMachine } from "xstate";
import { inspect } from "@xstate/inspect";
import { useMachine } from "@xstate/react";
import { getStoredFormData } from "~/formDataStorage.server";
import { getMachineConfig } from "~/domain/states";
import { conditions as guards } from "~/domain/guards";
import { actions } from "~/domain/actions";
import { authenticator } from "~/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });
  const storedFormData = await getStoredFormData({ request, user });
  const machineConfig = getMachineConfig(storedFormData);
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const machine = createMachine(machineConfig, { guards, actions });
    return <StateMachineInstance machine={machine} />;
  } else {
    return <div>Loading</div>;
  }
}
