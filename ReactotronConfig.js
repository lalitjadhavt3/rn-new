import Reactotron, {networking} from 'reactotron-react-native';

Reactotron.configure().useReactNative().use(networking()).connect();
console.tron = Reactotron; // adding Reactotron to console

export default Reactotron;
