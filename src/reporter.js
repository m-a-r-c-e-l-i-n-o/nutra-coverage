import Istanbul from'istanbul'
import RemapIstanbul from 'remap-istanbul'

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

export default reporter
