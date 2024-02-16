import './style.scss';

import ListEditor from './components/ListEditor';

const root = document.getElementById('root');
const listEditor = new ListEditor(root);
listEditor.init();
