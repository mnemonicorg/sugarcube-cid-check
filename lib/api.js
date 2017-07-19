import {curry} from 'lodash/fp';
import {utils} from 'littlefork-core';
import gqlclient from 'graphql-client';

const u = utils.combinators;
const h = utils.hasher;

const client = (token) => gqlclient({
  url: 'https://check-api-qa.checkmedia.org/api/graphql',
  headers: {
    'X-Check-Token': token
  }
});

const variables = {};

const request = curry((token, query) => {
  const c = client(token);
  return c.query(query, variables, (req, res) => {
    if (res.status === 401) {
      throw new Error('Not authorized');
    }
  })
  .then((body) => {
    console.log('aaaaaaaaaaaaaaaa');
    console.log(body);
    return body;
  })
  .catch((err) => {
    console.log(err.message);
  });
});

const teamQuery = () => `query {
    me {
      current_team {
        dbid
      }
    }
  }`;

const projectQuery = curry((project, teamId) => `mutation {
    createProject(input: {
      clientMutationId: "1",
      title: "${project}",
      team_id: ${teamId}
    }) {
      project {
        dbid
      }
    }
  }`);

const autoTaskQuery = curry((taskName) => `
mutation {
 updateTeam(input: {
    clientMutationId: "1",
    id: "${h.sha256(taskName)}",
    add_auto_task: "{
      "label": "${taskName}?",
      "type": "free_text",
      "description": ""
    }"
  }) {
    team {
      projects(last: 1) {
        edges {
          node {
            auto_tasks
          }
        }
      }
    }
  }
}`);

const handleTq = (r) => r.data.me.current_team.dbid;
const handlePq = (r) => {
  console.log('[[[[[[[[[[[[[[[[[]]]]]]]]]]]]]]]]]');
  console.log(r);
  console.log(r.data.createProject.project.dbid);
  return r.data.createProject.project.dbid;
};

export const updateCheck = (token, project) => {
  const r = request(token);
  return u.flowP([autoTaskQuery('new field'), r, teamQuery, r, handleTq, projectQuery(project), r, handlePq])(null);
};

export default {
  client, updateCheck
};
