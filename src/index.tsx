import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './views/App';
import registerServiceWorker from './registerServiceWorker';
// import useSWR from 'swr';
// import useFetch from './useFetch';

// function Item() {
//   const [data] = useFetch(
//     v =>
//       new Promise<string>(resolve => {
//         setTimeout(() => {
//           resolve(v);
//         }, 3000);
//       }),
//     '666'
//   );
//   return <div>{data}</div>;
// }

// function App() {
//   return (
//     <React.Suspense fallback={<div>loading...</div>}>
//       <Item />
//     </React.Suspense>
//   );
// }

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
