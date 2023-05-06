const configQA = {
  apiKey: "AIzaSyD0R_nZ9YZWLHh8GpFz1pEQnpqnmTy1XTI",
  authDomain: "hbmentregas-qas.firebaseapp.com",
  databaseURL: "https://hbmentregas-qas-default-rtdb.firebaseio.com",
  projectId: "hbmentregas-qas",
  storageBucket: "hbmentregas-qas.appspot.com",
  messagingSenderId: "355994260696",
  appId: "1:355994260696:web:455a585d4fc224c7b833ad",
  measurementId: "G-2V3YY7FH6R"
};
const configPRD = {
  apiKey: "AIzaSyC9uRLUflmOe0vxbMcD3FYVUneRLXCzSqM",
  authDomain: "hbmentregas-prd.firebaseapp.com",
  databaseURL: "https://hbmentregas-prd-default-rtdb.firebaseio.com",
  projectId: "hbmentregas-prd",
  storageBucket: "hbmentregas-prd.appspot.com",
  messagingSenderId: "650160880259",
  appId: "1:650160880259:web:2f64d62c92a1564b4f79b6",
  measurementId: "G-V6M1BJFVSV"
};
const configPrd = {};
const urlQA = "https://docker-qas.hansa.com.bo:9071/api/entregas";
const urlPrd = "https://docker.hansa.com.bo:9071/api/entregas";

var prd = {
  fbConfig: configPRD,
  urlWS: urlPrd
}
var qa = {
  fbConfig: configQA,
  urlWS: urlQA
}

module.exports = Object.freeze(qa);
//module.exports = prd;