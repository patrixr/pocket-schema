const fs      = require('fs');
const path    = require('path');
const Schema  = require('../');
const _       = require('lodash')

const START_KEY = '<!--PocketTypes:start-->';
const END_KEY   = '<!--PocketTypes:end-->';

const types       = Schema.allTypes();
const readmeFile  = path.resolve(__dirname, '../README.md');
const readme      = fs.readFileSync(readmeFile, 'utf8').toString();

const toReplace = /<!--PocketTypes:start-->([^<]*)<!--PocketTypes:end-->/;

let output = START_KEY + '\n';

console.log("--> Reading types");

for (let typeName in types) {
  console.log(`----> ${typeName}`);

  const { options } = types[typeName] || {};
  const hasOptions = _.keys(options).length > 0;

  output += `* \`${typeName}\` ${hasOptions ? ' - options:' : ''}\n`;
  for (let option in options) {
    const desc = options[option];
    output += `\t* \`${option}\` ${desc}\n`
  }
  output += '\n';
}

output += END_KEY + '\n'


const result = readme.replace(toReplace, output);

console.log("--> Writing to README.md");

fs.writeFileSync(readmeFile, result);

console.log("--> Done");
