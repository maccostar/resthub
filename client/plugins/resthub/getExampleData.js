const getExampleData = (schemaObj) => {
  const arr = judgeFuncAndObject(schemaObj).map((e) => {
    return !e.hasNest ? e : getExampleData(e)
  })
  return arr
}

// eslint-disable-next-line no-empty-pattern
export default ({}, inject) => {
  inject('getExampleData', getExampleData)
}

const dummyArr = [{ name: 'err', type: 'err', hasNest: false }]

const judgeFuncAndObject = (obj) => {
  if ('properties' in obj) {
    return 'allOf' in obj.properties || 'oneOf' in obj.properties
      ? judgeFuncAndObject(obj)
      : getProperties(obj)
  }
  if ('items' in obj) {
    return 'allOf' in obj.items || 'oneOf' in obj.items
      ? judgeFuncAndObject(obj.items)
      : getProperties(obj.items)
  }
  if ('allOf' in obj) {
    return mergeAllOf(obj.allOf)
  }
  if ('oneOf' in obj) {
    return mergeOneOf(obj.oneOf)
  }
  return dummyArr
}

const getProperties = (obj) => {
  const setProperties = (obj) => {
    const required = 'required' in obj ? obj.required : []
    return Object.entries(obj.properties).map((e) => {
      // example(s)・enum等はまだ実装していない
      return {
        name: e[0],
        required: required.includes(e[0]),
        type: 'type' in e[1] ? e[1].type : 'undefined',
        hasNest: 'items' in e[1] || 'properties' in e[1],
        schemaObj: e[1]
      }
    })
  }
  return 'properties' in obj ? setProperties(obj) : obj
}

const mergeAllOf = (arr) => {
  return arr.flatMap((obj) => {
    return getProperties(obj)
  })
}

const mergeOneOf = (arr) => {
  return arr.map((obj) => {
    return {
      name: 'oneOf',
      required: false,
      type: 'oneOf',
      hasNest: true,
      schemaObj: obj
    }
  })
}
