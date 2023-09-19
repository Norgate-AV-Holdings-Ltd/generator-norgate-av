# Yo Norgate-AV - Project Generator

<div align="center">
    <img align="center" src="./assets/yeoman-009.png" alt="yeoman-009" width="110"/>
    <!-- <span>-----</span> -->
    <img align="center" src="./assets/yeoman.png" alt="yeoman"/>
    <!-- <span>-----</span> -->
    <img align="center" src="./assets/yeoman-004.png" alt="yeoman-004" width="128"/>
</div>

---

[![CI](https://github.com/Norgate-AV/generator-norgate-av/actions/workflows/main.yml/badge.svg)](https://github.com/Norgate-AV/generator-norgate-av/actions)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white)](https://conventionalcommits.org)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![GitHub contributors](https://img.shields.io/github/contributors/Norgate-AV/generator-norgate-av)](#contributors)
[![NPM](https://img.shields.io/npm/v/generator-norgate-av.svg)](https://www.npmjs.com/package/generator-norgate-av)
[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

A Yeoman generator to bootstrap various projects 🚀🚀🚀

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

## Contents 📖

-   [Installation :zap:](#installation-zap)
-   [Usage :rocket:](#usage-rocket)
-   [Command Line :man_technologist:](#command-line-man_technologist)
-   [Team :soccer:](#team-soccer)
-   [Contributors :sparkles:](#contributors-sparkles)
-   [LICENSE :balance_scale:](#license-balance_scale)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation :zap:

Install Yeoman and the Norgate AV generator:

```bash
npm install -g yo generator-norgate-av

# or

yarn global add yo generator-norgate-av
```

## Usage :rocket:

The Yeoman generator will walk you through the steps required to create your project prompting for the required information.

To launch the generator simply type:

```bash
yo norgate-av
```

<div align="center">
    <img src="./assets/yo-norgate-av.png" alt="the-command-generator" width="750"/>
</div>

<!-- ## Output :package:

The generator will

-   Create a base folder structure
-   Template out a `package.json` -->

## Command Line :man_technologist:

```bash
Usage:
  yo norgate-av [<destination>] [options]

Argument (optional):
  The destination to create the project in, absolute or relative to the current working
  directory. Use '.' for the current folder.
  If not provided, defaults to a folder in the current working directory with the project
  display name.

Options:
  -h,   --help                          # Print the generator's options and usage
  -y,   --yes                           # Quick mode, skip all optional prompts and use defaults
  -o,   --open                          # Open the generated project in Visual Studio Code
  -t,   --projectType                   # ts, js...
        --projectId                     # Id of the project
        --projectDescription            # Description of the project
  -p,   --pkg                           # "yarn" or "npm"
  -g,   --git                           # Initialize a git repo

Example usages:
  yo norgate-av                         # Create an project in a folder with the projects's name.
  yo norgate-av . -o                    # Create an project in current folder and open with Visual Studio Code.
  yo norgate-av cowbell -t ts -y        # Create an TypeScript project in './cowbell', skip prompts, use defaults.
  yo norgate-av dopephish -t js -g      # Create an JavaScript project in './dopephish', initialize a git repository.
```

<!-- ## Run with Docker :whale:

If you don't want to install nodejs or any node packages, use this method to run the generator from within a Docker container.

```bash
docker run -it -rm -v $(pwd):/usr/src/app generator-norgate-av:latest
```

> or

You can download this bash script from [here](./bin/yo-norgate-av) which wraps the above command into a simple command.

```bash
yo-norgate-av
``` -->

## Team :soccer:

This project is maintained by the following person(s) and a bunch of [awesome contributors](https://github.com/Norgate-AV/generator-norgate-av/graphs/contributors).

<table>
  <tr>
    <td align="center"><a href="https://github.com/damienbutt"><img src="https://avatars.githubusercontent.com/damienbutt?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Damien Butt</b></sub></a><br /></td>
  </tr>
</table>

## Contributors :sparkles:

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

Thanks go to these awesome people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://allcontributors.org) specification.
Contributions of any kind are welcome!

Check out the [contributing guide](CONTRIBUTING.md) for more information.

## LICENSE :balance_scale:

[MIT](LICENSE)
