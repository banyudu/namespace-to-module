// convert namespace to module

// get filename from command line with yargs

import path from 'path'
import { Project } from 'ts-morph'

const ns2Module = async (filename: string, outDir?: string) => {
  if (!filename) {
    throw new Error('filename is required')
  }
  const finalOutDir = outDir || path.join(process.cwd(), 'output')

  // create project
  const project = new Project()

  // add source file
  const sourceFile = project.addSourceFileAtPath(filename)

  // get all namespaces
  const namespaces = sourceFile.getModules()
  for (const ns of namespaces) {
    // get namespace name
    const nsName = ns.getName()
    if (!nsName) {
      throw new Error('namespace name is required')
    }

    // const varStatements = ns.getVariableStatements()
    // for (const varStatement of varStatements) {
    //   console.log('var statement: ', varStatement.getText())
    //   console.log('var statement kind: ', varStatement.getKindName())
    // }

    // const funcStatements = ns.getFunctions()

    // get namespace statements
    // const statements = ns.getStatementsWithComments()
    // console.log('ns is: ', ns.getBodyText())

    // create new file
    // const newFile = project.createSourceFile(
    //   path.join(path.dirname(filename), 'modules', `${nsName.replace('chrome.', '')}.ts`),
    //   statements.map((s) => s.getText()).join('\n')
    // )

    const nsPaths = nsName.split('.')
    nsPaths[nsPaths.length - 1] = `${nsPaths[nsPaths.length - 1]}.ts`
    const outputFileName = path.join(finalOutDir, ...nsPaths)

    const newFile = project.createSourceFile(
      outputFileName,
      ns.getBodyText()
    )

    // save new file
    newFile.saveSync()
  }
}

export default ns2Module