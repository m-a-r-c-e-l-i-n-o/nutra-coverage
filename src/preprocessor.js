import fs from'fs-extra'
import path from'path'
import Istanbul from'istanbul'
import sorcery from 'sorcery'
import inlineSourceMapComment from 'inline-source-map-comment'

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
        const tmpFilename = path.join(system.tmpDirectory, 'coverage', key)
        const sourceFilename = path.join(process.cwd(), key.replace(/\|/g, '/'))
        const chain = sorcery.loadSync(filename)
        const sourceMap = chain.apply()
        sourceMap.file = tmpFilename
        sourceMap.sources = [sourceFilename]
        const soureWithMap = source + '\n' + inlineSourceMapComment(sourceMap)

        fs.ensureFileSync(tmpFilename)
        fs.writeFileSync(tmpFilename, soureWithMap)

        const instrumenter = new Istanbul.Instrumenter()
        return instrumenter.instrumentSync(source, tmpFilename)
    }
    events.onExit = () => {
        return new Promise((resolve, reject) => {
            resolve()
        })
    }
}

export default preprocessor
