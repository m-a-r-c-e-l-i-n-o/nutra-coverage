import Fs from'fs-extra'
import Path from'path'
import Istanbul from'istanbul'

const preprocessor = (events, system, opts) => {
    if (typeof __coverage__ !== 'undefined') {
        __coverage__ = undefined
    }
    events.onLoad = () => {
        return new Promise((resolve, reject) => {
            resolve()
        })
    }
    events.onFileLoad = (source, filename, key) => {
        const instrumenter = new Istanbul.Instrumenter()
        const tmpFilename = Path.join(system.tmpDirectory, 'coverage', key)
        Fs.ensureFileSync(tmpFilename)
        Fs.writeFileSync(tmpFilename, source)
        return instrumenter.instrumentSync(source, tmpFilename)
    }
    events.onExit = () => {
        return new Promise((resolve, reject) => {
            resolve()
        })
    }
}

export default preprocessor
