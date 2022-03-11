import CloseIcon from "~/components/icons/mui/Close";
import AddIcon from "~/components/icons/mui/Add";
import RemoveIcon from "~/components/icons/mui/Remove";
import FileCopyIcon from "~/components/icons/mui/FileCopy";

export default function KitchenSink() {
  return (
    <div className="text-orange-500">
      <p className="font-sans">
        font-sans <strong>bold</strong>{" "}
        <em>
          italic <strong>bold</strong>
        </em>
      </p>
      <p className="font-serif">
        font-serif <strong>bold</strong>{" "}
        <em>
          italic <strong>bold</strong>
        </em>
      </p>
      <p className="font-condensed">font-condensed</p>
      <CloseIcon className="w-24 h-24 fill-current" />
      <AddIcon className="w-24 h-24 fill-blue-500" />
      <RemoveIcon className="w-24 h-24 fill-black" />
      <FileCopyIcon className="w-36 h-36 fill-blue-800" />
    </div>
  );
}
