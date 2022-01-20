import { Link } from "@remix-run/react";

export default function Step2() {
  return (
    <div className="bg-beige-100 h-full p-4">
      <h1>Step 2</h1>
      <Link to="/steps/step1">Zurück</Link>
    </div>
  );
}
