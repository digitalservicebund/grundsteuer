import QuestionMark from "~/components/icons/mui/QuestionMark";
import Details from "~/components/Details";

export type CheckboxProps = {
  name: string;
  label: string;
  help?: string;
  value?: string;
  defaultValue?: string;
};

export default function Checkbox(props: CheckboxProps) {
  const { name, label, help, defaultValue, value } = props;

  const inputComponent = (
    <input
      defaultChecked={!!defaultValue}
      type="checkbox"
      name={name}
      value="true"
      id={name}
    />
  );
  const labelComponent = <label htmlFor={name}>{label}</label>;

  if (help) {
    return (
      <div>
        <Details
          summaryContent={
            <div className="position-relative">
              {inputComponent}
              {labelComponent}
              <QuestionMark
                className="inline-block float-right"
                role="img"
                aria-label="Hinweis"
              />
            </div>
          }
          detailsContent={<p>{help}</p>}
        />
      </div>
    );
  } else {
    return (
      <div>
        {inputComponent}
        {labelComponent}
      </div>
    );
  }
}
