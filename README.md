# starfield-pig-latin

***Converts Starfield Strings to Pig Latin***

## Installation

- Clone repository
- Open a terminal or command line window and run, `npm install`
- Use a BA2 extractor to extract the English `ilstrings` from Starfield's `Localization.ba2` file and place them
  in `files/input`
- After installation is complete, to compile the strings you've added to `files/input`, run `node ./src/index.js`
- The compiled pig latin `ilstrings` should be found in the `files/output` directory, this can now be placed in
  the `.../My Games/Starfield/Data/strings/`.

## Attributions

- [KNY00/lib-bethesda-strings](https://github.com/KNY00/lib-bethesda-strings)