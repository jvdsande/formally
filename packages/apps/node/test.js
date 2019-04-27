const { Handler } = require("formallyjs")
const { toJS } = require('mobx')

const printjson = (pr) => {
  console.log(JSON.stringify(toJS(pr), null, 2))
}

const testHandler = new Handler({
  hello: {
    world: "Hello World!"
  },
  my: {
    name: {
      is: {
        what: "?"
      }
    }
  },
})

testHandler.initialize("hello.you")
testHandler.touch("hello.world")
testHandler.update("my.name.is.tchika-tchika", "Slim Shady!")
testHandler.update("my.name.is", { what: "!" })

// printjson(testHandler.values)

const validationHandler = new Handler({}, {
  'inscriptionDate': {
    format: v => new Date(v)
  },
  'email': {
    format: v => v.toLowerCase(),
    validation: {
      required: true,
      invalid: (v) => !v.match(/[a-zA-Z0-9_.+-]+@[a-zA-Z]+\.[a-zA-Z][a-zA-Z]+/)
    },
  },
  'password.original': {
    validation: {
      required: true,
      invalid: (v) => v.length < 4
    }
  },
  'password.confirm': {
    validation: {
      required: true,
      invalid: (v, values) => {
        return values.password.original !== v
      }
    }
  }
})

validationHandler.initialize("email")
validationHandler.initialize("password.original")
validationHandler.initialize("password.confirm")

validationHandler.update("email", "JEREMIE.vanDERsande@GMAIL.com")
validationHandler.update("password.original", "test")
validationHandler.update("password.confirm", "test2")
validationHandler.update("inscriptionDate", 0)

printjson(validationHandler.formatted)
