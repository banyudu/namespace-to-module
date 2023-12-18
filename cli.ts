#!/usr/bin/env node

// get filename from command line with yargs
import ns2Module from '.'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { falsy } from './utils'

const run = async (): Promise<void> => {
  const argv = await yargs(hideBin(process.argv)).parse()

  // read first argument as filename
  const filename: string = argv._[0] as string

  if (falsy(filename)) {
    throw new Error('filename is required')
  }

  await ns2Module(filename)
}

run().catch(console.error)
