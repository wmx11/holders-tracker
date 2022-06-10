const separator = ',';
const getIsMultiple = (item) => item.indexOf(separator) > -1;

const getLastDayQuery = () => {
  return {
    created_at: {
      lte: new Date(new Date().setHours(0, 0, 0, 0)),
    },
  };
};

const getFromDateQuery = (date) => {
  return {
    created_at: {
      gte: new Date(date),
    },
  };
};

const getSelections = (select) => {
  if (!select) {
    return {};
  }

  const isMultiple = getIsMultiple(select);

  if (isMultiple) {
    return select.split(separator).reduce(
      (obj, item) => {
        Object.assign(obj.select, { [item]: true });
        return obj;
      },
      { select: {} }
    );
  }

  if (!isMultiple) {
    return { select: { [select]: true } };
  }

  return {};
};

const constructQuery = (payload) => {
  const query = {};

  if (!payload) {
    return query;
  }

  // Add initial take: 1 and OrdereBy
  Object.assign(query, {
    take: 100,
    orderBy: [{ value: 'desc' }],
    where: { value: { gte: 1 } },
  });

  if (payload.type && payload.value) {
    Object.assign(query.where, { [payload.type]: payload.value });
  }

  if (payload.lte) {
    Object.assign(query.where, {
      value: { lte: parseInt(payload.lte, 10) || 1 },
    });
  }

  if (payload.gte) {
    Object.assign(query.where, {
      value: { gte: parseInt(payload.gte, 10) || 1 },
    });
  }

  if (payload.last_day) {
    Object.assign(query.where, { ...getLastDayQuery() });
  }

  if (payload.from) {
    Object.assign(query.where, { ...getFromDateQuery(payload.from) });
  }

  if (payload.order) {
    Object.assign(query, {
      orderBy: [{ value: payload.order || 'desc' }],
    });
  }

  if (payload.select) {
    Object.assign(query, { ...getSelections(payload.select) });
  }

  return query;
};

const forHolders = (payload) => {
  const query = constructQuery(payload);

  if (!query) {
    return {};
  }

  return {
    query,
  };
};

const constructDynamicQuery = (payload, type) => {
  switch (type) {
    case 'holders':
      return forHolders(payload);
    default:
      return {};
  }
};

module.exports = constructDynamicQuery;
