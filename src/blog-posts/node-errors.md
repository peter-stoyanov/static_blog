# Node.js error handling lab - to throw or not to throw

Error handling in Node.js turns out to be not that straight forward, at least for me. Coming from .Net I thought that a single try-catch at the entry point of an application is sufficient to catch all kinds of errors and serve as a global error handler. After a few days of hanged script executions without any errors reported, here is what I learned.

## Set up the examples
 For this article I think its best to run the examples yourself and play with them. To set up the lab all you need is Node.js installed on your machine and two files.

 First one is index.js and serves as an entry point. In it we call different implementations of async functions and try to catch the errors thrown inside of them.

 Since not all errors can be catched this way we also add global error handlers listening for uncaught exceptions and rejected promises.

 ```javascript
const asyncAwait = require('./async-await');

process.on('uncaughtException', (err) => {
    console.log('GLOBAL HANDLER - uncaught error\n', err)
    process.exit(1) //mandatory (as per the Node docs)
});
process.on('unhandledRejection', (reason, promise) => {
    console.log('GLOBAL HANDLER - unhandled Rejection at:\n', promise, 'reason:', reason);
    // Application specific logging, throwing an error, or other logic here
    process.exit(1)
});


(async () => {
    try {
        const result1 = asyncAwait.throwSync();
        console.log(result1);

        const result2 = await asyncAwait.throwAsync();
        console.log(result2);

         const result21 = await asyncAwait.returnPromiseWithThrow();
        console.log(result21);

        const result3 = await asyncAwait.returnPromiseWithAsyncThrow();
        console.log(result3);

        const result4 = await asyncAwait.returnPromiseWithAsyncRejection();
        console.log(result4);

        const result5 = await asyncAwait.nestedAsyncThrow();
        console.log(result5);

        const result6 = await asyncAwait.nestedAsyncReject();
        console.log(result5);

        const result7 = await asyncAwait.nestedPromiseChain();
        console.log(result7);

        const result8 = await asyncAwait.test();
        console.log(result8);

    } catch (err) {
        // Deal with the fact the chain failed
        console.log('CATCH BLOCK MAIN LEVEL')
        console.log(err);
    }
})();
```

The async functions are implemented in the file `async-await.js`. They start with a simplce synchronous throw:

```javascript
function throwSync() {
    throw new Error('throw from throwSync');
}
```

and gradually increase complexity to throwing inside of promises:

```javascript
async function returnPromiseWithThrow() {
    return new Promise((resolve, reject) => {
        throw new Error('throw from returnPromiseWithThrow');
    });
}
```

The whole file:

```javascript
function throwSync() {
    throw new Error('throw from throwSync');
}

async function throwAsync() {
    throw new Error('throw from async function');
}

async function returnPromiseWithThrow() {
    return new Promise((resolve, reject) => {
        throw new Error('throw from returnPromiseWithThrow');
    });
}

async function returnPromiseWithAsyncThrow() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            throw new Error('throw from returnPromiseWithAsyncThrow');
        }, 1000);
    });
}

async function returnPromiseWithAsyncRejection() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error('throw from returnPromiseWithAsyncRejection'))
        }, 1000);
    });
}

async function nestedAsyncThrow() {
    return new Promise(async (resolve, reject) => {

        try {
            await returnPromiseWithAsyncThrow();

        } catch (error) {
            throw new Error('throw from nestedAsyncThrow');
        }
    });
}

async function nestedAsyncReject() {
    return new Promise(async (resolve, reject) => {

        try {
            await returnPromiseWithAsyncRejection();

        } catch (error) {
            reject(new Error('throw from nestedAsyncThrow'));
        }
    });
}

async function nestedPromiseChain() {
    return new Promise(async (resolve, reject) => {

        try {
            let result = await nestedPromiseChain2();
            resolve(result);

        } catch (error) {
            throw new Error('throw from nestedPromiseChain');
        }
    });
}

async function nestedPromiseChain2() {
    return new Promise(async (resolve, reject) => {

        try {
            let result = await immediateResolve('immediatly resolved promise 1');
            resolve(result);

        } catch (error) {
            throw new Error('throw from nestedPromiseChain2');
        }
    });
}

async function immediateResolve(text) {
    return Promise.reject(text);
}

async function test() {
    await immediateResolve('gosho');
}


module.exports = {
    throwSync,
    throwAsync,
    returnPromiseWithAsyncRejection,
    returnPromiseWithAsyncThrow,
    returnPromiseWithThrow,
    nestedAsyncThrow,
    nestedAsyncReject,
    nestedPromiseChain,
    test
}
```

Run the examples one by one and try to guess which handler will catch the errors - the main level try-catch or the global handlers.

## Takeaway

If you don't have the time to find it out for yourself here's the takeaway:

* When trowing errors in an async function, the error will be swallowed, it seems there is no way for the executing handler to connect back to the initial promise and to report that an error occured, in short, this is bad:

```javascript
async function returnPromiseWithAsyncThrow() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            throw new Error('throw from returnPromiseWithAsyncThrow');
        }, 1000);
    });
}
```

* The connection is kept though if we use the provided reject argument in the promise executor. This way we have closure over it and can use it later in the program execution, in short, this is alright:

```javascript
async function returnPromiseWithAsyncRejection() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error('throw from returnPromiseWithAsyncRejection'))
        }, 1000);
    });
}
```

## On another note

What async in front of a function definition does are a few things:

* it wraps the result of the function in a promise if not already a promise
* it adds implicit try-catch around the function implementation, which catches any errors and turns them into promise rejections

This means that a short and easy way exists to write your code and still reject promises properly if you don't need to intercept the error in some way. This is it:

```javascript
async function shortAndBeautifull() {
    // hidden try {
        return someAsyncFunc();
    // hidden catch(e) {
    // reject(e); - converts the thrown error to rejection
    // }
}
```
