const convertToPigLatin = require('../src/pig-latin')

function testWith(original, converted) {
    return () => {
        const pigLatin = convertToPigLatin(original)
        expect(pigLatin).toBe(converted)
    }
}

test('195787:1011136', testWith(
    'This... This is their bar? I\'ve been in shiftier joints in Neon. I just expected... a few dead bodies here and there.',
    'Isthay... Isthay isyay eirthay arbay? I\'veyay eenbay inyay iftiershay ointsjay inyay Eonnay. Iyay ustjay expectedyay... ayay ewfay eadday odiesbay erehay andyay erethay.'
))

test('195802:1011256', testWith(
    'But it\'s not as simple as waving the proof in somebody\'s face. Especially with a case this old, there\'s appeals that have to be filed, legal proceedings, bureaucracy, the whole nine.',
    'Utbay it\'syay otnay asyay implesay asyay avingway ethay oofpray inyay omebody\'ssay acefay. Especiallyyay ithway ayay asecay isthay oldyay, ere\'sthay appealsyay atthay avehay otay ebay iledfay, egallay oceedingspray, ureaucracybay, ethay olewhay inenay.'
))

test('196120:1013712', testWith(
    'Wish I could take the day off. *sigh*',
    'Ishway Iyay ouldcay aketay ethay ayday offyay. *ighsay*'
))

test('196141:1013880', testWith(
    'Yeah, yeah, don\'t get all mushy on me now. *Sigh*, I need a drink.',
    'Eahyay, eahyay, on\'tday etgay allyay ushymay onyay emay ownay. *Ighsay*, Iyay eednay ayay inkdray.'
))

test('195778:1011064', testWith(
    '[Demand <Global=DR017_DataCreditsHigh> Credits] If it\'s valuable, I\'m willing to sell it.',
    '[Emandday <Global=DR017_DataCreditsHigh> Editscray] Ifyay it\'syay aluablevay, I\'myay illingway otay ellsay ityay.'
))

test('142438:681408', testWith(
    'A reminder that "Bring Your Child To Work Day" is not an officially sanctioned holiday, and that it is not advised to allow children into potentially dangerous work sites.',
    'Ayay eminderray atthay "Ingbray Ouryay Ildchay Otay Orkway Ayday" isyay otnay anyay officiallyyay anctionedsay olidayhay, andyay atthay ityay isyay otnay advisedyay otay allowyay ildrenchay intoyay otentiallypay angerousday orkway itessay.'
))

test('137412:642728', testWith(
    '...Fine. But only \'cause I don\'t want to go back to the clink.',
    '...Inefay. Utbay onlyyay ause\'cay Iyay on\'tday antway otay ogay ackbay otay ethay inkclay.'
))

test('', testWith(
    'I\'m sorry, too. It\'s obvious that we\'ll never truly see eye-to-eye about Delgado.',
    'I\'myay orrysay, ootay. It\'syay obviousyay atthay e\'llway evernay ulytray eesay eyeyay-otay-eyeyay aboutyay Elgadoday.'
))