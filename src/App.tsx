import './App.css';
import PaperView from './views/paper/paper.view';
import PaperStoreView from './views/paperStore/paperStore.view';

const App = (): JSX.Element => (
  <section className="App">
    <PaperView />
    <PaperStoreView />
  </section>
);

export default App;
