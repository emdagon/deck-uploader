import "semantic-ui-css/semantic.min.css";
import "react-dropzone-uploader/dist/styles.css";

import type { AppProps /*, AppContext */ } from "next/app";
import { useRouter } from "next/router";
import Link from "next/link";
import { ApolloProvider } from "@apollo/client";

import { Container, Menu } from "semantic-ui-react";

import client from "../lib/api-client";
import CreateCompanyModal from "../components/NewCompanyModal";
import TopbarBreadcrumb from "../components/TopbarBreadcrumb";

function DecksApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { handler, deckId } = router.query;

  return (
    <ApolloProvider client={client}>
      <div>
        <Menu fixed="top" borderless>
          <Container>
            <Menu.Item header>
              {/* <Image size="mini" src="/logo.png" style={{ marginRight: "1.5em" }} /> */}
              <Link href="/">Deck Uploader</Link>
            </Menu.Item>
            <Menu.Item>
              <TopbarBreadcrumb
                handler={handler as String}
                deckId={deckId as String}
              />
            </Menu.Item>
            {/* <Menu.Item as="a">Upload</Menu.Item> */}
            <Menu.Item position="right">
              <CreateCompanyModal />
            </Menu.Item>
          </Container>
        </Menu>
        <Component {...pageProps} />
      </div>
    </ApolloProvider>
  );
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// DecksApp.getInitialProps = async (appContext: AppContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);

//   return { ...appProps }
// }

export default DecksApp;
