# [blog.mscorlib.top](https://blog.mscorlib.top/)

wuyuxuan's blog with React  
the website is running on [here](https://blog.mscorlib.top/)

- **blog:** this website contains a blog system without backend by writing descriptions into `list.json` while compiling
- **markdown:** this website use a DIY markdown interpreter to translate markdown into valid HTML in real time

## Tutorial

to use this project as your own blog, use the following steps:

1. `fork` and `clone` it
2. run `yarn` to install dependencies
3. modify `package.json` with you own info, especially `repository.url`
4. run `git rm public/markdown/*` to delete this project's markdown and put your own markdown blog into this folder
5. run `yarn build` to build it,
   > NOTE: it may have error while first building, however building twice could fix it
6. use github actions to deploy, see [peaceiris/actions-gh-pages](https://github.com/peaceiris/actions-gh-pages)

## Acknowledgment

- [vscode](https://github.com/Microsoft/vscode)
- [react](https://github.com/facebook/react)
- [ant design](https://github.com/ant-design/ant-design)

## License

this website is under [MIT](https://github.com/wu-yu-xuan/blog.mscorlib.top/blob/master/LICENSE) license
