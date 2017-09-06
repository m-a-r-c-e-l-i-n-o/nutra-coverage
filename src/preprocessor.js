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
        const sourceMapComment = inlineSourceMapComment(sourceMap)
        const soureWithMap = source + '\n' + sourceMapComment

        fs.ensureFileSync(tmpFilename)
        fs.writeFileSync(tmpFilename, soureWithMap)

        const options = {
            codeGenerationOptions: {
                sourceMap: tmpFilename,
                sourceMapWithCode: true,
                sourceContent: source
            }
        }
        const instrumenter = new Istanbul.Instrumenter(options)
        const instrumented = instrumenter.instrumentSync(source, tmpFilename)
        const instrumentedMap = instrumenter.lastSourceMap()
        const instrumentedMapComment = inlineSourceMapComment(
            instrumentedMap, { sourcesContent: true }
        )

        return instrumented + '\n' + sourceMapComment
    }
    events.onExit = () => {
        return new Promise((resolve, reject) => {
            resolve()
        })
    }
}

export default preprocessor
