import * as _ from 'lodash';
import * as path from 'path';
import { globalState } from './global-state';

export const srcPath = {
  dir: 'src'
};

export const tempPath = {
  dir: '.temp'
};

export const tempTypesPath = {
  dir: path.join(tempPath.dir, 'types')
};

export const testsPath = {
  dir: 'tests'
};

export const pagesPath = { dir: path.join(srcPath.dir, `pages`) };

export const docsPath = { dir: `docs` };

export const notFoundPath = {
  dir: pagesPath.dir,
  name: '404',
  ext: '.tsx'
};

export const tempJsEntryPath = {
  dir: tempPath.dir,
  name: 'entry',
  ext: '.tsx'
};

export const tempEnvironmentPath = {
  dir: tempPath.dir,
  name: 'environment',
  ext: '.ts'
};

export const tempJsAppPath = { dir: tempPath.dir, name: 'app', ext: '.tsx' };

export const utilPath = {
  dir: path.join(srcPath.dir, 'utils')
};

export const requestsPath = {
  dir: path.join(srcPath.dir, 'requests')
};

export const componentPath = {
  dir: path.join(srcPath.dir, 'components')
};

export const helperPath = {
  dir: utilPath.dir,
  name: 'helper',
  ext: '.tsx'
};

export const declarePath = {
  dir: path.join(tempPath.dir, 'declare')
};

export const layoutPath = {
  dir: path.join(srcPath.dir, `layouts`),
  name: 'index',
  ext: '.tsx'
};

export const markdownLayoutPath = {
  dir: layoutPath.dir,
  name: 'markdown',
  ext: '.tsx'
};

export const storesPath = {
  dir: path.join(srcPath.dir, `stores`)
};

export const markdownTempPath = {
  dir: path.join(tempPath.dir, 'markdowns')
};

export const componentEntry = {
  dir: path.join(srcPath.dir),
  name: 'index',
  ext: '.tsx'
};

let gitIgnores: string[] = [
  'node_modules',
  '.cache',
  '.vscode',
  tempPath.dir,
  globalState.projectConfig.distDir,
  '.DS_Store',
  'coverage',
  '.nyc_output',
  'npm-debug.log'
];
// Add distDir to gitIgnore
// EG: /dist -> '/dist'
// EG: /a/b/c -> ['/a', '/a/b', '/a/b/c']
const trimedDistDir = _.trimEnd(globalState.projectConfig.distDir, '/');
const distPaths = trimedDistDir.split('/');
distPaths.reduce((prev, current) => {
  if (prev === '') {
    gitIgnores.push(current);
    return current;
  } else {
    prev += '/' + current;
    gitIgnores.push(prev);
    return prev;
  }
}, '');
gitIgnores = _.union(gitIgnores);
export { gitIgnores };

let npmIgnores = gitIgnores.slice();
// Npm ignore test path
npmIgnores.push(testsPath.dir);
// Npm do not ignore built path!
const builtPathIndex = npmIgnores.findIndex(name => name === globalState.projectConfig.distDir);
npmIgnores.splice(builtPathIndex, 1);
npmIgnores = _.union(npmIgnores);
export { npmIgnores };

export const ignoreScanFiles = [
  '.gitignore',
  '.gitmodules',
  '.npmignore',
  '.prettierrc',
  '.git',
  '.DS_Store',
  'package-lock.json',
  'package.json',
  'tsconfig.json',
  'tslint.json',
  'npm-debug.log',
  '.idea'
];
