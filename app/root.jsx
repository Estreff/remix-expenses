import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
  isRouteErrorResponse,
  useMatches
} from "@remix-run/react";

import sharedStyles from `~/styles/shared.css`

import  Error  from './components/util/Error'

export function meta() {
  return [
    {charset: 'utf-8'},
    {title: 'Remix Expenses'},
    {viewport: 'width=device-width, initial-scale=1'}
  ]
}

export function links() {
  return( [{rel:'stylesheet', href:sharedStyles}] )
}

function Document({title, children}) {
  const matches = useMatches()
  const disableJS = matches.some(match => match.handle?.disableJS);

  return (
    <html lang="en">
      <head>
        {title && <title>{title}</title>}
        <Meta />
        <Links />
      </head>
      <body>   
        {children}    
        <ScrollRestoration />
        {!disableJS && <Scripts />}
        <LiveReload />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

// export function CatchBoundary() {
//   const caughtResponse = useRouteError();
//   console.log('Catch Boundary Error: ', caughtResponse.data)
  
//   return (
//     <Document title={caughtResponse.data.status}>
//       <main>
//         <Error title={caughtResponse.data}>
//           <p>{caughtResponse.data?.message || 'Something went wrong, please try again later!'}</p>
//           <Link to="/">Back to Safety</Link>
//         </Error>
//       </main>
//     </Document>
//   )

// }

export function ErrorBoundary({error}) {
  const caughtResponse = useRouteError();
  
  if(isRouteErrorResponse(caughtResponse)) {
    const pageTitle = `${caughtResponse.status} - ${caughtResponse.statusText} | Remix Expenses`
    const statusMessage = `${caughtResponse.status} - ${caughtResponse.statusText}`

    return (
      <Document title={pageTitle}>
        <main>
          <Error title={statusMessage}>
            <p>{caughtResponse.data || 'Something went wrong, please try again later!'}</p>
            <Link to="/">Back to Safety</Link>
          </Error>
        </main>
      </Document>
    )
  } 

    return (
      <Document title="Error | Remix Expenses">
        <main>
          <Error title="An error occured!!">
            <p>{error?.message || 'Something went wrong, please try again later!'}</p>
            <Link to="/">Back to Safety</Link>
          </Error>
        </main>
      </Document>
    )
  }  
