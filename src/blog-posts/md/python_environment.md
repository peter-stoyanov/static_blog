# Install package for virtual environment support

```
python -m pip install virtualenv
```

```
python -m virtualenv env
```

// in folder with env
```
source ./env/Scripts/activate
```
On windows no source command, just run this:
```
venv\Scripts\activate
```

which python = should be path to project folder, not system wide

```
python -m pip freeze > requirements.txt
```

```
python -m pip install -r requirements.txt
```
