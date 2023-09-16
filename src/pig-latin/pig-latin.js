/** @typedef { {text:string, prefix:string, suffix:string, enclosed:boolean, capitalize:boolean, special:boolean, innerSegments:TextSegment[]|undefined} } TextSegment */
/** @typedef { {text:string, index:number, length:number}  } RawTextSegment */

const alphaPattern = /[a-z]/i
const vowelPattern = /[aeiou]/i
const alphaUpperPattern = /[A-Z]/
const punctuationPattern = /[.,;:!?]/

const enclosingPairs = [
    ['\'', '\'(?![a-zA-Z])'],
    ['"', '"'],
    ['\\[', '\\]'],
    ['\\{', '\\}'],
    ['\\(', '\\)'],
    ['<', '>'],
    ['\\*', '\\*']
]

const enclosingStrPattern = '\\B(' + enclosingPairs.map(it => `${it[0]}.+?${it[1]}`).join('|') + ')'
const enclosedPattern = new RegExp(enclosingStrPattern, 'g')

/**
 * @param {string} text
 * @param {string} prefix
 * @param {string} suffix
 * @param {boolean} enclosed
 * @param {boolean} capitalize
 * @param {boolean} special
 * @param {TextSegment[]?} innerSegments
 * @return {TextSegment}
 */
function createSegment(
    text, prefix = '', suffix = '',
    enclosed = false, capitalize = false, special = false,
    innerSegments = undefined
) {
    return {
        text,
        prefix,
        suffix,
        enclosed,
        capitalize,
        special,
        innerSegments
    }
}

/**
 * @param {string} str
 * @param {RegExp} pattern
 * @return {boolean}
 */
function testPattern(str, pattern) {
    return pattern.test(str)
}

/**
 * @param {string} str
 * @param {RegExp} pattern
 * @return {[]|null}
 */
function matchPattern(str, pattern) {
    return str.match(pattern)
}

/**
 * @param {TextSegment} segment
 * @return {boolean}
 */
function validateSegment(segment) {
    return segment.text.length > 0 || segment.suffix.length > 0 || segment.prefix > 0
}

/**
 * @param {string} str
 */
function segmentSplit(str) {
    const matches = str.match(enclosedPattern)

    /**
     * @type {TextSegment[]}
     */
    const presegs = []
    if (matches) {
        let workingIndex = 0
        for (const match of matches) {
            const indexOfMatch = str.indexOf(match)
            const len = match.length

            if (indexOfMatch - workingIndex > 0) {
                const pre = str.slice(workingIndex, indexOfMatch).trim()
                const segment = !matchPattern(pre, alphaPattern) && matchPattern(pre, punctuationPattern)
                    ? createSegment('', '', pre + ' ')
                    : createSegment(pre, '', '', false, testPattern(pre, alphaUpperPattern))

                presegs.push(segment)
            }

            const seg = str.slice(indexOfMatch + 1, indexOfMatch + len - 1).trim()
            const isSpecial = str.slice(indexOfMatch, indexOfMatch + 1) === '<'

            const segment = createSegment(
                seg,
                str.slice(indexOfMatch, indexOfMatch + 1).trim(),
                str.slice(indexOfMatch + len - 1, indexOfMatch + len).trim(),
                true,
                testPattern(seg, alphaUpperPattern) && !isSpecial,
                isSpecial
            )

            presegs.push(segment)
            workingIndex = indexOfMatch + len
        }

        const remaining = str.slice(workingIndex).trim()
        if (remaining.length > 0) {
            const segment = createSegment(remaining, '', '', false, testPattern(remaining, alphaUpperPattern))
            presegs.push(segment)
        }
    } else {
        const split = str.split(' ')
        split.forEach(it => {
            const capitalize = alphaUpperPattern.test(it)
            const lastChar = it[it.length - 1]
            if (punctuationPattern.test(lastChar)) {
                const firstIndex = it.search(punctuationPattern)
                let lastIndex = -1

                for (let i = it.length - 1; i >= 0; i--) {
                    if (punctuationPattern.test(it[i])) {
                        lastIndex = i
                        break
                    }
                }

                const suffix = it.slice(firstIndex, lastIndex + 1)
                const text = it.slice(0, it.length - (lastIndex + 1 - firstIndex))

                const segment = createSegment(text, '', suffix, false, capitalize, false)
                presegs.push(segment)
            } else {
                const segment = createSegment(it, '', '', false, testPattern(it, alphaUpperPattern))
                presegs.push(segment)
            }
        })
    }

    /**
     * @type {TextSegment[]}
     */
    const segments = []
    for (const preseg of presegs) {
        const {
            text,
            enclosed,
            special
        } = preseg

        if (!special && text.includes(' ')) {
            const split = text.split(' ')
            let innerSegments = []

            for (const spl of split) {
                const splSegments = segmentSplit(spl)
                innerSegments.push(...splSegments)
            }

            innerSegments = innerSegments.filter(validateSegment)
            if (!enclosed) {
                segments.push(...innerSegments)
            } else {
                preseg.innerSegments = innerSegments
                segments.push(preseg)
            }
        } else {
            segments.push(preseg)
        }
    }

    return segments.filter(validateSegment)
}

/**
 *
 * @param {string} word
 */
function convertWord(word) {
    if (word.length === 0) {
        return word
    }

    const lower = word.toLowerCase()
    const firstChar = lower[0]

    if (vowelPattern.test(firstChar)) {
        return lower + 'yay'
    } else if (lower.startsWith('qu')) {
        return lower.slice(2) + 'quay'
    } else if (lower.indexOf('-') !== -1) {
        const split = lower.split('-')
        return split.map(convertWord).join('-')
    } else {
        const firstVowelIndex = lower.search(vowelPattern)
        return lower.slice(firstVowelIndex) + lower.slice(0, firstVowelIndex) + 'ay'
    }
}

/**
 * @param {TextSegment} segment
 */
function convertSegment(segment) {
    const {
        text,
        prefix,
        suffix,
        capitalize
    } = segment

    let str = ''

    const converted = convertWord(text)
    const formattedText = capitalize ? converted.slice(0, 1).toUpperCase() + converted.slice(1) : converted

    if (text) {
        str += ' '
    }

    str += prefix + formattedText + suffix
    return str
}

/**
 *
 * @param {string} str
 * @return {string}
 */
function convertToPigLatin(str) {
    const segments = segmentSplit(str)
    const latinStrList = []

    segments.forEach(segment => {
        const {
            text,
            prefix,
            suffix,
            special,
            innerSegments = []
        } = segment

        if (special) {
            latinStrList.push(' ' + prefix + text + suffix)
        } else if (innerSegments.length > 0) {
            let innerStr = prefix
            for (const inner of innerSegments) {
                if (inner.special) {
                    const {
                        text,
                        prefix,
                        suffix
                    } = inner

                    innerStr += prefix + text + suffix
                } else {
                    const convertedSegment = convertSegment(inner)
                    innerStr += convertedSegment
                }
            }

            innerStr = innerStr.trim() + suffix
            latinStrList.push(innerStr)
        } else {
            const convertedSegment = convertSegment(segment)
            latinStrList.push(convertedSegment)
        }
    })

    return latinStrList.join('').trim()
}

module.exports = convertToPigLatin