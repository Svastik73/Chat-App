
const authConfig= {
    providers: [
      {
        domain: "https://saved-pelican-56.clerk.accounts.dev",
        applicationID: "convex",
      },  //it tell convex that we r authenticating with clerk
    ]
  };
  export default authConfig;