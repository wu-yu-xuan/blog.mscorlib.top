# [blog.mscorlib.top](https://blog.mscorlib.top/)

wuyuxuan's blog with React  
the website is running on [here](https://blog.mscorlib.top/)

- **blog:** this website contains a blog system without backend by writing descriptions into `list.json` while compiling
- **markdown:** this website uses a markdown interpreter to translate markdown into React component in real time

## Tutorial

to use this project as your own blog, follow the following steps:

1. `fork` and `clone` it
2. run `yarn` to install dependencies
3. modify `package.json` with you own info, especially `repository.url`
4. run `git rm public/markdown/*` to delete this project's markdown and put your own markdown blog into this folder
5. run `yarn start` to generate `list.json` and preview
6. use github actions to deploy, see [wu-yu-xuan/deploy-github-pages](https://github.com/wu-yu-xuan/deploy-github-pages)

## Acknowledgment

- [vscode](https://github.com/Microsoft/vscode)
- [react](https://github.com/facebook/react)
- [ant design](https://github.com/ant-design/ant-design)
- [wu-yu-xuan/web-router](https://github.com/wu-yu-xuan/web-router)
- [wu-yu-xuan/react-highlight](https://github.com/wu-yu-xuan/react-highlight)
- [wu-yu-xuan/deploy-github-pages](https://github.com/wu-yu-xuan/deploy-github-pages)

## License

this website is under [MIT](https://github.com/wu-yu-xuan/blog.mscorlib.top/blob/master/LICENSE) license
