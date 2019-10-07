# Generate git repo statistics with Git-Hammer




[this github project](https://github.com/asharov/git-hammer)


```git
git shortlog -sn --no-merges
    99  Petar Stoyanov
    80  milinov
    46  Alexander Pavlov   
     8  Nikolay
     4  d.donev@blubito.com
     1  Jordan Jordanov    
     1  NIkolay
```


```shell
python -m pip install virtualenv


venv\Scripts\activate


python -m pip install -r requirements.txt


python -m githammer init-project automation D:\bk-qa-automation


# python -m githammer update-project baffle


python -m githammer summary automation


python -m githammer graph automation line-author-count

python -m githammer graph automation day-of-week

python -m githammer graph automation time-of-day
```

## Results

![Imgur](https://i.imgur.com/mAm5rI4.png)

![Imgur](https://i.imgur.com/V24YrYF.png)

![Imgur](https://i.imgur.com/kmEZUp2.png)

![Imgur](https://i.imgur.com/tD6WKcE.png)

