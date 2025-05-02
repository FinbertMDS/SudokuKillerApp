import mitt from 'mitt';
import {CoreEvents} from '../types';

type DynamicEvents = Record<string, any>;
type AppEvents = CoreEvents & DynamicEvents;

const eventBus = mitt<AppEvents>();

export default eventBus;
