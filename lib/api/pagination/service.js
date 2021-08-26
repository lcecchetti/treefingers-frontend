/**
 * Encode cursor for pagination
 * @param {string} string 
 * @returns {string}
 */
const encodeCursor = (cursor) => {
  if (!cursor) {
    return '';
  }

  return Buffer.from(String(cursor)).toString('base64');
}

/**
 * Decode cursor for pagination
 * @param {string} string 
 * @returns {string}
 */
const decodeCursor = (cursor) => {
  if (!cursor) {
    return '';
  }

  return Buffer.from(String(cursor), 'base64').toString('ascii');
};

/**
 * Apply pagination to given model
 * @param {MongooseModel} model 
 * @param {String|Object} filter 
 * @param {String|Object} sort 
 * @param {Object} pagination 
 * @return {Promise<Object>} - paginated result
 */
const paginate = async (model, filter = {}, sort = {}, { cursor, skip, limit = 10 }) => {
  const result = {};

  // validate inputs for cursor pagination
  if (cursor && (sort.length > 1 || !sort._id)) {
    throw new Error('Cursor pagination requires sorting only by _id');
  }  

  // prepare cursor filter
  const currentCursor = decodeCursor(cursor);
  if (currentCursor) {
    filter._id = sort._id > 0 ? { $gt: currentCursor } : { $lt: currentCursor };
  }

  // get nodes
  const nodes = await model.find(filter, null, { sort, limit, skip });

  // build edges
  result.edges = nodes.map((node) => {
    return {
      cursor: encodeCursor(node._id),
      node,
    };
  });

  // prepare page infos
  const edgesCount = await model.estimatedDocumentCount(filter);
  const pagesCount = limit ? Math.floor(edgesCount / limit) : 1;
  
  result.pageInfo = {
    edgesCount,
    pagesCount,
    startCursor: result.edges.slice(0, 1).pop()?.cursor,
    endCursor: result.edges.slice(-1).pop()?.cursor,
    hasNextPage: result.edges?.length,
    pageSize: limit,
    currentPage: skip,
  };

  return result;
};

export default {
  paginate,
};