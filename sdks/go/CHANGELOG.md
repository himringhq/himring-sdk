## 0.1.0 (2026-11-24)

### Features

- **sdk-go:** add the Go SDK generated from the spec, with CI and a module tag release ([a480683](https://github.com/himringhq/himring-sdk/commit/a480683319865256fb8795b6b27d5d2f46d2ae4b))

### Fixes

- **sdk-go:** read orphaned spool files outside the recorder lock ([2ee1aed](https://github.com/himringhq/himring-sdk/commit/2ee1aed3a872448b1819aa0317835816f7a52836))
- **sdk-go:** preserve oversized retry-after delays ([72b72be](https://github.com/himringhq/himring-sdk/commit/72b72be96253e24add023f34164fba788064068e))
- **sdk-go:** derive upload bounds from the pinned spec ([f52efde](https://github.com/himringhq/himring-sdk/commit/f52efdebbd79a5fca2fc2838b6e7c6ccf7f64134))
- **sdk-go:** renew spool claims and release failed recoveries ([86ec049](https://github.com/himringhq/himring-sdk/commit/86ec049a5a489f39c0fca59324f1c696ee38bb90))
- **sdk-go:** bound empty upload probes by the idle timeout ([9b29ae6](https://github.com/himringhq/himring-sdk/commit/9b29ae6cfe5aececb09f40b1e1f4477b012686b1))
- **sdk-go:** retain ownership while recovering spool files ([70a44ea](https://github.com/himringhq/himring-sdk/commit/70a44eab1064d0b81e9e99634ff3df13b416f093))
- **sdk-go:** synchronize recorder persistence and shutdown ([3435248](https://github.com/himringhq/himring-sdk/commit/3435248fade8d32c92c5b08eb6e6771c72b39346))
- **sdk-go:** reject trailing delimiters in JSON envelopes ([75b26f3](https://github.com/himringhq/himring-sdk/commit/75b26f36f2388d4bee467a261c48188a8a860367))
