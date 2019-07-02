# Mac Shell proxy 调教指南

## 起因

本来想装个`VMware Fusion`, 结果网太卡, 装了一天都没装好

```shell
$ brew cask install vmware-fusion
==> Caveats
To install and/or use vmware-fusion you may need to enable its kernel extension in:
  System Preferences → Security & Privacy → General
For more information refer to vendor documentation or this Apple Technical Note:
  https://developer.apple.com/library/content/technotes/tn2459/_index.html

==> Satisfying dependencies
==> Downloading https://download3.vmware.com/software/fusion/file/VMware-Fusion-11.1.0-13668589.dmg
#########                                                                 13.5%
curl: (56) LibreSSL SSL_read: SSL_ERROR_SYSCALL, errno 60
Error: Download failed on Cask 'vmware-fusion' with message: Download failed: https://download3.vmware.com/software/fusion/file/VMware-Fusion-11.1.0-13668589.dmg
$ brew cask install vmware-fusion
==> Caveats
To install and/or use vmware-fusion you may need to enable its kernel extension in:
  System Preferences → Security & Privacy → General
For more information refer to vendor documentation or this Apple Technical Note:
  https://developer.apple.com/library/content/technotes/tn2459/_index.html

==> Satisfying dependencies
==> Downloading https://download3.vmware.com/software/fusion/file/VMware-Fusion-11.1.0-13668589.dmg
###########                                                               15.7%
curl: (56) LibreSSL SSL_read: SSL_ERROR_SYSCALL, errno 60
Error: Download failed on Cask 'vmware-fusion' with message: Download failed: https://download3.vmware.com/software/fusion/file/VMware-Fusion-11.1.0-13668589.dmg
```

上述这种蛋疼的情况循环了一天, 我终于忍不住去搜资料了

## 解决办法

原因是 shell 默认不走 ss 代理

解决办法很简单, 就是

```shell
export ALL_PROXY=socks5://127.0.0.1:1086
```

顺便吐个槽, 我明明记得以前 ss 的默认代理端口是 1080 来着, 什么时候改成 1086 了?

然而这样子不优雅, 因为:

- 忘了关闭, 导致国内某些站上不去咋办(比如 b 站)
- 下次忘了这些命令咋办

于是我把这些写进了`~/.bash_profile`:

```bash
alias ssproxy="export ALL_PROXY=socks5://127.0.0.1:1086"
alias ssunproxy="unset ALL_PROXY"
```

然后还是觉得这样不优雅, 于是就放进了`/usr/local/bin/ss`:

```bash
#!/bin/bash

case $1 in
  "proxy")
    export ALL_PROXY=socks5://127.0.0.1:1086
    echo "proxy to 127.0.0.1:1086"
    ;;
  "unproxy")
    unset ALL_PROXY
    echo "unproxy success"
    ;;
  *)
    echo "unknow command, expect proxy or unproxy"
    ;;
esac
```

然后给它加上可执行权限:

```shell
chmod +x ss
```

接着测试能否正常工作:

```shell
$ ss
unknow command, expect proxy or unproxy
$ ss proxy
proxy to 127.0.0.1:1086
$ curl cip.cc
IP: 1.1.1.1
地址: 墙内
运营商: 电信

URL: http://www.cip.cc/1.1.1.1
```

emmm, 发现一个坑, 就是 `export`, `declare` 只会修改当前 shell 的变量, 而直接执行的脚本会在一个新建的 shell 里执行, 所以脚本内修改的环境变量并不能影响全局

有个解决方法就是在脚本前加上`source`或`.`, 脚本就会在当前 shell 执行, 就能成功影响当前 shell 的环境变量

```shell
source ss proxy
. ss proxy
```

不过还是感觉不优雅, 期待更优雅的解法
