import { Link } from "remix";
import { Footer } from "~/components";

export default function Index() {
  return (
    <>
      <main className="flex-grow p-16">
        <h1 className="mb-8 text-4xl font-bold">
          Grundsteuererklärung für Privateigentum
        </h1>

        <Link
          to="/formular/grundstueck/adresse"
          className="text-2xl underline text-blue-500"
          data-testid="start-formular"
        >
          Fragebogen
        </Link>
      </main>
      <Footer />
    </>
  );
}
