import { Button } from "@digitalservice4germany/digital-service-library";

export default function Index() {
  return (
    <div className="bg-beige-100 h-full p-4">
      <h1>Welcome to Remix</h1>
      <p>Some content</p>

      <Button onClick={() => console.log("clicked")}>Hi</Button>
    </div>
  );
}
