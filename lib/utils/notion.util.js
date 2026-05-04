
import { getTextContent } from 'notion-utils'

/**
 * Notion 数据格式清理工具
 * 旧版 block:{ value:{}}
 * 新版 block:{ spaceId:{ id:{ value:{} } } }
 * 强制解包成旧版
 * @param {*} blockMap 
 * @returns 
 */
export function adapterNotionBlockMap(blockMap) {
  if (!blockMap) return blockMap;

  const cleanedBlocks = {};
  const cleanedCollection = {};
  const cleanedCollectionView = {};

  for (const [id, block] of Object.entries(blockMap.block || {})) {
    cleanedBlocks[id] = { value: unwrapValue(block) };
  }

  for (const [id, collection] of Object.entries(blockMap.collection || {})) {
    cleanedCollection[id] = { value: unwrapValue(collection) };
  }

  for (const [id, view] of Object.entries(blockMap.collection_view || {})) {
    cleanedCollectionView[id] = { value: unwrapValue(view) };
  }

  const result = {
    ...blockMap,
    block: cleanedBlocks,
    collection: cleanedCollection,
    collection_view: cleanedCollectionView
  };

  return filterCollectionQuery(result);
}


function unwrapValue(obj) {
  if (!obj) return obj

  // 新格式特征：外层有 role 或 spaceId，value 里才是真实 block（有 id 和 type）
  // { spaceId, value: { value: { id, type, ... }, role } }
  if (obj?.value?.value?.id && obj?.value?.role) {
    return obj.value.value
  }

  // 次新格式：{ value: { id, type, ... }, role }
  if (obj?.value?.id && obj?.role !== undefined) {
    return obj.value
  }

  // 旧格式：{ value: { id, type, ... } } 直接取 value
  if (obj?.value?.id) {
    return obj.value
  }

  // 兜底：原样返回
  return obj?.value ?? obj
}

/**
 * 根据视图过滤器筛选 Collection Query 结果
 * 解决 Notion API 某些情况下返回未过滤数据的问题，以及 react-notion-x 不支持客户端过滤的问题
 */
function filterCollectionQuery(recordMap) {
  const collectionQuery = recordMap.collection_query;
  if (!collectionQuery || Object.keys(collectionQuery).length === 0) return recordMap;

  try {
    for (const collectionId in collectionQuery) {
      const views = collectionQuery[collectionId];
      for (const viewId in views) {
        const viewData = views[viewId];
        if (!viewData) continue;

        const view = recordMap.collection_view?.[viewId]?.value;
        const collection = recordMap.collection?.[collectionId]?.value;

        if (view && collection) {
          const filter = getNormalizedFilter(view);
          const sorts = view.query2?.sort || view.query?.sort;

          if ((filter && filter.filters?.length > 0) || (sorts && sorts.length > 0)) {
            const filterAndSortAllBlockIds = (obj) => {
              if (!obj || typeof obj !== 'object') return;
              if (Array.isArray(obj.blockIds)) {
                // 1. 先筛选
                if (filter && filter.filters?.length > 0) {
                  obj.blockIds = applyFilters(obj.blockIds, filter, collection, recordMap);
                }
                // 2. 再排序
                if (sorts && sorts.length > 0) {
                  obj.blockIds = applySorts(obj.blockIds, sorts, collection, recordMap);
                }
              }
              for (const key in obj) {
                if (typeof obj[key] === 'object' && key !== 'blockIds') {
                  filterAndSortAllBlockIds(obj[key]);
                }
              }
            };
            filterAndSortAllBlockIds(viewData);
          }
        }
      }
    }
  } catch (e) {
    console.error('[Notion Filter/Sort] 执行异常:', e);
  }
  return recordMap;
}

/**
 * 执行客户端排序
 */
function applySorts(blockIds, sorts, collection, recordMap) {
  if (!sorts || sorts.length === 0) return blockIds;

  return [...blockIds].sort((aId, bId) => {
    const a = recordMap.block[aId]?.value;
    const b = recordMap.block[bId]?.value;
    if (!a || !b) return 0;

    for (const s of sorts) {
      const { property, direction } = s;
      const schema = collection.schema[property];
      
      const aRaw = a.properties?.[property];
      const bRaw = b.properties?.[property];
      
      let aVal, bVal;
      
      if (schema?.type === 'date') {
        aVal = aRaw?.[0]?.[1]?.[0]?.[1]?.start_date || '';
        bVal = bRaw?.[0]?.[1]?.[0]?.[1]?.start_date || '';
      } else {
        aVal = getTextContent(aRaw) || '';
        bVal = getTextContent(bRaw) || '';
      }

      if (aVal === bVal) continue;

      const multiplier = direction === 'ascending' ? 1 : -1;
      
      // 数字比较
      if (schema?.type === 'number') {
        return (Number(aVal) - Number(bVal)) * multiplier;
      }
      
      // 日期或字符串比较
      return aVal.localeCompare(bVal, undefined, { numeric: true, sensitivity: 'base' }) * multiplier;
    }
    return 0;
  });
}


