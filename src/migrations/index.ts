import * as migration_20261006_111613_rebuild from './20261006_111613_rebuild';
import * as migration_20261006_130404_page_seo from './20261006_130404_page_seo';

export const migrations = [
  {
    up: migration_20261006_111613_rebuild.up,
    down: migration_20261006_111613_rebuild.down,
    name: '20261006_111613_rebuild',
  },
  {
    up: migration_20261006_130404_page_seo.up,
    down: migration_20261006_130404_page_seo.down,
    name: '20261006_130404_page_seo'
  },
];
