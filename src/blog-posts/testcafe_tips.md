# Using testcafe for a month

Testcafe is a Node.js based framework for running automated tests written in Javascript or Typescript.

Getting started is quite easy and the learning curve is not steep.

There are a few things to keep in mind that I want to share from using testcafe framework.

* Although the framework

* If you're not sure if your tests are capable of dealing with concurrent execution stay away from the `-c` flag when running them. This also means if you want to run the tests in a few browsers, do it one by one instead of specifying ```"browsers": ["chrome:headless", "firefox", "edge"]``` in the configuration.


* Add meaningfull messages to your assertions - this will save time looking for the reason behind error messages like that `Expected truthy to be falsy`

* When manipulating elements on the screen the framework checks their size and derives from that if the element is visible or not. Make sure you're targeting elements with at least a few pixels in size with your selectors. 

  * Visibility is also an issue if the targeted element is outside the viewport and can not be reached through scrolling. A separate tests run specifiying mobile device emulation can help with finding issues: `"testcafe 'chrome:emulation:device=iphone X' tests/*.ts"`
  
* When working together with other people using `.only` is a fast way to debug and run a single test. Pushing this to the shared repo though is a bad idea - especially if a build server picks it up automatically - this will result in running only one test. One possible workaround is adding a meta tag to your tests: `test.meta({'author': '<YOURNAME>'})`. This meta data is safe to stay in the source code and can be utilised to run an arbitrary number of tests like that: `testcafe chrome --test-meta author=<YOURNAME>`

* When test fails a screenshot is made. When running a test in different browsers each fail will throw a warning that the screenshot will be overriden. To overcome this add some more detail in the configuration to the way testcafe will build the file name and path: `"screenshotPathPattern": "${DATE}_${TIME}/${FIXTURE}/${USERAGENT}/${TEST}-${FILE_INDEX}.png"`. This way you'll have separate screenshots for each fail on each browser and will not loose any data.

* When using the request logger to catch requests and examine status codes and content try to avoid overly long specific urls. I suggest you use Regex option to make the rule which requests will match a much more robust one.

* Organizing your code with page model classes is a good idea. Encapsulating common flows in methods in these classes will turn out helpful when your tests grow in size, number and complexity. Also try to stick to defining selectors only in your page model - this separating the find my element logic from the business logic in the test itself.