/**
 * 规格化过滤器结构，兼容 query2.filter 和 format.property_filters
 */
function getNormalizedFilter(view) {
  // 1. 标准 query2 路径 (表格等视图常用)
  const q2Filter = view.query2?.filter || view.query?.filter;
  if (q2Filter && q2Filter.filters && q2Filter.filters.length > 0) {
    return q2Filter;
  }

  // 2. 某些视图路径 (如 Gallery/Board/Calendar) 可能存放在 format.property_filters
  const propFilters = view.format?.property_filters;
  if (propFilters && Array.isArray(propFilters) && propFilters.length > 0) {
    return {
      filters: propFilters.map(pf => {
        const f = pf.filter;
        return {
          property: f.property,
          filter: f.filter || f
        };
      }),
      operator: 'and'
    };
  }

  return null;
}

function applyFilters(blockIds, filter, collection, recordMap) {
  if (!filter || !filter.filters || filter.filters.length === 0) return blockIds;
  return blockIds.filter(blockId => {
    const block = recordMap.block[blockId]?.value;
    if (!block) return false;
    return matchesFilter(block, filter, collection);
  });
}

function matchesFilter(block, filter, collection) {
  const { filters, operator = 'and' } = filter;
  if (operator === 'or') {
    return filters.some(f => matchesSingleFilter(block, f, collection));
  } else {
    return filters.every(f => matchesSingleFilter(block, f, collection));
  }
}

function matchesSingleFilter(block, f, collection) {
  const { property, filter: filterDef } = f;
  const data = block.properties?.[property];
  const schema = collection.schema[property];
  
  let value;
  if (schema?.type === 'date') {
    // 日期类型直接取 ISO 字符串
    value = data?.[0]?.[1]?.[0]?.[1]?.start_date || '';
  } else {
    value = getTextContent(data) || '';
  }

  const { operator, value: targetValue } = filterDef;
  const target = targetValue?.value ?? '';
  return executeMatch(operator, value, target, targetValue);
}

function executeMatch(operator, value, target, targetValue) {
  // 处理日期相对时间
  let finalTarget = target;
  if (targetValue?.type === 'relative') {
     finalTarget = calculateRelativeDate(targetValue.value);
  }

  switch (operator) {
    case 'enum_is':
    case 'string_is':
    case 'equals':
    case 'date_is':
      return value === finalTarget;
    case 'enum_is_not':
    case 'string_is_not':
    case 'does_not_equal':
    case 'date_is_not':
      return value !== finalTarget;
    case 'date_is_after':
      return value > finalTarget;
    case 'date_is_before':
      return value < finalTarget;
    case 'date_is_on_or_after':
      return value && finalTarget ? value >= finalTarget : true;
    case 'date_is_on_or_before':
      return value && finalTarget ? value <= finalTarget : true;
    case 'enum_contains':
    case 'string_contains':
      return value.includes(target);
    case 'enum_does_not_contain':
    case 'string_does_not_contain':
      return !value.includes(target);
    case 'string_starts_with':
      return value.startsWith(target);
    case 'string_ends_with':
      return value.endsWith(target);
    case 'is_empty':
      return !value;
    case 'is_not_empty':
      return !!value;
    default:
      return true;
  }
}

/**
 * 计算相对日期 (ISO 格式: YYYY-MM-DD)
 */
function calculateRelativeDate(relativeStr) {
  const now = new Date();
  switch (relativeStr) {
    case 'today':
      return now.toISOString().split('T')[0];
    case 'past_week':
    case 'one_week_ago':
      now.setDate(now.getDate() - 7);
      return now.toISOString().split('T')[0];
    case 'past_month':
    case 'one_month_ago':
      now.setMonth(now.getMonth() - 1);
      return now.toISOString().split('T')[0];
    case 'past_year':
    case 'one_year_ago':
      now.setFullYear(now.getFullYear() - 1);
      return now.toISOString().split('T')[0];
    default:
      return '';
  }
}
