const fs = require('fs')
const {BufferOperations} = require('lib-bethesda-strings/src/buffer')

/** @typedef {{ id: number, address: number, relativeOffset: number, absoluteOffset: number, nullPoint: number, length: number, stringArray: Uint8Array }} StringDataObject */
/** @typedef {(stringArray: Uint8Array, stringDataObject:StringDataObject) => boolean} Filter */
/** @typedef {(str:string) => string} StringModification */

/**
 * @enum {string}
 */
const STRINGS_TYPE = {
    // DL_STRINGS: 'dlstrings',
    IL_STRINGS: 'ilstrings',
    STRINGS: 'strings'
}

const TEXT_ENCODER = new TextEncoder()
const TEXT_DECODER = new TextDecoder()

/**
 * @param {Uint8Array} stringArray
 * @return {string}
 */
function uint8ArrayToString(stringArray) {
    return TEXT_DECODER.decode(stringArray.slice(0, stringArray.length - 1))
}

/**
 * @param {string} str
 * @return {Uint8Array}
 */
function stringToUint8Array(str) {
    return TEXT_ENCODER.encode(str + '\0')
}

/**
 * @param {Buffer} data
 * @param {Filter} filter
 * @param {StringModification} modification
 * @param {STRINGS_TYPE | string} type
 */
function modifyBufferStructure(data, filter, modification, type) {
    const modifiedInstance = new BufferOperations(Uint8Array.from(data), type)

    /**
     * @param {StringDataObject} stringDataObject
     */
    function conditionFx(stringDataObject) {
        return filter(stringDataObject.stringArray, stringDataObject)
    }

    /**
     * @type {{[idAddress:string]: {original:string, modified:string}}}
     */
    const modifications = {}

    /**
     * @param {Uint8Array} stringArray
     * @param {StringDataObject} stringDataObject
     */
    function modificationFx(stringArray, stringDataObject) {
        const str = uint8ArrayToString(stringArray)
        const modifiedStr = modification(str)

        const strIdAddress = `${stringDataObject.id}:${stringDataObject.address}`
        modifications[strIdAddress] = {
            original: str,
            modified: modifiedStr
        }

        return stringToUint8Array(modifiedStr)
    }

    const modificationResults = modifiedInstance.modifyEntries(conditionFx, modificationFx)
    return {
        log: modifications,
        modifications: modificationResults
    }
}

/**
 * @param {string} src
 * @param {string} dst
 * @param {Filter} filter
 * @param {StringModification} modification
 */
function convertIlStrings(src, dst, filter, modification) {
    fs.readFile(src, (err, data) => {
        const {
            log, modifications
        } = modifyBufferStructure(data, filter, modification, STRINGS_TYPE.IL_STRINGS)

        const logJson = JSON.stringify(log, undefined, 2)
        const logOutputBuffer = Buffer.from(logJson)
        fs.writeFile(dst + '.json', logOutputBuffer, err => {
            if (err) {
                console.log('Failed to create log.', err)
                console.log(logJson)
            }
        })

        const outputBuffer = Buffer.from(modifications)
        fs.writeFile(dst, outputBuffer, err => {
            if (err) {
                console.log('Failed to write ilstrings file.', err)
            } else {
                console.log('Completed successfully...')
            }
        })
    })
}

module.exports = {
    convertIlStrings
}