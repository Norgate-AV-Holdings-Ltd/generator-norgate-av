# Changelog

## [2.0.0](https://github.com/Norgate-AV/generator-norgate-av/compare/v1.0.6...v2.0.0) (2024-02-07)

### ⚠ BREAKING CHANGES

-   convert to typescript (#118)

### 🌟 Features

-   convert to typescript ([#118](https://github.com/Norgate-AV/generator-norgate-av/issues/118)) ([d673cef](https://github.com/Norgate-AV/generator-norgate-av/commit/d673cef6ec39f8f520387afc76711c71f1f4de5a))

## [1.0.6](https://github.com/Norgate-AV/generator-norgate-av/compare/v1.0.5...v1.0.6) (2023-09-24)

## [1.0.5](https://github.com/Norgate-AV/generator-norgate-av/compare/v1.0.4...v1.0.5) (2023-09-24)

### Bug Fixes

-   insert dash for ejs template ([5110b4c](https://github.com/Norgate-AV/generator-norgate-av/commit/5110b4ccd175ed9c3bfd346f42597cbdcc5792eb))

## [1.0.4](https://github.com/Norgate-AV/generator-norgate-av/compare/v1.0.3...v1.0.4) (2023-09-24)

### Bug Fixes

-   **project-ts:** remove trailing quotes in ejs file ([9a278a5](https://github.com/Norgate-AV/generator-norgate-av/commit/9a278a5d38e8bfeb1766ccf04fcec363c9ad4ffe))

## [1.0.3](https://github.com/Norgate-AV/generator-norgate-av/compare/v1.0.2...v1.0.3) (2023-09-24)

## [1.0.2](https://github.com/Norgate-AV/generator-norgate-av/compare/v1.0.1...v1.0.2) (2023-09-24)

### Bug Fixes

-   **templates:** add missing .changelogrc.json file ([7c11bbe](https://github.com/Norgate-AV/generator-norgate-av/commit/7c11bbe8cfafe0230f9b1c01441c96427f0a977d)), closes [#95](https://github.com/Norgate-AV/generator-norgate-av/issues/95) [#96](https://github.com/Norgate-AV/generator-norgate-av/issues/96) [#97](https://github.com/Norgate-AV/generator-norgate-av/issues/97) [#98](https://github.com/Norgate-AV/generator-norgate-av/issues/98)
-   **c-template:** copy Makefile into project ([b2ea949](https://github.com/Norgate-AV/generator-norgate-av/commit/b2ea949102dec9443c70d460d40615746aafebee)), closes [#100](https://github.com/Norgate-AV/generator-norgate-av/issues/100)
-   **python-template:** remove nodejs related files ([0d055dd](https://github.com/Norgate-AV/generator-norgate-av/commit/0d055ddbaf965d6d867590b637f1bb32351f2f3f)), closes [#99](https://github.com/Norgate-AV/generator-norgate-av/issues/99)

## [1.0.1](https://github.com/Norgate-AV/generator-norgate-av/compare/v1.0.0...v1.0.1) (2023-09-19)

### Bug Fixes

-   fix typo in project dir name ([368cc68](https://github.com/Norgate-AV/generator-norgate-av/commit/368cc685fbde0e7acaf767b374423b6125218cfe))

## 1.0.0 (2023-09-19)

### Features

-   **docker:** add bash script to wrap running the generator within docker ([cfdb21f](https://github.com/Norgate-AV/generator-norgate-av/commit/cfdb21fd2ecebbee9deff7fed866b1cd07ad576f))
-   **generator:** add clang generator ([22ec631](https://github.com/Norgate-AV/generator-norgate-av/commit/22ec63164de3f7ec0210f2ccbc53eed0a7bbbf13))
-   **generator:** add cli project generator ([cba1cd0](https://github.com/Norgate-AV/generator-norgate-av/commit/cba1cd00f73fd80c87c155cc06dde7c11bdb2506))
-   **generator:** add console output for git init ([232f0d7](https://github.com/Norgate-AV/generator-norgate-av/commit/232f0d71ceae95fc263106f67a848d5d09eb6673))
-   **generator:** add dependency getter function ([3fcd411](https://github.com/Norgate-AV/generator-norgate-av/commit/3fcd41194af0b5dc1738ec8d876952141003d7b8))
-   **docker:** add Dockerfile ([d3bda50](https://github.com/Norgate-AV/generator-norgate-av/commit/d3bda50f9e92eecc170214033f8515617daba085))
-   **env:** add git and code path helper functions ([c8d9f8a](https://github.com/Norgate-AV/generator-norgate-av/commit/c8d9f8a5e5869c82a5a4be4973c875c8e2470dae))
-   **generator:** add global dependency store ([06dd0e6](https://github.com/Norgate-AV/generator-norgate-av/commit/06dd0e68ffe79ed1d47ab842cfdd7133fd9c8ef2))
-   **generator:** add initial implementation of generator ([96adc6d](https://github.com/Norgate-AV/generator-norgate-av/commit/96adc6da837ea12ca6cb9f1fe843610a3bf8ab5c))
-   **generator:** add list of global deps to project config ([b78991d](https://github.com/Norgate-AV/generator-norgate-av/commit/b78991d98760367fe1ab79535a4371394d33780a))
-   add pnpm as package manager option ([044dcf9](https://github.com/Norgate-AV/generator-norgate-av/commit/044dcf93ce1d56fd91971f14f022e1756eb52aa3))
-   **generator:** add project-js template ([e3734f2](https://github.com/Norgate-AV/generator-norgate-av/commit/e3734f2ee1e836e82b9194d81d622cea500d390f))
-   **generator:** add python generator ([d5caa2d](https://github.com/Norgate-AV/generator-norgate-av/commit/d5caa2d818d02473c231c5f8f94a1969d8447cfd))
-   add template for Crestron SIMPL ([0b6eb06](https://github.com/Norgate-AV/generator-norgate-av/commit/0b6eb066a81b88f88dfffa8b0d2b2b58e2dc60f6))
-   add typesctipt project generator ([a64b4c6](https://github.com/Norgate-AV/generator-norgate-av/commit/a64b4c69425e7eb12dfdf223e2bc87323791ab4e))
-   **generator:** add vanilla html, css & js generator ([b9e512b](https://github.com/Norgate-AV/generator-norgate-av/commit/b9e512b9b5ed80497a07ff0b3a6f40f726c76fde))
-   **project-html:** add yeoman svg ([7d05f07](https://github.com/Norgate-AV/generator-norgate-av/commit/7d05f078590c2b163ab6ae466f293c44031049e8))
-   get node version from dependencies ([4716d1a](https://github.com/Norgate-AV/generator-norgate-av/commit/4716d1a0a922907023688475e79f2656265c7f78))
-   update dependecies ([c48e005](https://github.com/Norgate-AV/generator-norgate-av/commit/c48e005f25332e3311ded4d3a78264cde8918aa1))

### Bug Fixes

-   **project-js:** add missing colon ([0c303be](https://github.com/Norgate-AV/generator-norgate-av/commit/0c303becba7c411191516a04bb82dac12ebf9be5))
-   **generate-javascript:** apply projectConfig to jsconfig template ([8543056](https://github.com/Norgate-AV/generator-norgate-av/commit/8543056c3d7f9a4a724771703e517b1f58f22736))
-   **project-ts:** fix file ext on main entry point ([6798acb](https://github.com/Norgate-AV/generator-norgate-av/commit/6798acb9cabe54827a7acfaf0ac69ea336c49a77))
-   **generator:** fix typo in dependencies directory name ([6be07f3](https://github.com/Norgate-AV/generator-norgate-av/commit/6be07f33de1af390809f51f6fc2c043c59cb8324))
-   remove dangling comma ([ff0ccee](https://github.com/Norgate-AV/generator-norgate-av/commit/ff0cceeb97ebcf7c5332c0c0c17adac16ea6098c))
-   **generator:** use options property on generator for skip prompts ([9fc9a40](https://github.com/Norgate-AV/generator-norgate-av/commit/9fc9a4002a553eb02d907b43a1949a62b85831e5))
