# Using Gmail API with Node.js

Accessing gmail messages from a backend app in a Node.js environment

## Getting started

This [sample](https://developers.google.com/gmail/api/quickstart/nodejs) was the base script from which I started. On this page you need to click on generate credentials and save the downloaded `credentials.json` file in the project workspace under credentials folder.

The first time you run the project you'll be asked to visit an URL and authorize the project for specific scopes. Then copy and paste the authorization code in the console. The code will exchange the code for a combination of a access and refresh token. These tokens will be actually used to authenticate requests.

In case you won't be using the trashMessage functionality you could change the scopes array to include only the **readonly** one.

## Prerequisites

You need a npm package: [https://www.npmjs.com/package/googleapis](https://www.npmjs.com/package/googleapis)

A list of the available API calls, requests and responses is accessible here: [https://www.npmjs.com/package/googleapis#samples](https://www.npmjs.com/package/googleapis#samples)

Search operators that can be used in constructing the filter expression: [https://support.google.com/mail/answer/7190?hl=en](https://support.google.com/mail/answer/7190?hl=en)

## Filtering emails

A custom query expression can be build with the query builder:

```javascript
const query = gmail.queryBuilder
    .new()
    .from('nachricht.stage@bitkasten.de')
    .read(true)
    .withSubject('Eine Sendung aus Ihrem [:::(bit)kasten] ist eingetroffen')
    .withAttachment()
    .withFile('DBENW-20190910-dEAim.pds')
    .newerThan('1d');
```

and used like that:

```javascript
const result = await gmail.api.getMessage(query.build());
```

Due to the fact that we don't know when exactly a new message will appear in the inbox the call to getMessage() is going to retry up to a certain time limit: `const timeLimit = timeout || 5 * 60 * 1000;`.

The result from the getMessage() call will resolve to a object with this shape:

```javascript
resolve({
    exists: true,
    messageId: message.id,
    body: bodyText
});
```

The whole project source code can be found in this [repo](https://github.com/peter-stoyanov/gmail_connector).
