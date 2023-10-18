import "@aws-amplify/ui-react/styles.css";
import { Amplify } from "aws-amplify";
import awsExports from "../src/aws-exports";
import "../pages/Clients/ProductList.css";
import "../styles/globals.css";
import accordionStyles from '../styles/accordion.css';
import cardStyles from '../styles/card.css';


Amplify.configure({ ...awsExports, ssr: true });

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
