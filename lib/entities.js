import {map, reduce, find, set, merge, curry} from 'lodash/fp';
import {tasks as getTasks} from './tasks';

export const checkToUnit = curry((tasks, c) => {
  const u = {};
  const ftasks = map(t => t.node, c.node.tasks.edges);
  u['_lf_id_hash'] = c.node.syrian_archive_id; //eslint-disable-line

  console.log('============');
  console.log(tasks);
  console.log('===============');
  console.log(ftasks);

  return reduce((a, t) => {
    const relt = find(ft => ft.label === t.label)(ftasks);
    if (relt) {
      const value = find(ft => ft.label === t.label)(ftasks).first_response_value;
      console.log(value);
      console.log(t.field);

      return merge(a, set(t.field, value, {}));
    }
    return a;
  }, u)(tasks);
});

export const unitToCheck = (u) => u;

export const makeUnits = (us) => getTasks().then(ts => map(checkToUnit(ts))(us));

export default {
  checkToUnit, unitToCheck, makeUnits
};
