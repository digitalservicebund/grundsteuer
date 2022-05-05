import { ConfigStepFieldOptionsItem } from "~/domain";
import Details from "../Details";
import QuestionMark from "~/components/icons/mui/QuestionMark";
import FieldError from "./FieldError";
import Radio from "./Radio";
import FormGroup from "./FormGroup";

export type RadioGroupProps = {
  name: string;
  label: string;
  options: { value: string; label: string; help?: string }[];
  value?: string;
  defaultValue?: string;
  error?: string;
};

const RadioGroupOption = (
  option: ConfigStepFieldOptionsItem & {
    name: string;
    checked: boolean;
    help?: string;
  }
) => {
  const radioComponent = (
    <Radio
      defaultChecked={option.checked}
      name={option.name}
      value={option.value}
    >
      {option.label}
    </Radio>
  );

  if (option.help) {
    return (
      <div key={option.value} data-testid={`option-${option.value}`}>
        <Details
          summaryContent={
            <>
              {radioComponent}
              <QuestionMark
                className="inline-block float-right"
                role="img"
                aria-label="Hinweis"
              />
            </>
          }
          detailsContent={<p>{option.help}</p>}
        />
      </div>
    );
  } else {
    return (
      <div key={option.value} data-testid={`option-${option.value}`}>
        {radioComponent}
      </div>
    );
  }
};

export default function RadioGroup(props: RadioGroupProps) {
  const { name, label, options, value, defaultValue, error } = props;

  const errorComponent = error && <FieldError>{error}</FieldError>;

  return (
    <fieldset className="mb-4">
      <legend>{label}</legend>
      {options.map((option, index) => {
        const checked = value
          ? option.value === value
          : option.value === defaultValue;

        return (
          <div
            key={option.value}
            className={index + 1 < options.length ? "mb-24" : ""}
          >
            <RadioGroupOption
              {...{
                name,
                checked,
                value: option.value,
                label: option.label,
                help: option.help,
              }}
            />
          </div>
        );
      })}
      {errorComponent}
    </fieldset>
  );
}
