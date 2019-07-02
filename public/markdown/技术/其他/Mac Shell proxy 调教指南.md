# Mac Shell proxy 调教指南.md

## 起因

本来想装个`VMware Fusion`, 结果网太卡, 装了一天都没装好

```shell
wyx@alibaba-inc:~$brew cask install vmware-fusion
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
wyx@alibaba-inc:~$brew cask install vmware-fusion
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
wyx@alibaba-inc:Documents$export all_proxy=socks5://127.0.0.1:1086
```

顺便吐个槽, 我明明记得以前 ss 的默认代理端口是 1080 来着, 什么时候改成 1086 了?

然而这样子不优雅, 因为:

- 忘了关闭, 导致国内某些站上不去咋办(比如 b 站)
- 下次忘了这些命令咋办

于是我把这些写进了`~/.bash_profile`:

```bash
alias ssproxy="export all_proxy=socks5://127.0.0.1:1086"
alias ssunproxy="unset all_proxy"
```

然后还是觉得这样不优雅, 于是就放进了`/usr/local/bin/ss`:

```bash
#!/bin/bash

case $1 in
  "proxy")
    export all_proxy=socks5://127.0.0.1:1086
    echo "proxy to 127.0.0.1:1086"
    ;;
  "unproxy")
    unset all_proxy
    echo "unproxy success"
    ;;
  *)
    echo "unknow command, expect proxy or unproxy"
    ;;
esac
```

然后给它加上可执行权限:

```shell
wyx@alibaba-inc:bin$chmod +x ss
```

接着测试能否正常工作:

```shell
wyx@alibaba-inc:bin$ss
unknow command, expect proxy or unproxy
wyx@alibaba-inc:bin$ss proxy
proxy to 127.0.0.1:1086
wyx@alibaba-inc:bin$ss unproxy
unproxy success
```

看上去挺不错的 233
