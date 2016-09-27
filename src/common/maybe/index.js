import { curry } from 'ramda'

const Maybe = function (value) {
  this._value = value
}

Maybe.of = function (value) {
  return new Maybe(value)
}

Maybe.prototype.isNothing = function () {
  return (this._value === null || this._value === undefined)
}

Maybe.prototype.map = function (fn) {
  if (this.isNothing()) {
    return Maybe.of(null)
  }

  return Maybe.of(fn(this._value))
}

Maybe.prototype.join = function () {
  return this._value
}

Maybe.prototype.chain = function (fn) {
  return this.map(fn).join()
}

Maybe.prototype.orElse = function (def) {
  if (this.isNothing()) {
    return Maybe.of(def)
  }

  return this
}

Maybe.prototype.ap = function (someOtherMaybe) {
  return someOtherMaybe.map(this._value)
}

export const map = curry((fn, m) => m.map(fn))

export const chain = curry((fn, m) => m.chain(fn))

export const ap = curry((fn, m) => m.ap(fn))

export const orElse = curry((val, m) => m.orElse(val))

export const join = m => m.join()

export default Maybe
