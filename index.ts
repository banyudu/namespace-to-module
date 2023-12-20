// convert namespace to module

// get filename from command line with yargs

import path from 'path'
import { ModuleDeclaration, Project, SyntaxKind } from 'ts-morph'
import { falsy } from './utils'

interface IndexFileMap {
  [key: string]: null | IndexFileMap
}

const ns2Module = async (filename: string, outDir?: string): Promise<void> => {
  if (falsy(filename)) {
    throw new Error('filename is required')
  }
  const finalOutDir = outDir ?? path.join(process.cwd(), 'output')

  // create project
  const project = new Project()

  // add source file
  const sourceFile = project.addSourceFileAtPath(filename)

  // get all namespaces
  const namespaces = sourceFile.getModules()
  const indexFileMap: IndexFileMap = {}

  const parseNamespace = (ns: ModuleDeclaration, prefixes: string[] = [], rename?: string): void => {
    const subModules = ns.getModules()

    // get export as aliases
    const exportDeclarations = ns.getDescendantsOfKind(SyntaxKind.ExportDeclaration)
    // resolve namespace _debugger to debugger by `export { _debugger as debugger }`
    const exportAsAliaseMap: Record<string, string> = exportDeclarations.reduce<Record<string, string>>((acc, exportDeclaration) => {
      const namedExports = exportDeclaration.getNamedExports()
      for (const namedExport of namedExports) {
        const name = namedExport.getName()
        const alias = namedExport.getAliasNode()?.getText()
        if (alias != null) {
          // acc[alias] = name
          acc[name] = alias
        }
      }
      return acc
    }, {})

    if (subModules.length > 0) {
      for (const subModule of subModules) {
        parseNamespace(subModule, [...prefixes, ns.getName()], exportAsAliaseMap[subModule.getName()])
      }
    }

    // get namespace name
    const nsName = rename ?? ns.getName()
    if (falsy(nsName)) {
      throw new Error('namespace name is required')
    }

    // const funcStatements = ns.getFunctions()
    const interfaceContents: string[] = []
    const funcAndVarStatements: string[] = []

    const leadingCommentLines = ns.getLeadingCommentRanges()?.map(range => range.getText())
    const trailingCommentLines = ns.getTrailingCommentRanges()?.map(range => range.getText())

    // get namespace statements
    const statements = ns.getStatementsWithComments()
    for (const stmt of statements) {
      if (
        stmt.isKind(SyntaxKind.InterfaceDeclaration) ||
        stmt.isKind(SyntaxKind.TypeAliasDeclaration) ||
        stmt.isKind(SyntaxKind.EnumDeclaration)
      ) {
        interfaceContents.push(stmt.getFullText())
      } else if (stmt.isKind(SyntaxKind.VariableStatement)) {
        // remove leading export var/let/const
        const funcText = stmt.getFullText()
        funcAndVarStatements.push(funcText.replace(/export (var|let|const)/, ''))
      } else if (stmt.isKind(SyntaxKind.FunctionDeclaration)) {
        // remove leading export function
        const funcText = stmt.getFullText()
        funcAndVarStatements.push(funcText.replace('export function', ''))
      } else if (stmt.isKind(SyntaxKind.ClassDeclaration)) {
        // remove leading export class
        const classText = stmt.getFullText()
        // FIXME: process the constructor
        funcAndVarStatements.push(classText.replace(/export class ([a-zA-Z0-9]+)/, '$1:'))
      } else if (stmt.isKind(SyntaxKind.ModuleDeclaration)) {
        // sub namespace do nothing
      } else {
        funcAndVarStatements.push(stmt.getFullText())
      }
    }

    const nsPaths = [
      ...prefixes,
      ...nsName.split('.')
    ]

    // create index files for each level
    let indexFileMapLevel = indexFileMap
    for (const nsPath of nsPaths) {
      if (indexFileMapLevel[nsPath] == null) {
        indexFileMapLevel[nsPath] = {}
      }
      indexFileMapLevel = indexFileMapLevel[nsPath] as IndexFileMap
    }

    nsPaths[nsPaths.length - 1] = `${nsPaths[nsPaths.length - 1]}.ts`
    const outputFileName = path.join(finalOutDir, ...nsPaths)

    const newFileContentLines: string[] = [
      ...leadingCommentLines,
      ...interfaceContents,
      'export default interface _ {',
      ...funcAndVarStatements,
      '}',
      ...trailingCommentLines
    ]

    if (nsPaths.length > 1) {
      const level = nsPaths.length - 2
      const importPath = level === 0 ? './' : '../'.repeat(level)
      newFileContentLines.unshift(`import * as ${nsPaths[0]} from '${importPath}'`)
    }

    const newFileContent = newFileContentLines.join('\n')

    const newFile = project.createSourceFile(
      outputFileName,
      newFileContent
      // ns.getBodyText()
    )

    // save new file
    newFile.saveSync()
  }

  for (const ns of namespaces) {
    parseNamespace(ns)
  }

  // write index files
  const writeIndexFile = (indexFileMapLevel: IndexFileMap, subPaths: string[]): void => {
    const keys = Object.keys(indexFileMapLevel)
    if (keys.length === 0) {
      return
    }
    const indexFile = project.createSourceFile(
      path.join(finalOutDir, ...subPaths, 'index.ts'),
      keys.map(key => `export * as ${key} from './${key}'`).join('\n')
    )
    indexFile.saveSync()
    keys.forEach(key => {
      writeIndexFile(indexFileMapLevel[key] as IndexFileMap, [...subPaths, key])
    })
  }
  writeIndexFile(indexFileMap, [])
}

export default ns2Module
