# Mac Shell PS1 调教指南

假定以下所用用户名为**root**,~~ 连`sudo`都懒得写 233,~~ 当然, 实际过程中建议不要玩**root**

在`/etc/bashrc`中, 可以看到, Mac PS1 的默认值为:

```shell
PS1='\h:\W \u\$ '
```

将这些变量替换为实际的值, 为:

> rootDeMacBookPro:~ root#

emmmm, 为还是觉得 Linux 风格的 PS1 好看, 于是在`~/.bash_profile`中加入以下代码:

```bash
export PS1="\u@\h:\W\$"
```

这样, 结果就变为了:

> root@rootDeMacBookPro:~#

两个 root, 感觉好蠢, 于是得去改 `hostname`

```shell
hostname alibaba-inc
```

结果为:

> root@alibaba-inc:~#

感觉不错, 然而一重启, `hostname` 就重置了, 所以得去左上角小苹果 🍎 -> 系统偏好设置 -> 共享 -> 编辑, 把 alibaba-inc 输入进去

其实我觉得这样很不极客, 然而并不知道 mac 的 hostname 放在哪个文件里, 就只能这样了(逃

然而一连网, `hostname` 就变为了 `promote.cache-dns.local`

喵喵喵?

去谷歌, 发现好像是 DHCP 的锅, 它会去获取本机 IP 所对应的域名, 然后把这个域名设为 `hostname`

可是, 并没有 `local` 或是 `cache-dns` 的根域名吧?

然后再谷歌, 发现了 `scutil`, 然后执行下列命令:

```shell
$ scutil --get HostName
HostName: not set
$ scutil --get LocalHostName
alibaba-inc
```

emmmm

所以我改了半天, 结果改的是 `LocalHostName` 而不是 `HostName`?

算了, 执行

```shell
scutil --set HostName alibaba-inc
```

重启 shell, 重启电脑, 联网, 好像没什么毛病了, 成功!
