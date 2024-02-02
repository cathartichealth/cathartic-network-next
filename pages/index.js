"use client"
// AWS CONFIG
import { Amplify, Auth } from "aws-amplify";

// REACT 
import Link from 'next/link';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Accordion from '../components/accordion';


const handlePress = () => {
  const router = useRouter();
  router.push('/auth');
}

export default function Home() {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="text-purple-800 text-4xl text-center mb-8">
          Welcome to the Cathartic Network!
        </h1>

        <h2>
          Not sure what the network is? Click below to learn more.
        </h2>
        
        <div className="flex justify-center gap-8 py-4">
          <div>
            <Accordion title="Supplier Accordion" description="Picture/ Animation" />
          </div>
          <div>
            <Accordion title="Client Accordion" description="Definition" />
          </div>
        </div>
        
        <Accordion title="What is Cathartic Network?" description="Definition" />

        <Link className="bg-purple-800 text-white py-2 px-4 rounded-full mt-4" href="/auth">
          Get started! &rarr;
        </Link>

      </main>

      <style jsx>{`
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        /* Other styles remain unchanged */
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}
