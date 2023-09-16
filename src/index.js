const fs = require('fs')
const path = require('path')

const convertPigLatin = require('./pig-latin')
const {convertIlStrings} = require('./starfield')

const filesDirPath = path.join(__dirname, '..', 'files')
const inputDirPath = path.join(filesDirPath, 'input')
const outputDirPath = path.join(filesDirPath, 'output')

const targetFileName = 'starfield_en.ilstrings'

const inputFilePath = path.join(inputDirPath, targetFileName)
const outputFilePath = path.join(outputDirPath, targetFileName)

console.log('Processing strings... please wait...')

const allFilter = (uint8Array) => true
convertIlStrings(inputFilePath, outputFilePath, allFilter, convertPigLatin)