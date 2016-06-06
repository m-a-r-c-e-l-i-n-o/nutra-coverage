import Istanbul from'istanbul'
import RemapIstanbul from 'remap-istanbul'

const preprocessor = (events, system, opts) => {
    events.onLoad = () => {
        return new Promise((resolve, reject) => {
            resolve()
        })
    }
    events.onFileLoad = (source, filename) => {
        const instrumenter = new Istanbul.Instrumenter()
        return instrumenter.instrumentSync(source, filename)
    }
    events.onExit = () => {
        return new Promise((resolve, reject) => {
            resolve()
        })
    }
}

const reporter = (events, system, opts) => {
    events.onLoad = () => {}
    events.onExit = () => {
        if (typeof __coverage__ === 'undefined') {
            console.log('No coverage info!')
        } else {
            try {
                const collector = RemapIstanbul.remap(__coverage__)
                let report = Istanbul.Report.create('html')
                report.writeReport(collector, true)
                report = Istanbul.Report.create('text', {maxCols: 82})
                report.writeReport(collector, true)
                report = Istanbul.Report.create('text-summary')
            } catch (e) { system.handleError(e) }
        }
    }
}

export { preprocessor, reporter }
