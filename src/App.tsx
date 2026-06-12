import { Outlet } from "react-router";

export default function App() {
  return (
    <div className="min-h-dvh flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-[640px]">
        <Outlet />
      </div>
    </div>
  );
}
