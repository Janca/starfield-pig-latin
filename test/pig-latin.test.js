const convertToPigLatin = require("../src/pig-latin")

// test('Simple Test 1', () => {
//     const testStr = "This is a test"
//     const a = convertToPigLatin(testStr)
//     expect(a).toBe(testStr)
// })
//
test('Simple Test 2', () => {
    const testStr = "Actually, never mind. I don't need your help. We're done here. But 'quotes' work here. I'm a contraction that starts with an I."//"I can only supply <Global=OE_KMK_Supply01AmountThird> <Alias=PrimaryRef>. [<Global=OE_KMK_Supply01RewardThird> credits]"

    const pigLatin = convertToPigLatin(testStr)
    console.log("Input:", testStr)
    console.log("Output:", pigLatin)
})
//
// test('Simple Test 3', () => {
//     const testStr = "This [is a test]"
//     const a = convertToPigLatin(testStr)
//     expect(a).toBe(testStr)
// })

// test('Simple Test 3', () => {
//     const testStr = "This [is a <SOMETHING_CHECKPOINT>]"
//     const a = convertToPigLatin(testStr)
//     expect(a).toBe(testStr)
// })