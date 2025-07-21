import suburbs from '../src/data/suburbs.json' assert { type: 'json' };

function validateSuburb(entry, index, names, slugs) {
  if (typeof entry.name !== 'string' || !entry.name.trim()) {
    return `Entry ${index} missing valid name`;
  }
  if (typeof entry.slug !== 'string' || !entry.slug.trim()) {
    return `Entry ${index} missing valid slug`;
  }
  if (!/^\d{4}$/.test(entry.postcode)) {
    return `Entry ${index} has invalid postcode`;
  }
  if (!Array.isArray(entry.landmarks) || !entry.landmarks.every(l => typeof l === 'string')) {
    return `Entry ${index} has invalid landmarks`;
  }
  if (!entry.coords || typeof entry.coords.lat !== 'number' || typeof entry.coords.lng !== 'number') {
    return `Entry ${index} has invalid coords`;
  }
  if (names.has(entry.name)) {
    return `Duplicate name: ${entry.name}`;
  }
  if (slugs.has(entry.slug)) {
    return `Duplicate slug: ${entry.slug}`;
  }
  names.add(entry.name);
  slugs.add(entry.slug);
  return null;
}

const names = new Set();
const slugs = new Set();
const errors = suburbs
  .map((s, i) => validateSuburb(s, i, names, slugs))
  .filter(Boolean);

if (errors.length) {
  console.error('Data validation failed:\n' + errors.join('\n'));
  process.exit(1);
} else {
  console.log('Data validation passed');
}
