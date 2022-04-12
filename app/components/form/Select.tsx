import classNames from "classnames";
import { ConfigStepFieldOptionsItem } from "~/domain";
import Details from "../Details";
import FieldError from "./FieldError";
import Label from "./Label";
import QuestionMark from "~/components/icons/mui/QuestionMark";
import { FormGroup } from "~/components";

export type SelectProps = {
  name: string;
  label: string;
  options: ConfigStepFieldOptionsItem[];
  help?: string;
  value?: string;
  defaultValue?: string;
  error?: string;
};

export default function Select(props: SelectProps) {
  const { name, label, options, help, value, defaultValue, error } = props;
  const id = name;

  const renderSelectFieldOption = (option: ConfigStepFieldOptionsItem) => {
    return (
      <option
        value={option.value}
        key={option.value}
        disabled={option.defaultOption}
        selected={option.defaultOption}
      >
        {option.label}
      </option>
    );
  };

  const labelComponent = <Label id={id}>{label}</Label>;
  const fieldComponent = (
    <select
      name={name}
      id={id}
      defaultValue={value || defaultValue}
      className={classNames(
        "block w-full",
        "bg-white text-black",
        "border-2 border-blue-800",
        "hover:outline hover:outline-4 hover:outline-blue-800 hover:outline-offset-[-4px]",
        "focus:outline focus:outline-4 focus:outline-blue-800 focus:outline-offset-[-4px]",
        "disabled:!text-gray-600 disabled:!border-gray-600 disabled:!outline-none",
        "px-24 min-h-[4rem] text-18 leading-24",
        {
          "border-red-800 bg-red-200": error,
        }
      )}
    >
      {options.map(renderSelectFieldOption)}
    </select>
  );

  const errorComponent = error && <FieldError>{error}</FieldError>;

  if (help) {
    return (
      <FormGroup>
        <Details
          summaryContent={
            <>
              <div className="flex justify-between">
                {labelComponent}
                <QuestionMark role="img" aria-label="Hinweis" />
              </div>
              {fieldComponent}
            </>
          }
          detailsContent={<p>{help}</p>}
        />
        {errorComponent}
      </FormGroup>
    );
  } else {
    return (
      <FormGroup>
        {labelComponent}
        {fieldComponent}
        {errorComponent}
      </FormGroup>
    );
  }
}
