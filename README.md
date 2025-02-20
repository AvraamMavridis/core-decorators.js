# core-decorators.js [![Build Status](https://travis-ci.org/jayphelps/core-decorators.js.svg?branch=master)](https://travis-ci.org/jayphelps/core-decorators.js)
Library of [ES2016 (ES7) decorators](https://github.com/wycats/javascript-decorators) inspired by languages that come with built-ins like @​override, @​deprecate, etc, similar to [pre-defined Annotations in Java](https://docs.oracle.com/javase/tutorial/java/annotations/predefined.html). Note that unlike Java annotations, decorators are functions which are applied at runtime.

### Get It

A version compiled to ES5 in CJS format is published to npm as [`core-decorators`](https://www.npmjs.com/package/core-decorators)
```bash
npm install core-decorators --save
```

This form could be consumed by any ES2016 (ES7) transpiler that supports decorators like [babel.js](https://babeljs.io/) with `babel --optional es7.decorators,es7.objectRestSpread` or `babel --stage 1` or using the recent iterations of TypeScript.

_*note that the compiled code is intentionally not checked into this repo_

## Decorators

* [@autobind](#autobind)
* [@readonly](#readonly)
* [@override](#override)
* [@deprecate](#deprecate-alias-deprecated)
* [@suppressWarnings](#suppresswarnings)
* [@memoize](#memoize)

##### Proposed (not implemented, PRs welcome!):
* @mixin
* @instrument/profile
* @debounce
* @throttle
* @private
* @nonenumerable

## Docs

### @autobind

Forces invocations of this function to always have `this` refer to the class instance, even if the function is passed around or would otherwise lose its `this` context. e.g. `var fn = context.method;`

```js
import { autobind } from 'core-decorators';

class Person {
  @autobind
  getPerson() {
  	return this;
  }
}

let person = new Person();
let getPerson = person.getPerson;

getPerson() === person;
// true
```

### @readonly

Marks a property or method as not being writable.

```js
import { readonly } from 'core-decorators';

class Woman {
  @readonly
  gender = 'female';
}

var lady = new Woman();
lady.gender = 'male';
// Cannot assign to read only property 'gender' of [object Object]

```

### @override

Checks that the marked method indeed overrides a function with the same signature somewhere on the prototype chain.

Works with methods and getters/setters. Will ensure name, parameter count, as well as descriptor type (accessor/data). Provides a suggestion if it finds a method with a similar signature, including slight misspellings.

```js
import { override } from 'core-decorators';

class Parent {
  kickDog(first, second) {}
}

class Child extends Parent {
  @override
  kickDog() {}
  // SyntaxError: Child#kickDog() does not properly override Parent#kickDog(first, second)
}

// or

class Child extends Parent {
  @override
  kickDogs() {}
  // SyntaxError: No descriptor matching Child#kickDogs() was found on the prototype chain.
  //
  //   Did you mean "kickDog"?
}
```

### @deprecate (alias: @deprecated)

Calls `console.warn()` with a deprecation message. Provide a custom message to override the default one. You can also provide an options hash with a `url`, for further reading.

```js
import { deprecate } from 'core-decorators';

class Person {
  @deprecate
  kickDog() {}

  @deprecate('We stopped animal abuse')
  kickDogHard() {}

  @deprecate('We stopped animal abuse', { url: 'http://humanesociety.org/issues/abuse_neglect/' })
  kickDogHarder() {}
}

let person = new Person();

person.kickDog();
// DEPRECATION Person#kickDog: This function will be removed in future versions.

person.kickDogHard();
// DEPRECATION Person#kickDogHard: We stopped animal abuse

person.kickDogHarder();
// DEPRECATION Person#kickDogHarder: We stopped animal abuse
//
//     See http://humanesociety.org/issues/abuse_neglect/ for more details.
//
```

### @suppressWarnings

Suppresses any JavaScript `console.warn()` call while the decorated function is called. (i.e. on the stack)

Will _not_ suppress warnings triggered in any async code within.

```js
import { suppressWarnings } from 'core-decorators';

class Person {
  @deprecated
  kickDog() {}

  @suppressWarnings
  kickDogWithoutWarning() {
    this.kickDog();
  }
}

let person = new Person();

person.kickDogWithoutWarning();
// no warning is logged
```

### @memoize

Initial implementation included, likely slow. WIP.

## Disclaimer
Please don't kick dogs. It's not nice.

![adorable dog](https://cloud.githubusercontent.com/assets/762949/7152487/b0fec1ce-e2f1-11e4-9207-93fb1422381c.gif)
