/* eslint-disable */
const marked = require('marked');
const glob = require('glob');
const fs = require('fs');
const path = require('path');


// Get reference
const renderer = new marked.Renderer();

// Override function
renderer.heading = function (text, level) {
    return `
          <h${level}>
            ${text}
          </h${level}>`;
};

glob('src/blog-posts/md/*.md', function (err, files) {
    if (err) {
        console.log(err);
    } else {
        files.forEach(function (file) {
            fs.readFile(file, function (error, data) {
                if (error) {
                    console.log(error);
                } else {
                    const content = marked(data.toString());
                    const postName = path.basename(file);
                    const htmlName = postName.replace('.md', '.html')
                    fs.writeFile(`src/blog-posts/html/${htmlName}`, content, (err) => {
                        if (err) console.log(err);
                    });
                }
            });
        });
    }
});
// Run marked
// console.log(marked('# heading+', { renderer: renderer }));
