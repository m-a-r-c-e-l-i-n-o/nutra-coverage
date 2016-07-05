# nutra-coverage
The "nutra-coverage" module is an adaption of the Istanbul code coverage for "[N.U.T.R.A.](https://github.com/m-a-r-c-e-l-i-n-o/nutra)" unit test runner.

## Install Plugin:
```bash
npm install nutra nutra-coverage --save-dev
```

## Add Plugin Configuration:
Create a "nutra.config.js" config file in the root of your project and populate it with the following:
```js
// nutra.config.js
module.exports = function( config ) {
  config.set({
    frameworks: ['nutra-jasmine'],
    files: ['specs/**/*.js', 'src/**/*.js'], // Modify to include your own app & spec files
    preprocessors: {
        'src/**/*.js': ['nutra-coverage'] // Modify to include your own app files
    },
    reporters: ['nutra-coverage'],
    coverageOptions: {
        dir : './coverage/',
        reporters: [ // custom reporters
            // reporters not supporting the `file` property
            { type: 'html', subdir: 'report-html' },
            { type: 'lcov', subdir: 'report-lcov' },
            // reporters supporting the `file` property, use `subdir` to directly
            // output them in the `dir` directory
            { type: 'cobertura', subdir: '.', file: 'cobertura.txt' },
            { type: 'lcovonly', subdir: '.', file: 'report-lcovonly.txt' },
            { type: 'teamcity', subdir: '.', file: 'teamcity.txt' },
            { type: 'text', subdir: '.', file: 'text.txt' },
            { type: 'text-summary', subdir: '.', file: 'text-summary.txt' }
        ]
    }
  })
  // For more configuration options, please take a look at:
  // https://github.com/m-a-r-c-e-l-i-n-o/nutra#configuration-anatomy
}
```
