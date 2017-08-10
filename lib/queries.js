import {curry, each, pick, find, get} from 'lodash/fp';

export const teamQuery = () => `query {
    me {
      current_team {
        dbid,
        id
      }
    }
  }`;

export const projectQuery = curry((project, teamDbId) => `mutation {
    createProject(input: {
      clientMutationId: "1",
      title: "${project}",
      team_id: ${teamDbId}
    }) {
      project {
        dbid
      }
    }
  }`);

export const autoTaskQuery = curry((projectId, teamDbId) => `query {
  project(ids: "${projectId},${teamDbId}") {
    auto_tasks
  }
}`);

export const autoTask = (t) => JSON.stringify(pick(['label', 'type', 'options'], t));

export const optionsQuery = (t) => {
  if (t.options) {
    let str = ',\\"options\\": \\"[';
    each(o => { str = `${str}{\\\\"label\\\\":\\\\"${o.label}\\\\"},`; })(t.options);
    str = str.slice(0, -1);
    str = `${str}]\\"`;
    return str;
  }
  return '';
  // {"[{\"label\":\"Option A\"},{\"label\":\"Option B\"}]"}
};

export const createAutoTaskQuery = curry((t, teamId) => `mutation {
 updateTeam(input: {
    clientMutationId: "1",
    id: "${teamId}",
    add_auto_task: "{
      \\"label\\": \\"${t.label}\\",
      \\"type\\": \\"${t.type}\\",
      \\"description\\": \\"\\"
      ${optionsQuery(t)}
    }"
  }) {
    team {
      projects(last: 1) {
        edges {
          node {
            auto_tasks,
          }
        }
      }
    }
  }
}`);

export const taskResponses = (u, ts, ats) => {
  let str = '';
  each(t => {
    const s = find(tt => tt.label === t.label)(ats).slug;
    const v = get(t.field, u);
    if (v) {
      str = `${str}\\"${s}\\": \\"${v}\\",`;
    }
  })(ts);
  str = str.slice(0, -1);
  return str;
};

export const createUnitQuery = curry((projectId, url, id, unit, ts, ats) => `mutation {
  createProjectMedia(input: {
    clientMutationId: "1",
    project_id: ${projectId},
    quote: "",
    url: "${url}",
    set_annotation: "{
      \\"annotation_type\\":\\"syrian_archive_data\\",
      \\"set_fields\\":\\"{\\\\"syrian_archive_data_id\\\\":\\\\"${id}\\\\"}\\"
    }",
    set_tasks_responses: "{
      ${taskResponses(unit, ts, ats)}
    }"
  }) {
    project_media {
      dbid
    }
  }
}`);
// \\"status\\":[\\"verified\\"],
export const mediaQuery = curry((projectId) => `query {
  search(query: "{\\"projects\\":[\\"${projectId}\\"]}") {
    medias(first: 10000) {
      edges {
        node {
          tasks(first: 10000) {
            edges {
              node {
                label
                first_response_value
              }
            }
          }
          syrian_archive_id: field_value(annotation_type_field_name: "syrian_archive_data:syrian_archive_data_id")
          media {
            url
          }
        }
      }
    }
  }
}`);

export default {
  mediaQuery, createUnitQuery, createAutoTaskQuery, autoTaskQuery, projectQuery, teamQuery
};
