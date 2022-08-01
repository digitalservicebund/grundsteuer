import { useTransition } from "@remix-run/react";
import { ReactNode } from "react";
import { Button, ContentContainer, IconLabel } from "~/components";
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
  itemAttribute1Label: string;
  itemAttribute2Label: string;
  itemAttributes1?: (string | undefined)[];
  itemAttributes2?: (string | undefined)[];
  help: ReactNode;
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
          <IconLabel background="blue" iconName="marker" className="mb-16">
            {props.itemLabelTemplate.replace("[ID]", id.toString())}
          </IconLabel>
          <dl className="mb-24">
            <dt className="block uppercase tracking-1 text-11 leading-16 font-bold mb-4">
              {props.itemAttribute1Label}
            </dt>
            <dd className="block text-18 mb-16">
              {props.itemAttributes1?.[index] || "Wird automatisch eingetragen"}
            </dd>
            <dt className="block uppercase tracking-1 text-11 leading-16 font-bold mb-4">
              {props.itemAttribute2Label}
            </dt>
            <dd className="block text-18">
              {props.itemAttributes2?.[index] || "Wird automatisch eingetragen"}
            </dd>
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
      <div className="stack">{renderItems()}</div>
      <Help>{props.help}</Help>
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
      <div className="h-64"></div>
      <input name="anzahl" value={anzahl} readOnly type="hidden"></input>
    </ContentContainer>
  );
};

export default Anzahl;
