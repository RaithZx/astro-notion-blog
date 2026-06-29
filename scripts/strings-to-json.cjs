'use strict'

const fs = require('fs')
const path = require('path')

const MD_PATH = path.join(__dirname, '../src/locales/ui-strings.md')
const JSON_PATH = path.join(__dirname, '../src/locales/ui-strings.json')

function setDeep(obj, keys, value) {
  let cur = obj
  for (let i = 0; i < keys.length - 1; i++) {
    if (!cur[keys[i]] || typeof cur[keys[i]] !== 'object') cur[keys[i]] = {}
    cur = cur[keys[i]]
  }
  cur[keys[keys.length - 1]] = value
}

function parseMd(md) {
  const result = {}
  let section = null   // ## level key
  let subPath = []     // ### level path segments

  for (const rawLine of md.split('\n')) {
    const line = rawLine.trimEnd()

    // Skip comments and blank lines
    if (line.startsWith('<!--') || line.trim() === '' || line.startsWith('#!')) continue

    const h1 = line.match(/^# /)
    if (h1) continue  // title line, skip

    const h2 = line.match(/^## (.+)/)
    if (h2) {
      section = h2[1].trim()
      subPath = []
      if (!result[section]) result[section] = {}
      continue
    }

    const h3 = line.match(/^### (.+)/)
    if (h3) {
      subPath = h3[1].trim().split('.')
      continue
    }

    // List item: "- key: value"
    if (line.startsWith('- ') && section) {
      const rest = line.slice(2)
      const colonIdx = rest.indexOf(': ')
      if (colonIdx === -1) continue
      const key = rest.slice(0, colonIdx).trim()
      const value = rest.slice(colonIdx + 2)  // preserve trailing spaces intentionally trimmed by trimEnd above
      const fullPath = [...subPath, key]
      setDeep(result[section], fullPath, value)
    }
  }

  return result
}

function main() {
  if (!fs.existsSync(MD_PATH)) {
    console.error('ERROR: ui-strings.md not found at', MD_PATH)
    process.exit(1)
  }

  const md = fs.readFileSync(MD_PATH, 'utf8')
  const parsed = parseMd(md)

  const readme =
    'Ligadu UI copy — generated from ui-strings.md. DO NOT edit manually — run `npm run strings` instead. Translators: edit ui-strings.md.'

  const output = {
    _translatorReadme: readme,
    ...parsed,
  }

  fs.writeFileSync(JSON_PATH, JSON.stringify(output, null, 2) + '\n', 'utf8')
  console.log('✓ ui-strings.json regenerated from ui-strings.md')

  // Sanity check: count keys
  const clerkKeys = Object.keys(parsed.clerk || {}).length
  const appKeys = Object.keys(parsed.app || {}).length
  console.log(`  clerk root keys: ${clerkKeys}`)
  console.log(`  app sections: ${appKeys}`)
}

main()
