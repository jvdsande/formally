import { observable, action, computed, toJS } from 'mobx'

class Path {
  constructor(obj) {
    if(obj) {
      Object.keys(obj).forEach(k => this[k] = obj[k])
    }
  }

  @observable pristine = true

  @observable touched = false

  @observable modified = false

  @computed get dirty() {
    return !this.pristine
  }

  @computed get untouched() {
    return !this.touched
  }

  @computed get pure() {
    return {
      pristine: this.pristine,
      dirty: this.dirty,
      touched: this.touched,
      untouched: this.untouched,
      modified: this.modified,
    }
  }
}

export class Handler {
  @observable values = {}

  @observable definition = {}

  @observable state = {}

  constructor({ values, definition } = {}) {
    this.values = values || {}
    this.definition = definition || {}
  }

  onUpdate = () => {}

  // Path helpers
  getObjectFromPath(path, root, init) {
    // Path can either be a direct property or a sub-property.
    const parts = path.split('.')

    const final = parts.pop()
    const parent = parts.reduce((p, part) => {
      if(init) {
        p[part] = p[part] || {}
      }

      return p[part] || {}
    }, root)

    return { parent, final }
  }

  getStateFromPath(path, init) {
    const { parent, final } = this.getObjectFromPath(path, this.state, init)

    if(init && (!parent[final] || (typeof parent[final] === 'object' && !parent[final] instanceof Path))) {
      parent[final] = new Path(parent[final])
    }

    return parent[final]
  }

  getValueFromPath(path, init) {
    return this.getObjectFromPath(path, this.values, init)
  }

  validate(path) {
    const { parent, final } = this.getValueFromPath(path)
    const value = parent[final]
    const requirements = this.definition[path] ? this.definition[path].validation : {}
    const validation = {}

    Object.keys(requirements).forEach(k => {
      if(k === "required" && requirements[k] === true) {
        validation[k] = !value
      }

      if(typeof requirements[k] === 'function') {
        validation[k] = requirements[k](value, this.values)
      }
    })

    return validation
  }

  // Path actions
  @action.bound initialize(path) {
    this.getStateFromPath(path, true)
    this.getValueFromPath(path, true)
  }

  @action.bound touch(path) {
    const state = this.getStateFromPath(path)
    state.touched = true
    state.modified = false

    this.onUpdate(toJS(this.values), this)
  }

  @action.bound update(path, value) {
    const state = this.getStateFromPath(path)
    state.pristine = false
    state.modified = true

    const { parent, final } = this.getValueFromPath(path)

    parent[final] = value

    this.onUpdate(toJS(this.values), this)
  }

  getValuesAndPath(_values, _state, _definition) {
    // Merge state and values
    const values = {}

    const paths = []

    // Automatically add all definition to paths
    paths.push(...Object.keys(_definition))

    // Find all initialized paths
    const findPaths = (obj, path) => {
      Object.keys(obj).forEach(k => {
        const next = path !== "" ? `${path}.${k}` : k

        if(obj[k] instanceof Path && !paths.includes(next)) {
          paths.push(next)
        }

        if(typeof obj[k] == 'object') {
          findPaths(obj[k], next)
        }
      })
    }

    findPaths(_state, "")

    const copyObject = (dest, orig) => {
      Object.keys(orig)
        .forEach(k => {
          dest[k] = orig[k]

          if(typeof orig[k] === 'object') {
            dest[k] = {}
            copyObject(dest[k], orig[k])
          }
        })
    }

    // Go through values
    copyObject(values, _values)

    return { values, paths }
  }

  @computed get computed() {
    const { values, paths } = this.getValuesAndPath(this.values, this.state, this.definition)

    // Fill with state and validation
    paths.reverse().forEach(p => {
      const { final, parent } = this.getObjectFromPath(p, values)
      parent[final] = parent[final] === undefined ? null : parent[final]

      const format = this.definition[p] && this.definition[p].format || (v => v)

      parent[final] = {
        __value: format(parent[final]),
        __state: (this.getStateFromPath(p) || {}).pure,
        __error: this.validate(p),
      }
    })

    return values
  }

  @computed get formatted() {
    const { values, paths } = this.getValuesAndPath(this.values, this.state, this.definition)

    // Replace with format
    paths.reverse().forEach(p => {
      const { final, parent } = this.getObjectFromPath(p, values)
      parent[final] = parent[final] === undefined ? null : parent[final]

      const format = this.definition[p] && this.definition[p].format || (v => v)

      parent[final] = format(parent[final])
    })

    return values
  }

  @computed get isValid() {
    const { computed } = this

    let valid = true

    const checkValidity = (orig) => {
      if(orig) {
        Object.keys(orig)
          .forEach(k => {
            if (orig[k] && orig[k].__error && Object.values(orig[k].__error).includes(true)) {
              valid = false
            }

            if (typeof orig[k] === 'object') {
              checkValidity(orig[k])
            }
          })
      }
    }

    checkValidity(computed)

    return valid
  }

  @computed get formState() {
    const { computed } = this

    const state = {
      pristine: true,
      touched: false,
      scanned: true,
    }

    let count = 0

    const checkState = (orig) => {
      if(orig) {
        Object.keys(orig)
          .forEach(k => {
            if(orig[k] && orig[k].__state) {
              count += 1
              state.pristine = state.pristine && orig[k].__state.pristine
              state.touched = state.touched || orig[k].__state.touched
              state.scanned = state.scanned && orig[k].__state.touched
            }

            if (typeof orig[k] === 'object') {
              checkState(orig[k])
            }
          })
      }
    }

    checkState(computed)

    state.untouched = !state.touched
    state.dirty = !state.pristine
    state.scanned = state.scanned && count > 0

    return state
  }

  getFormattedValue(path) {
    const { parent, final } = this.getObjectFromPath(path, this.formatted)
    return parent[final]
  }

  getComputedValue(path) {
    const { parent, final } = this.getObjectFromPath(path, this.computed)
    return parent[final] || {}
  }

  getValue(path) {
    const { parent, final } = this.getObjectFromPath(path, this.values)
    return parent[final]
  }
}
