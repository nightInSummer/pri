import * as fs from "fs-extra"
import * as _ from "lodash"
import * as path from "path"
import * as prettier from "prettier"
import { IConfig } from "./project-config-interface"

export const ensureFiles = (projectRootPath: string, config: IConfig) => {
  ensureGitignore(projectRootPath, config)
  ensureTsconfig(projectRootPath)
  ensureBabelrc(projectRootPath)
  ensureTslint(projectRootPath)
  ensurePackageJson(projectRootPath)
  ensureVscode(projectRootPath)
  ensureHomePage(projectRootPath)
}

function ensureGitignore(projectRootPath: string, config: IConfig) {
  const filePath = path.join(projectRootPath, ".gitignore")
  const ensureContents = [
    "node_modules",
    config.distDir || "dist",
    ".cache",
    ".vscode",
    ".temp"
  ]

  const exitFileContent = fs.existsSync(filePath) ? (fs.readFileSync(filePath).toString() || "") : ""
  const exitFileContentArray = exitFileContent.split("\n").filter(content => content !== "")

  ensureContents.forEach(content => {
    if (exitFileContentArray.indexOf(content) === -1) {
      exitFileContentArray.push(content)
    }
  })

  fs.writeFileSync(filePath, exitFileContentArray.join("\n"))
}

function ensureTsconfig(projectRootPath: string) {
  const filePath = path.join(projectRootPath, "tsconfig.json")
  const ensureContent = {
    compilerOptions: {
      module: "esnext",
      moduleResolution: "node",
      strict: true,
      jsx: "react",
      target: "es6",
      experimentalDecorators: false,
      skipLibCheck: true,
      lib: [
        "dom",
        "es5",
        "es6",
        "scripthost"
      ]
    },
    exclude: [
      "node_modules",
      "built",
      "lib"
    ]
  }

  let exitFileContent: any = {}

  try {
    exitFileContent = JSON.parse(fs.readFileSync(filePath).toString())
    // TODO: Overwrite
    exitFileContent = { ...ensureContent }
  } catch (error) {
    exitFileContent = { ...ensureContent }
  }

  fs.writeFileSync(filePath, JSON.stringify(exitFileContent, null, 2))
}

function ensureBabelrc(projectRootPath: string) {
  const filePath = path.join(projectRootPath, ".babelrc")
  const ensureContents = {
    presets: ["env"]
  }

  fs.writeFileSync(filePath, JSON.stringify(ensureContents, null, 2))
}

function ensureTslint(projectRootPath: string) {
  const filePath = path.join(projectRootPath, "tslint.json")
  const ensureContents = {
    extends: "tslint:latest",
    defaultSeverity: "error",
    rules: {
      "semicolon": [
        false
      ],
      "object-literal-sort-keys": false,
      "max-classes-per-file": [
        true,
        5
      ],
      "trailing-comma": [
        false
      ],
      "no-string-literal": false,
      "max-line-length": [
        true,
        200
      ],
      "arrow-parens": false,
      "no-implicit-dependencies": [
        true,
        "dev"
      ],
      "no-object-literal-type-assertion": false
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(ensureContents, null, 2))
}

function ensurePackageJson(projectRootPath: string) {
  const filePath = path.join(projectRootPath, "package.json")
  const ensureScripts = {
    start: "pri",
    build: "pri build",
    preview: "pri preview"
  }

  let exitFileContent: any = {}

  try {
    exitFileContent = JSON.parse(fs.readFileSync(filePath).toString()) || {}
    if (!exitFileContent.scripts) {
      exitFileContent.scripts = {}
    }
  } catch (error) {
    //
  }

  _.merge(exitFileContent.scripts || {}, ensureScripts)

  fs.writeFileSync(filePath, JSON.stringify(exitFileContent, null, 2))
}

function ensureVscode(projectRootPath: string) {
  const filePath = path.join(projectRootPath, ".vscode/settings.json")
  const ensureContent = {
    "editor.formatOnPaste": true,
    "editor.formatOnType": true,
    "editor.formatOnSave": true,
    "files.autoSave": "onFocusChange",
    "typescript.tsdk": "node_modules/typescript/lib",
    "editor.tabSize": 2,
    "beautify.tabSize": 2,
    "tslint.autoFixOnSave": true,
    "tslint.ignoreDefinitionFiles": false,
    "tslint.exclude": "**/node_modules/**/*"
  }

  fs.outputFileSync(filePath, JSON.stringify(ensureContent, null, 2))
}

function ensureHomePage(projectRootPath: string) {
  const filePath = path.join(projectRootPath, "src/pages/index.tsx")

  if (fs.existsSync(filePath)) {
    return
  }

  const ensureContent = `
    import * as React from "react"
    import { env } from "pri"

    export default () => (
      <div>
        <h1>
          Welcome to pri!
        </h1>
        <h2>
          Current env: {env.isLocal && "local"}{env.isProd && "prod"}
        </h2>
        <h2>
          <a target="_blank" href="https://github.com/ascoders/pri">Read Docs.</a>
        </h2>
      </div>
    )
  `

  fs.outputFileSync(filePath, prettier.format(ensureContent, {
    semi: false,
    parser: "typescript"
  }))
}
