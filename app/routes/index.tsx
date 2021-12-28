import {
  Layout,
  Footer,
  Button,
} from "@digitalservice4germany/digital-service-library";

export default function Index() {
  return (
    <Layout
      footer={<Footer> Footer </Footer>}
      sidebarNavigation={
        <div className="h-full p-4 bg-white">
          <ul>
            <li>Übersicht</li>
          </ul>
        </div>
      }
      topNavigation={
        <div className="p-4 bg-blue-300">
          topNavigation (hidden on larger screens)
        </div>
      }
    >
      <div className="bg-beige-100 h-full p-4">
        <h1>Welcome to Remix</h1>

        <Button label="Hi" onClick={() => console.log("clicked")} />
      </div>
    </Layout>
  );
}
