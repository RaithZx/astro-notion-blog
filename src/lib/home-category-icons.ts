/**
 * Maps Notion tag names → icon art for the home “Explora pa Kategorias” strip.
 * Heuristics are diacritic-stripped so Siênsia / Saúdi etc. match.
 */
export type CategoryExplorerIconKind =
  | 'science'
  | 'tech'
  | 'nature'
  | 'news'
  | 'health'
  | 'stories'
  | 'innovation'
  | 'space'
  | 'planet'
  | 'generic'

export function getCategoryExplorerIconKind(tagName: string): CategoryExplorerIconKind {
  const n = tagName
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')

  if (n.includes('siensia') || n.includes('siencia')) return 'science'
  if (n.includes('tekn')) return 'tech'
  if (n.includes('nature') || n.includes('natural') || n.includes('natur')) return 'nature'
  if (n.includes('notis') || n.includes('noticia')) return 'news'
  if (n.includes('saud') || n.includes('saude') || n.includes('health') || n.includes('medic'))
    return 'health'
  if (n.includes('stori') || n.includes('histor') || n.includes('cronica')) return 'stories'
  if (n.includes('inov')) return 'innovation'
  if (n.includes('espasu') || n.includes('space') || n.includes('astron')) return 'space'
  if (n.includes('bio') || n.includes('eku') || n.includes('sustent') || n.includes('ambient'))
    return 'planet'

  return 'generic'
}
