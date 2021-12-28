import { Button } from "@digitalservice4germany/digital-service-library";

export default function Index() {
  return (
    <div className="w-full flex flex-col sm:flex-row flex-wrap sm:flex-nowrap py-4 flex-grow bg-gray-900">
      <div className="w-fixed w-full flex-shrink flex-grow-0 px-4">
        <div className="sticky top-0 p-4 w-full h-full">
          <ul>
            <li>
              <a
                target="_blank"
                href="https://remix.run/tutorials/blog"
                rel="noreferrer"
              >
                15m Quickstart Blog Tutorial
              </a>
            </li>
            <li>
              <a
                target="_blank"
                href="https://remix.run/tutorials/jokes"
                rel="noreferrer"
              >
                Deep Dive Jokes App Tutorial
              </a>
            </li>
            <li>
              <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
                Remix Docs
              </a>
            </li>
          </ul>
        </div>
      </div>
      <main role="main" className="w-full flex-grow pt-1 px-3">
        <h1>Welcome to Remix</h1>

        <Button label="Hi" />
      </main>
    </div>
  );
}
