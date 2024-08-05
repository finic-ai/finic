(function(global) {
  global.createPromiseCapability = function() {
    var promiseCapability = {};
    var promise = new Promise(function(resolve, reject) {
      promiseCapability.resolve = resolve;
      promiseCapability.reject = reject;
    });
    promiseCapability.promise = promise;
    return promiseCapability;
  };

  //
  // Check for native Promise and it has correct interface
  //

  var NativePromise = global['Promise'];
  var nativePromiseSupported =
    NativePromise &&
    // Some of these methods are missing from
    // Firefox/Chrome experimental implementations
    'resolve' in NativePromise &&
    'reject' in NativePromise &&
    'all' in NativePromise &&
    'race' in NativePromise &&
    // Older version of the spec had a resolver object
    // as the arg rather than a function
    (function() {
      var resolve;
      new NativePromise(function(r) {
        resolve = r;
      });
      return typeof resolve === 'function';
    })();


  //
  // export if necessary
  //

  if (typeof exports !== 'undefined' && exports) {
    // node.js
    exports.Promise = nativePromiseSupported ? NativePromise : Promise;
    exports.Polyfill = Promise;
  } else {
    // AMD
    if (typeof define == 'function' && define.amd) {
      define(function() {
        return nativePromiseSupported ? NativePromise : Promise;
      });
    } else {
      // in browser add to global
      if (!nativePromiseSupported)
        global['Promise'] = Promise;
    }
  }


  //
  // Polyfill
  //

  var PENDING = 'pending';
  var SEALED = 'sealed';
  var FULFILLED = 'fulfilled';
  var REJECTED = 'rejected';
  var NOOP = function() {};

  function isArray(value) {
    return Object.prototype.toString.call(value) === '[object Array]';
  }

  // async calls
  var asyncSetTimer = typeof setImmediate !== 'undefined' ? setImmediate : setTimeout;
  var asyncQueue = [];
  var asyncTimer;

  function asyncFlush() {
    // run promise callbacks
    for (var i = 0; i < asyncQueue.length; i++)
      asyncQueue[i][0](asyncQueue[i][1]);

    // reset async asyncQueue
    asyncQueue = [];
    asyncTimer = false;
  }

  function asyncCall(callback, arg) {
    asyncQueue.push([callback, arg]);

    if (!asyncTimer) {
      asyncTimer = true;
      asyncSetTimer(asyncFlush, 0);
    }
  }


  function invokeResolver(resolver, promise) {
    function resolvePromise(value) {
      resolve(promise, value);
    }

    function rejectPromise(reason) {
      reject(promise, reason);
    }

    try {
      resolver(resolvePromise, rejectPromise);
    } catch (e) {
      rejectPromise(e);
    }
  }

  function invokeCallback(subscriber) {
    var owner = subscriber.owner;
    var settled = owner.state_;
    var value = owner.data_;
    var callback = subscriber[settled];
    var promise = subscriber.then;

    if (typeof callback === 'function') {
      settled = FULFILLED;
      try {
        value = callback(value);
      } catch (e) {
        reject(promise, e);
      }
    }

    if (!handleThenable(promise, value)) {
      if (settled === FULFILLED)
        resolve(promise, value);

      if (settled === REJECTED)
        reject(promise, value);
    }
  }

  function handleThenable(promise, value) {
    var resolved;

    try {
      if (promise === value)
        throw new TypeError('A promises callback cannot return that same promise.');

      if (value && (typeof value === 'function' || typeof value === 'object')) {
        var then = value.then; // then should be retrived only once

        if (typeof then === 'function') {
          then.call(value, function(val) {
            if (!resolved) {
              resolved = true;

              if (value !== val)
                resolve(promise, val);
              else
                fulfill(promise, val);
            }
          }, function(reason) {
            if (!resolved) {
              resolved = true;

              reject(promise, reason);
            }
          });

          return true;
        }
      }
    } catch (e) {
      if (!resolved)
        reject(promise, e);

      return true;
    }

    return false;
  }

  function resolve(promise, value) {
    if (promise === value || !handleThenable(promise, value))
      fulfill(promise, value);
  }

  function fulfill(promise, value) {
    if (promise.state_ === PENDING) {
      promise.state_ = SEALED;
      promise.data_ = value;

      asyncCall(publishFulfillment, promise);
    }
  }

  function reject(promise, reason) {
    if (promise.state_ === PENDING) {
      promise.state_ = SEALED;
      promise.data_ = reason;

      asyncCall(publishRejection, promise);
    }
  }

  function publish(promise) {
    var callbacks = promise.then_;
    promise.then_ = undefined;

    for (var i = 0; i < callbacks.length; i++) {
      invokeCallback(callbacks[i]);
    }
  }

  function publishFulfillment(promise) {
    promise.state_ = FULFILLED;
    publish(promise);
  }

  function publishRejection(promise) {
    promise.state_ = REJECTED;
    publish(promise);
  }

  /**
   * @class
   */
  function Promise(resolver) {
    if (typeof resolver !== 'function')
      throw new TypeError('Promise constructor takes a function argument');

    if (this instanceof Promise === false)
      throw new TypeError('Failed to construct \'Promise\': Please use the \'new\' operator, this object constructor cannot be called as a function.');

    this.then_ = [];

    invokeResolver(resolver, this);
  }

  Promise.prototype = {
    constructor: Promise,

    state_: PENDING,
    then_: null,
    data_: undefined,

    then: function(onFulfillment, onRejection) {
      var subscriber = {
        owner: this,
        then: new this.constructor(NOOP),
        fulfilled: onFulfillment,
        rejected: onRejection
      };

      if (this.state_ === FULFILLED || this.state_ === REJECTED) {
        // already resolved, call callback async
        asyncCall(invokeCallback, subscriber);
      } else {
        // subscribe
        this.then_.push(subscriber);
      }

      return subscriber.then;
    },

    'catch': function(onRejection) {
      return this.then(null, onRejection);
    }
  };

  Promise.all = function(promises) {
    var Class = this;

    if (!isArray(promises))
      throw new TypeError('You must pass an array to Promise.all().');

    return new Class(function(resolve, reject) {
      var results = [];
      var remaining = 0;

      function resolver(index) {
        remaining++;
        return function(value) {
          results[index] = value;
          if (!--remaining)
            resolve(results);
        };
      }

      for (var i = 0, promise; i < promises.length; i++) {
        promise = promises[i];

        if (promise && typeof promise.then === 'function')
          promise.then(resolver(i), reject);
        else
          results[i] = promise;
      }

      if (!remaining)
        resolve(results);
    });
  };

  Promise.race = function(promises) {
    var Class = this;

    if (!isArray(promises))
      throw new TypeError('You must pass an array to Promise.race().');

    return new Class(function(resolve, reject) {
      for (var i = 0, promise; i < promises.length; i++) {
        promise = promises[i];

        if (promise && typeof promise.then === 'function')
          promise.then(resolve, reject);
        else
          resolve(promise);
      }
    });
  };

  Promise.resolve = function(value) {
    var Class = this;

    if (value && typeof value === 'object' && value.constructor === Class)
      return value;

    return new Class(function(resolve) {
      resolve(value);
    });
  };

  Promise.reject = function(reason) {
    var Class = this;

    return new Class(function(resolve, reject) {
      reject(reason);
    });
  };

  if (!nativePromiseSupported) {
    global.Promise = Promise;
  }

})(typeof window != 'undefined' ? window : typeof global != 'undefined' ? global : typeof self != 'undefined' ? self : this);