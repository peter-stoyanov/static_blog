# Git ignore patterns

Imagine the following folder structure in your app:

![folders](https://i.imgur.com/l0J0MMv.png)

The task is to ignore all files and folders recursively in the temp directory but keep the folder itself under source control.

The pattern that .gitignore files support is unix glob pattern.

Some extracts from the documentation that will come in handy:

* If there is a separator at the end of the pattern then the pattern will only match directories, otherwise the pattern can match both files and directories

* An optional prefix "!" which negates the pattern; any matching file excluded by a previous pattern will become included again

All of this [here](https://git-scm.com/docs/gitignore).

To exclude files and folders with any name recursively we can use `PATH/*`.

To keep the folder under source control we should add a .gitkeep file by convention. The problem is that it will be excluded by the previous line we just added. To go around this we can say that we want to specifically not ignore it with negation pattern: `!/temp/.gitkeep`.

The whole piece together:

```git
# ignore all files and folders in the temp directory
/temp/*

# do not ignore only the .gitkeep file so we have this empty folder under source control
!/temp/.gitkeep
```

Keep in mind that later rules override previous ones. The same two lines will not work if added in reversed order to the .gitignore file. 
