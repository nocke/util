global.autoSuiteName = (name) => name.split('/test/', 2)[1]

// used for capturing and asserting stdout
// REF stackoverflow.com/a/18543419
global.captureStream = (stream) => {
  const oldWrite = stream.write
  let buf = ''
  stream.write = function(chunk, encoding, callback) {
    buf += chunk.toString() // chunk is a String or Buffer
    oldWrite.apply(stream, arguments)
  }

  return {
    unhook: function unhook() {
      stream.write = oldWrite
    },
    captured: function() {
      return buf
    }
  }
}
