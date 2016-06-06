import Istanbul from'istanbul'

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

export default preprocessor
