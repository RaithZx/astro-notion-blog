/**
 * Recursive merge for plain objects. Arrays and non-objects are replaced by source.
 * Used to overlay translator JSON onto Clerk pt-PT base.
 */
export function deepMerge(target, source) {
  if (source === null || source === undefined) {
    return target
  }
  if (typeof source !== 'object' || Array.isArray(source)) {
    return source
  }
  const out = { ...target }
  for (const key of Object.keys(source)) {
    const sv = source[key]
    const tv = target[key]
    if (
      sv !== null &&
      typeof sv === 'object' &&
      !Array.isArray(sv) &&
      tv !== null &&
      typeof tv === 'object' &&
      !Array.isArray(tv)
    ) {
      out[key] = deepMerge(tv, sv)
    } else {
      out[key] = sv
    }
  }
  return out
}
