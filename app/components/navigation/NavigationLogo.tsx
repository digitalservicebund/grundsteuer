import { Link } from "@remix-run/react";
export default function NavigationLogo(props: { className: string }) {
  return (
    <Link to="/" className={`block ${props.className}`}>
      <div className="font-bold">Grundsteuererklärung</div>
      für Privateigentum
    </Link>
  );
}
