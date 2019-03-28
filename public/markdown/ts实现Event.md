# ts实现Event

> talk is cheap, show me your code

```typescript
interface IOpions {
  once: boolean;
}

interface IListener {
  listener: (...args: any[]) => void;
  options: IOpions;
}

class MyEvent {
  private listenerMap = new Map<string, IListener[]>();
  public on(type: string, listener: (...args: any[]) => void, options: IOpions = { once: false }) {
    const old = this.listenerMap.get(type) || [];
    old.push({ listener, options });
    this.listenerMap.set(type, old);
  }
  public once(type: string, listener: (...args: any[]) => void) {
    return this.on(type, listener, { once: true });
  }
  public listeners(type: string) {
    return (this.listenerMap.get(type) || []).map(l => l.listener);
  }
  public trigger(type: string, ...args: any[]) {
    this.listenerMap.set(type, (this.listenerMap.get(type) || []).reduce<IListener[]>((acc, cur) => {
      cur.listener(...args);
      if (!cur.options.once) {
        acc.push(cur);
      }
      return acc;
    }, []));
  }
  public remove(type: string, listener: (...args: any[]) => void) {
    const result = this.listenerMap.get(type) || [];
    const index = result.findIndex(l => l.listener === listener);
    if (index === -1) {
      return;
    }
    result.splice(index, 1);
    this.listenerMap.set(type, result);
  }
  public removeAll(type: string) {
    this.listenerMap.set(type, []);
  }
}

const e = new MyEvent();
function t(sth: string) {
  console.log(sth);
}
e.on('wyx', t);
e.once('wyx', () => console.log('222'));
e.trigger('wyx', '111');
e.trigger('wyx', '333');
e.remove('wyx', t);
e.trigger('wyx');
```

result:

```
111
222
333
```