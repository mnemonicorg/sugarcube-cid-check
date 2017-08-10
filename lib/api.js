import {curry, map, filter} from 'lodash/fp';
import Promise from 'bluebird';
import gqlclient from 'graphql-client';

import {mediaQuery, createUnitQuery, createAutoTaskQuery, autoTaskQuery, teamQuery} from './queries';
import {tasks as maketasks} from './tasks';
import {makeUnits} from './entities';

const client = (token, apiurl) => gqlclient({
  url: apiurl,
  headers: {
    'X-Check-Token': token
  }
});

const request = curry((token, apiurl, query) => {
  console.log(query);
  const c = client(token, apiurl);
  return c.query(query, {}, (req, res) => {
    if (res.status === 401) {
      throw new Error('Not authorized');
    }
  })
  .then((body) => {
    console.log(body);
    return body;
  })
  .catch((err) => {
    console.log(err.message);
  });
});

export const updateCheck = (token, apiurl, projectId, units) => {
  const r = request(token, apiurl);
  const d = {projectId};
  return r(teamQuery())
    .then(response => {
      d.teamDbId = response.data.me.current_team.dbid;
      d.teamId = response.data.me.current_team.id;
      return d;
    })
    .then(({teamDbId}) => r(autoTaskQuery(projectId, teamDbId)))
    .then(response => {
      d.auto_tasks = response.data.project.auto_tasks;
      console.log(d);
      return d;
    })
    .then(({teamId, auto_tasks}) =>
      maketasks().then(tasks => {
        const newtasks = filter(tt => !map(t => t.label, auto_tasks).includes(tt.label), tasks);
        console.log(newtasks, 'newtasks');
        d.tasks = tasks;
        return Promise.each(newtasks,
          (t) =>
            r(createAutoTaskQuery(t, teamId))
              .then(response => {
                d.auto_tasks = response.data.updateTeam.team.projects.edges[0].node.auto_tasks;
                return d;
              })
          );
      })
    )
    .then(() => {
      console.log(d);
      return d;
    })
    .then(() => {
      console.log('units');
      return Promise.each(units,
        u =>
          r(createUnitQuery(
            projectId, u.dem.online_link, u._lf_id_hash, u, d.tasks, d.auto_tasks)));
    });
};

export const list = (token, apiurl, projectId) => {
  console.log('listing', projectId);
  const r = request(token, apiurl);
  return r(mediaQuery(projectId))
    .then(re => {
      const us = re.data.search.medias.edges;
      console.log(us[1]);
      console.log(us[1].node.tasks.edges);
      return makeUnits(us).then(rrr => {
        console.log(rrr);
        return rrr;
      });
    });
};

export default {
  client, updateCheck, list
};
