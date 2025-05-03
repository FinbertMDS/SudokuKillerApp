import mitt from 'mitt';
import {AppEvents} from './types';

const eventBus = mitt<AppEvents>();

export default eventBus;
