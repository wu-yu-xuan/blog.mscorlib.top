# ACID

~~众所周知, ACID 是酸的意思, 本文结束(雾~~

ACID，是指[数据库管理系统（DBMS）](https://zh.wikipedia.org/wiki/%E6%95%B0%E6%8D%AE%E5%BA%93%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F)在写入或更新资料的过程中，
为保证[事务（transaction）](https://zh.wikipedia.org/wiki/%E6%95%B0%E6%8D%AE%E5%BA%93%E4%BA%8B%E5%8A%A1)是正确可靠的，
所必须具备的四个特性：[原子性（atomicity，或称不可分割性）](https://en.wikipedia.org/wiki/Atomicity)、
[一致性（consistency）](https://en.wikipedia.org/wiki/Consistency)、
[隔离性（isolation，又称独立性）](https://zh.wikipedia.org/wiki/%E9%9A%94%E9%9B%A2%E6%80%A7)、
[持久性（durability）](https://en.wikipedia.org/wiki/Durability)。

在数据库系统中，一个事务是指：由一系列数据库操作组成的一个完整的逻辑过程。
例如银行转帐，从原账户扣除金额，以及向目标账户添加金额，这两个数据库操作的总和，构成一个完整的逻辑过程，不可拆分。
这个过程被称为一个事务，具有 ACID 特性。
ACID 的概念在 [ISO/IEC 10026-1:1992](http://www.iso.org/iso/en/CatalogueDetailPage.CatalogueDetail?CSNUMBER=27121&COMMID=&scopelist=) 文件的第四段内有所说明。

- **Atomicity（原子性）**：一个事务（transaction）中的所有操作，或者全部完成，或者全部不完成，不会结束在中间某个环节。事务在执行过程中发生错误，会被回滚（Rollback）到事务开始前的状态，就像这个事务从来没有执行过一样。即，事务不可分割、不可约简。
- **Consistency（一致性）**：在事务开始之前和事务结束以后，数据库的完整性没有被破坏。这表示写入的资料必须完全符合所有的预设约束、触发器、级联回滚等。
- **Isolation（隔离性）**：数据库允许多个并发事务同时对其数据进行读写和修改的能力，隔离性可以防止多个事务并发执行时由于交叉执行而导致数据的不一致。事务隔离分为不同级别，包括未提交读（Read uncommitted）、提交读（read committed）、可重复读（repeatable read）和串行化（Serializable）。
- **Durability（持久性）**：事务处理结束后，对数据的修改就是永久的，即便系统故障也不会丢失。

## Reference From

[ACID - 维基百科](https://zh.wikipedia.org/wiki/ACID)
