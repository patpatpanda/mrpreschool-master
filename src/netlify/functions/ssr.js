// const React = require('react');
// const ReactDOMServer = require('react-dom/server');
// const App = require('../../src/App').default;  // Importera din App-komponent
// const fs = require('fs');
// const path = require('path');

// exports.handler = async function(event, context) {
//   // Läs in index.html från din byggmapp
//   const indexFile = fs.readFileSync(path.resolve(__dirname, '../../dist/index.html'), 'utf8');
  
//   // Rendera React-appen som en HTML-sträng
//   const appHtml = ReactDOMServer.renderToString(React.createElement(App));

//   // Ersätt innehållet i <div id="root"></div> med din renderade React-app
//   const html = indexFile.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);

//   return {
//     statusCode: 200,
//     headers: {
//       'Content-Type': 'text/html',
//     },
//     body: html,  // Returnera den server-renderade HTML:n
//   };
// };
