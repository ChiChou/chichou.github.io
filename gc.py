#!/usr/bin/env python3

import os
from pathlib import Path

sources = []

for md in Path('_posts').iterdir():
  with md.open('r', encoding='utf8') as fp:
    sources.append(fp.read())

joint = '\n'.join(sources)
prefix = 'img%s' % os.path.sep
for item in Path('img').iterdir():
  keyword = str(item).replace(prefix, '/img/')

  if keyword not in joint:
    print('dangling image: %s' % item)
    item.unlink()