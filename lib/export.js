import {size} from 'lodash/fp';
import {updateCheck} from './api';

const plugin = (envelope, {cfg, log}) => {
  log.info(`Calling a plugin with ${size(envelope.data)} units.`);
  const token = cfg.check.token;

  return updateCheck(token, 'yrian Archive').then(() => envelope);
};

plugin.desc = 'A plugin boilerplate module.';

plugin.argv = {
  'check.token': {
    type: 'text',
    desc: 'check token'
  },
};

export default plugin;
