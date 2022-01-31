import { Outlet } from "remix";

export default function Steps() {
  return (
    <div className="max-w-screen-md mx-auto p-16">
      <Outlet />
    </div>
  );
}
