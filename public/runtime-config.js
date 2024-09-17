window["runConfig"] = {
  client_id: "",
  redirect_uri: "http://localhost:3000",
  authroization_URL: "",
  token_uri: "",
  scope: "", //If multiple scopes available, provide space between each scope
  logoutEndPoint: "",
  refreshTokenTime: 60, //60, //in Seconds ,number of seconds befoe access token expires to fetch refresh token
  warnSessionTimeout: 15, //In Minutes. to popup warning message for session timeout.
  sessionTimeout: 20, //In Minutes. to  timeout the session.
  termsConditionURL: "TermsAndConditions.html", //This can be also external url like "https://www.google.com"
  privacyPolicyURL: "PrivacyPolicy.html", //This can be also external url like "https://www.google.com"
  authType: 0, //0:Windows, 1: OAuth
  mapOptions: { center: [10.64051, 6.22732], zoom: 2, refreshMinutes: 5 },//This is used for Enterprise Dashboard. Center:default/initial center Coordinates of map,zoom:default/initial zoom-in/out,refreshMinutes: data refreshes in the page 
  defaultHomePage: { itemName: "Home", itemCode: "Home", localizedKey: "Home", itemProps: {}, parents: [], childs: [], isComponent: "true" },
  driverHomePage: { itemName: "UserOverView", itemCode: "UserOverView", localizedKey: "UserOverView", itemProps: {}, parents: [], isComponent: "true" }
};
