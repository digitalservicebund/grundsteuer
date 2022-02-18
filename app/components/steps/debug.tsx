import type { StepComponentFunction } from "~/routes/formular/_step";

const Debug: StepComponentFunction = (props) => {
  return (
    <div className="p-4 mb-4 bg-yellow-200 border-4 border-yellow-500">
      <pre>{JSON.stringify({ props }, null, 2)}</pre>
    </div>
  );
};

export default Debug;
