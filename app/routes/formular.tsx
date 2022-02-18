import { Outlet } from "remix";

export default function Formular() {
  return (
    <div className="max-w-screen-md mx-auto p-16">
      <Outlet />
    </div>
  );
}
