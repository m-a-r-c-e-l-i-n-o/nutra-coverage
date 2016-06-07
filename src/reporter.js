import Path from 'path'
import Istanbul from'istanbul'
import RemapIstanbul from 'remap-istanbul'
import _ from 'lodash'

var Private = {
    getReporters (reporters) {
        if (!_.isArray(reporters)) {
            reporters = []
        }
        return reporters.concat([
            { type: 'text' },
            { type: 'text-summary' },
        ])
    },
    getOutputDir (dir, subdir) {
        dir = dir || 'coverage'
        subdir = subdir || ''
        return Path.join(process.cwd(), dir, subdir)
    },
    writeReport (collector, type, opts) {
        let report = Istanbul.Report.create(type, opts)
        report.writeReport(collector, true)
    },
    handleExit (opts) {
        if (typeof __coverage__ === 'undefined') {
            console.log('No coverage info!')
        } else {
            try {
                const collector = RemapIstanbul.remap(__coverage__)
                const reporters = this.getReporters(opts.reporters)
                reporters.forEach(reporter =>
                    this.writeReport(
                        collector,
                        reporter.type,
                        Object.assign({}, reporter, {
                            dir: this.getOutputDir(opts.dir, reporter.subdir)
                        })
                    )
                )
            } catch (e) {this.system.handleError(e)}
        }
    }
}

var Public = {}

const reporter = (events, system, opts) => {
    Private.system = system
    events.onLoad = () => {}
    events.onExit = () => {
        Private.handleExit.call(Private, opts)
    }

    Public.__private__ = Private
    return Public
}

export default reporter
