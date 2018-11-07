# [wu-yu-xuan.github.io](https://blog.mscorlib.top/)


wuyuxuan's github.io with React  
the website is running on [here](https://blog.mscorlib.top/)

- **blog:** this website contains a blog system without backend by writing descriptions into `list.json` while compiling
- **markdown:** this website use a DIY markdown interpreter to translate markdown into valid markdown in real time

## Tutorial

to use this project as your own blog, use the following steps:
1. `fork` and `clone` it
2. run `git checkout source` to switch to branch source
2. run `yarn` to install dependencies
3. run `git rm public/markdown/*` to delete this project's markdown and put your own markdown blog into this folder
4. run `yarn build` to build it, 
> NOTE: it may have error while first building, however building twice could fix it
5. run `yarn deploy` if you want to deploy it on your master branch

## Acknowledgment

- [vsocde](https://github.com/Microsoft/vscode)
- [react](https://github.com/facebook/react)
- [ant design](https://github.com/ant-design/ant-design)

## License

this website is under [MIT](https://github.com/wu-yu-xuan/wu-yu-xuan.github.io/blob/source/LICENSE) license