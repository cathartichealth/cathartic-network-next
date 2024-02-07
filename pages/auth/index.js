import { withAuthenticator } from "@aws-amplify/ui-react";

// New NavigationBar component
const NavigationBar = () => {
  return (
    <nav style={{ 
      backgroundColor: "#510350", 
      padding: 10, 
      color: "#fff", 
      textAlign: "center", 
      position: "fixed", 
      top: 0, 
      left: 0, 
      bottom: 0, 
      width: "100px" /* Adjust the width as needed */ 
    }}>
      <div style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "center" }}>
        <a href="/" style={{ textDecoration: "none", color: "#fff" }}>Home</a>
        <a href="/profile" style={{ textDecoration: "none", color: "#fff" }}>Profile</a>
      </div>
    </nav>
  );
};



export function getServerSideProps() {
  const renderedAt = new Date();
  const formattedBuildDate = renderedAt.toLocaleDateString("en-US", {
    dateStyle: "long",
  });
  const formattedBuildTime = renderedAt.toLocaleTimeString("en-US", {
    timeStyle: "long",
  });
  return {
    props: {
      renderedAt: `${formattedBuildDate} at ${formattedBuildTime}`,
    },
  };
}

function Home({ signOut, user, renderedAt }) {
  return (
    <div style={{ paddingLeft: "120px" }}> 
      <NavigationBar />

      <div style={{ padding: 50 }}>
        <h1>Logged in as {user.username}.</h1>
        <div>
          <button onClick={signOut}>Sign out</button>
        </div>
        <p>This page was server-side rendered on {renderedAt}.</p>
      </div>
    </div>
  );
}


export default withAuthenticator(Home);
