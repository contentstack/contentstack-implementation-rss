/**
 * Module dependencies.
 */


const configVars = require('./config');
const utils = require('./utils');

const mapping = [];
let syncTokenVar = '';

async function initialSyncCall() {
  return utils
    .getData(
      `${configVars.baseUrlContentStack}/stacks/sync?init=true&environment=${configVars.env}&content_type_uid=${configVars.expressBlogSection.blogContentTypeId}`,
    )
    .then((data) => {
      if (data.data.sync_token) {
        syncTokenVar = data.data.sync_token;
        data.data.items.map((index) => {
          mapping.push({
            uid: index.data.uid,
            link: index.data.url,
            last: index.data.updated_at,
            title: index.data.heading,
            description: index.data.description,
            publishDate: index.data.publish_details.time,
            language: index.data.locale,
          });
        });
        utils.createRssFile(mapping);
        utils.syncTokenGenerator(syncTokenVar);
      } else if (data.data.pagination_token) {
        data.data.items.map((index) => {
          mapping.push({
            uid: index.data.uid,
            link: index.data.url,
            last: index.data.updated_at,
            title: index.data.heading,
            description: index.data.description,
            publishDate: index.data.publish_details.time,
            language: index.data.locale,
          });
        });
        pagination(data.data.pagination_token);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function pagination(token) {
  return utils
    .getData(
      `${configVars.baseUrlContentStack}/stacks/sync?pagination_token=${token}`,
    )
    .then((data) => {
      data.data.items.map((index) => {
        mapping.push({
          uid: index.data.uid,
          link: index.data.url,
          last: index.data.updated_at,
          title: index.data.heading,
          description: index.data.description,
          publishDate: index.data.publish_details.time,
          language: index.data.locale,
        });
      });
      if (data.data.pagination_token) {
        pagination(data.data.pagination_token);
      }
      syncTokenVar = data.data.sync_token;
      utils.createRssFile(mapping);
      utils.syncTokenGenerator(syncTokenVar);
    })
    .catch((err) => {
      console.log(err);
    });
}

async function consecutiveSyncCall() {
  return utils
    .getData(
      `${configVars.baseUrlContentStack}/stacks/sync?sync_token=${syncTokenVar}`,
    )
    .then((data) => {
      if (syncTokenVar === data.data.sync_token) {
        return null;
      }
      if (syncTokenVar !== data.data.sync_token) {
        syncTokenVar = data.data.sync_token;
        utils.syncTokenGenerator(syncTokenVar);
        const syncUpdatedData = data.data;
        syncUpdatedData.items.map((index) => {
          if (index.type === 'entry_published') {
            const filteredData = mapping.filter(
              (filterIndex) => filterIndex.uid === index.data.uid,
            );
            if (filteredData.length === 0) {
              mapping.push({
                uid: index.data.uid,
                link: index.data.url,
                last: index.data.updated_at,
                title: index.data.heading,
                description: index.data.description,
                publishDate: index.data.publish_details.time,
                language: index.data.locale,
              });
            }
          } else if (index.type === 'entry_deleted') {
            mapping.map((elementIndex) => {
              if (elementIndex.uid === index.data.uid) {
                mapping.splice(mapping.indexOf(elementIndex), 1);
              }
            });
          }
        });
        mapping.map((obj, index) => {
          syncUpdatedData.items.map((respIndex) => {
            if (obj.uid === respIndex.data.uid) {
              if (obj.last !== respIndex.data.updated_at) {
                mapping[index].link = respIndex.data.url;
                mapping[index].title = respIndex.data.title;
                mapping[index].description = respIndex.data.description;
              }
            }
          });
        });
        utils.createRssFile(mapping);
      }
    });
}

module.exports = {
  initialSyncCall,
  consecutiveSyncCall,
};
