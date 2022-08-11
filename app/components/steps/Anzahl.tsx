import { useTransition } from "@remix-run/react";
import { Fragment, ReactNode } from "react";
import { Button, ContentContainer, SectionLabel } from "~/components";
import Help from "~/components/form/help/Help";
import DeleteIcon from "~/components/icons/mui/DeleteOutline";
import EditIcon from "~/components/icons/mui/EditOutlined";
import PlusIcon from "~/components/icons/mui/Plus";

const Anzahl = (props: {
  anzahl?: number | string;
  maxAnzahl: number;
  itemLabelTemplate: string;
  itemEditPathTemplate: string;
  increaseButtonLabel: string;
  attributes: { label: string; values?: (string | undefined)[] }[];
  help: ReactNode;
  labelIcon: ReactNode;
}) => {
  const transition = useTransition();
  const isSubmitting = Boolean(transition.submission);
  const anzahl = Number(props.anzahl || 1);

  const renderItems = () => {
    return [...Array(anzahl).keys()].map((index) => {
      const id = index + 1;
      const editPath = props.itemEditPathTemplate.replace(
        "[ID]",
        id.toString()
      );
      return (
        <div key={id} className="p-24 bg-white">
          <SectionLabel
            background="blue"
            icon={props.labelIcon}
            className="mb-16"
          >
            {props.itemLabelTemplate.replace("[ID]", id.toString())}
          </SectionLabel>
          <dl className="mb-24">
            {Object.entries(props.attributes).map(([key, attribute]) => {
              return (
                <Fragment key={key}>
                  <dt className="block uppercase tracking-1 text-11 leading-16 font-bold mb-4">
                    {attribute.label}
                  </dt>
                  <dd className="block text-18 mb-16">
                    {attribute.values?.[index] || "noch nicht ausgefüllt"}
                  </dd>
                </Fragment>
              );
            })}
          </dl>
          <div className="flex gap-24">
            <Button
              look="tertiary"
              size="medium"
              icon={<EditIcon />}
              to={editPath}
            >
              Ändern
            </Button>
            {anzahl > 1 && (
              <Button
                look="tertiary"
                size="medium"
                icon={<DeleteIcon />}
                type="submit"
                name="deleteButton"
                value={`${id}/${anzahl}`}
                disabled={isSubmitting}
              >
                Entfernen
              </Button>
            )}
          </div>
        </div>
      );
    });
  };

  return (
    <ContentContainer size="sm-md">
      <div className="mb-48">
        <Help>{props.help}</Help>
      </div>
      <div className="stack">{renderItems()}</div>
      {anzahl < props.maxAnzahl && (
        <button
          disabled={isSubmitting}
          type="submit"
          id="increaseAnzahl"
          name="increaseButton"
          value="true"
          className="mt-32 w-full py-24 flex items-center justify-center text-blue-800 border-blue-800 border-dashed border-[3px] hover:border-solid focus:border-solid disabled:border-gray-600 disabled:text-gray-600 disabled:border-dashed"
        >
          <div className="mr-10 text-18 font-bold">
            {props.increaseButtonLabel}
          </div>
          <PlusIcon />
        </button>
      )}
      <input name="anzahl" value={anzahl} readOnly type="hidden"></input>
      <div className="h-64"></div>
    </ContentContainer>
  );
};

export default Anzahl;
